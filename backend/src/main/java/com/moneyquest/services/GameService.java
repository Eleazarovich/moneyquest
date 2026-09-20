package com.moneyquest.services;

import com.moneyquest.api.GameMapper;
import com.moneyquest.api.dto.ApiDtos;
import com.moneyquest.entities.DecisionEntity;
import com.moneyquest.entities.DebtAccountEntity;
import com.moneyquest.entities.LifeEventEntity;
import com.moneyquest.entities.RecurringCommitmentEntity;
import com.moneyquest.entities.RunEntity;
import com.moneyquest.entities.SavingsBucketEntity;
import com.moneyquest.entities.TransactionEntity;
import com.moneyquest.exceptions.ApiException;
import com.moneyquest.repositories.DecisionRepository;
import com.moneyquest.repositories.LifeEventRepository;
import com.moneyquest.repositories.QuestRepository;
import com.moneyquest.repositories.RunRepository;
import com.moneyquest.repositories.TaxConfigurationRepository;
import com.moneyquest.security.AuthenticatedPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class GameService {
    private static final BigDecimal ZERO = BigDecimal.ZERO.setScale(2);
    private static final BigDecimal INTEREST_RATE = new BigDecimal("0.18000");
    private static final List<String> DEFAULT_CATEGORIES = List.of(
        "Housing", "Transport", "Groceries", "Entertainment", "Utilities", "Clothing",
        "FamilySupport", "Savings", "DebtRepayments", "Convenience", "Travel", "Smartphone");

    private final QuestService questService;
    private final RunRepository runRepository;
    private final QuestRepository questRepository;
    private final DecisionRepository decisionRepository;
    private final LifeEventRepository lifeEventRepository;
    private final TaxConfigurationRepository taxConfigurationRepository;
    private final GameMapper mapper;

    public GameService(QuestService questService, RunRepository runRepository, QuestRepository questRepository,
                       DecisionRepository decisionRepository, LifeEventRepository lifeEventRepository,
                       TaxConfigurationRepository taxConfigurationRepository, GameMapper mapper) {
        this.questService = questService; this.runRepository = runRepository; this.questRepository = questRepository;
        this.decisionRepository = decisionRepository; this.lifeEventRepository = lifeEventRepository;
        this.taxConfigurationRepository = taxConfigurationRepository; this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public ApiDtos.PlayerStateResponse getState(String runId, AuthenticatedPrincipal principal) {
        return mapper.state(questService.getOwnedRun(runId, principal.subject()));
    }

    @Transactional
    public ApiDtos.ProcessMonthResponse processMonth(String runId, int month, AuthenticatedPrincipal principal) {
        validateMonth(month);
        RunEntity run = questService.getOwnedRun(runId, principal.subject());
        if (month <= run.getCurrentMonth()) {
            return new ApiDtos.ProcessMonthResponse(List.of(), List.of(), run.getTransactions().stream()
                .filter(transaction -> transaction.getMonth() == month).map(mapper::transaction).toList());
        }
        if (month != run.getCurrentMonth() + 1) {
            throw badRequest("Months must be processed in order.", "MONTH_OUT_OF_ORDER");
        }

        Instant now = Instant.now();
        BigDecimal cash = run.getAvailableCash();
        List<ApiDtos.TransactionResponse> generatedTransactions = new ArrayList<>();
        var tax = taxConfigurationRepository.findById("2026-27")
            .orElseThrow(() -> new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Default tax configuration is missing.", "MISSING_TAX_CONFIGURATION"));
        cash = cash.add(run.getGrossIncome());
        addTransaction(run, generatedTransactions, "SALARY_GROSS", run.getGrossIncome(), "Gross salary", month, cash, now);
        cash = cash.subtract(tax.getPaye());
        addTransaction(run, generatedTransactions, "PAYE", tax.getPaye().negate(), "PAYE tax deduction", month, cash, now);
        cash = cash.subtract(tax.getUif());
        addTransaction(run, generatedTransactions, "UIF", tax.getUif().negate(), "UIF contribution", month, cash, now);
        cash = cash.add(tax.getNetSalary()).subtract(run.getGrossIncome().subtract(tax.getPaye()).subtract(tax.getUif()));
        // Salary net is the cash actually received; the preceding payslip rows are explanatory ledger entries.
        cash = run.getAvailableCash().add(tax.getNetSalary());
        addTransaction(run, generatedTransactions, "SALARY_NET", tax.getNetSalary(), "Net salary received", month, cash, now);

        boolean savedThisMonth = false;
        for (RecurringCommitmentEntity commitment : run.getRecurringCommitments()) {
            if (!isActive(commitment, month) || commitment.getAmount().compareTo(ZERO) <= 0) continue;
            String type = transactionTypeFor(commitment.getCategory());
            cash = cash.subtract(commitment.getAmount());
            addTransaction(run, generatedTransactions, type, commitment.getAmount().negate(), commitment.getName(), month, cash, now);
            addCategory(run, commitment.getCategory(), commitment.getAmount());
            if ("Savings".equals(commitment.getCategory())) {
                savedThisMonth = true;
                SavingsBucketEntity bucket = emergencyBucket(run);
                bucket.setBalance(bucket.getBalance().add(commitment.getAmount()));
                bucket.setMonthlyContribution(commitment.getAmount());
                run.setTotalSavings(run.getTotalSavings().add(commitment.getAmount()));
            }
        }
        for (DebtAccountEntity debt : run.getDebts()) {
            if (!debt.isActive() || debt.getStartMonth() >= month) continue;
            BigDecimal repayment = debt.getMonthlyRepayment().min(debt.getBalance());
            if (repayment.compareTo(ZERO) <= 0) { debt.setActive(false); continue; }
            cash = cash.subtract(repayment);
            addTransaction(run, generatedTransactions, "DEBT_REPAYMENT", repayment.negate(), "Repayment — " + debt.getName(), month, cash, now);
            debt.setBalance(debt.getBalance().subtract(repayment));
            addCategory(run, "DebtRepayments", repayment);
            if (debt.getBalance().compareTo(ZERO) <= 0) debt.setActive(false);
        }

        List<LifeEventResponseWithEntity> selectedEvents = selectEvents(run, month, cash, generatedTransactions, now);
        cash = selectedEvents.isEmpty() ? cash : selectedEvents.get(selectedEvents.size() - 1).cashAfter();
        List<LifeEventEntity> eventEntities = selectedEvents.stream().map(LifeEventResponseWithEntity::event).toList();
        List<DecisionEntity> decisions = decisionRepository.findByMonthOrderById(month).stream()
            .filter(decision -> !mapper.readList(run.getDecisionsCompleted()).contains(decision.getId())).toList();

        run.setAvailableCash(cash);
        run.setCurrentMonth(month);
        run.setGamePhase("playing");
        if (savedThisMonth) run.setMonthsWithSavings(run.getMonthsWithSavings() + 1);
        run.touch(now);
        runRepository.save(run);
        return new ApiDtos.ProcessMonthResponse(eventEntities.stream().map(mapper::event).toList(),
            decisions.stream().map(mapper::decision).toList(), generatedTransactions);
    }

    @Transactional
    public ApiDtos.MakeDecisionResponse makeDecision(String runId, String decisionId, ApiDtos.MakeDecisionRequest request,
                                                     AuthenticatedPrincipal principal) {
        RunEntity run = questService.getOwnedRun(runId, principal.subject());
        List<String> completed = mapper.readList(run.getDecisionsCompleted());
        if (completed.contains(decisionId)) throw new ApiException(HttpStatus.CONFLICT, "Decision was already completed.", "DECISION_COMPLETED");
        DecisionEntity decision = decisionRepository.findById(decisionId)
            .orElseThrow(() -> notFound("Decision", "DECISION_NOT_FOUND"));
        if (decision.getMonth() > run.getCurrentMonth()) throw badRequest("This decision is not available yet.", "DECISION_NOT_AVAILABLE");
        ApiDtos.DecisionOptionResponse option = mapper.readOptions(decision.getOptionsJson()).stream()
            .filter(value -> value.id().equals(request.optionId())).findFirst()
            .orElseThrow(() -> badRequest("The selected option is not valid for this decision.", "OPTION_NOT_FOUND"));

        Instant now = Instant.now();
        BigDecimal cash = run.getAvailableCash();
        if (option.cost().compareTo(ZERO) > 0) {
            cash = cash.subtract(option.cost());
            addTransaction(run, null, "PURCHASE", option.cost().negate(), option.label() + " — upfront", run.getCurrentMonth(), cash, now);
        }
        if (option.monthlyCommitment() != null && option.commitmentName() != null) {
            if (option.debtOffer() != null) {
                BigDecimal principalAmount = option.cost().add(option.monthlyCommitment().multiply(BigDecimal.valueOf(option.debtOffer().term() - 1L)));
                BigDecimal balance = option.monthlyCommitment().multiply(BigDecimal.valueOf(option.debtOffer().term()));
                run.addDebt(new DebtAccountEntity(UUID.randomUUID().toString(), option.commitmentName(), option.debtOffer().provider(),
                    principalAmount, balance, option.monthlyCommitment(), INTEREST_RATE, run.getCurrentMonth(), true));
            } else if (option.monthlyCommitment().compareTo(ZERO) < 0) {
                run.getRecurringCommitments().stream().filter(value -> "Housing".equals(value.getCategory())).findFirst()
                    .ifPresent(value -> value.setAmount(value.getAmount().add(option.monthlyCommitment())));
            } else {
                String category = "Savings".equals(decision.getCategory()) ? "Savings" : decision.getCategory();
                run.addCommitment(new RecurringCommitmentEntity(UUID.randomUUID().toString(), option.commitmentName(), option.monthlyCommitment(),
                    category, run.getCurrentMonth(), null, true));
                if ("Savings".equals(category)) emergencyBucket(run).setMonthlyContribution(option.monthlyCommitment());
            }
        }
        if ("Housing".equals(decision.getCategory())) run.setHousingChoice(option.id());
        if ("Transport".equals(decision.getCategory())) run.setTransportChoice(option.id());
        if ("Smartphone".equals(decision.getCategory())) run.setPhoneChoice(option.id());
        completed = new ArrayList<>(completed); completed.add(decisionId); run.setDecisionsCompleted(mapper.write(completed));
        addCategory(run, decision.getCategory(), option.cost());
        List<String> moments = mapper.readList(run.getMoneyMomentsSeen());
        ApiDtos.MoneyMomentResponse moment = chooseMoneyMoment(run, decision, option, moments);
        if (moment != null) { moments = new ArrayList<>(moments); moments.add(moment.id()); run.setMoneyMomentsSeen(mapper.write(moments)); }
        run.setAvailableCash(cash); run.touch(now); runRepository.save(run);
        return new ApiDtos.MakeDecisionResponse(mapper.state(run), moment);
    }

    @Transactional(readOnly = true)
    public ApiDtos.FinancialHealthResponse financialHealth(String runId, AuthenticatedPrincipal principal) {
        RunEntity run = questService.getOwnedRun(runId, principal.subject());
        BigDecimal monthlyCost = run.getRecurringCommitments().stream().filter(RecurringCommitmentEntity::isActive).map(RecurringCommitmentEntity::getAmount).reduce(ZERO, BigDecimal::add)
            .add(run.getDebts().stream().filter(DebtAccountEntity::isActive).map(DebtAccountEntity::getMonthlyRepayment).reduce(ZERO, BigDecimal::add));
        BigDecimal emergency = emergencyBucket(run).getBalance();
        BigDecimal debt = run.getDebts().stream().filter(DebtAccountEntity::isActive).map(DebtAccountEntity::getBalance).reduce(ZERO, BigDecimal::add);
        return new ApiDtos.FinancialHealthResponse(run.getCurrentMonth(),
            dimension(emergency.divide(new BigDecimal("8000"), 2, RoundingMode.HALF_UP), "Emergency savings cover unexpected shocks."),
            dimension(run.getAvailableCash().divide(new BigDecimal("21441.88"), 2, RoundingMode.HALF_UP), "Cash gives you room to handle the next month."),
            dimension(BigDecimal.ONE.subtract(debt.divide(new BigDecimal("50000"), 2, RoundingMode.HALF_UP)), "Lower debt preserves more of tomorrow's income."),
            dimension(run.getMonthsWithSavings() == 0 ? ZERO : BigDecimal.valueOf(Math.min(run.getMonthsWithSavings(), 12)).divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP), "Consistency matters more than a perfect first deposit."),
            dimension(BigDecimal.ONE.subtract(monthlyCost.divide(run.getNetIncome(), 2, RoundingMode.HALF_UP)), "A sustainable lifestyle leaves choices for surprises."));
    }

    @Transactional(readOnly = true)
    public ApiDtos.YearInMoneyResponse yearInMoney(String runId, AuthenticatedPrincipal principal) {
        RunEntity run = questService.getOwnedRun(runId, principal.subject());
        BigDecimal annualGross = run.getGrossIncome().multiply(BigDecimal.valueOf(12));
        BigDecimal annualNet = run.getNetIncome().multiply(BigDecimal.valueOf(12));
        BigDecimal debtRepaid = run.getTransactions().stream().filter(value -> "DEBT_REPAYMENT".equals(value.getType())).map(value -> value.getAmount().abs()).reduce(ZERO, BigDecimal::add);
        BigDecimal spent = run.getTransactions().stream().filter(value -> value.getAmount().compareTo(ZERO) < 0 && !List.of("PAYE", "UIF", "SALARY_GROSS", "SALARY_NET", "SAVINGS_TRANSFER", "DEBT_REPAYMENT").contains(value.getType())).map(value -> value.getAmount().abs()).reduce(ZERO, BigDecimal::add);
        BigDecimal finalDebt = run.getDebts().stream().map(DebtAccountEntity::getBalance).reduce(ZERO, BigDecimal::add);
        List<ApiDtos.AnnualisedSurpriseResponse> surprises = List.of(
            annualised("Rent", run, "Housing", new BigDecimal("9500"), "Your apartment's monthly price compounds across the year."),
            annualised("Transport", run, "Transport", new BigDecimal("1800"), "Getting around Johannesburg has a monthly and annual cost."),
            new ApiDtos.AnnualisedSurpriseResponse("Convenience & Entertainment", new BigDecimal("2200"), new BigDecimal("26400"), "Small outings, food deliveries, and social events add up."));
        List<ApiDtos.KeyDecisionResponse> keyDecisions = new ArrayList<>();
        if (run.getHousingChoice() != null) keyDecisions.add(new ApiDtos.KeyDecisionResponse(1, "Where you chose to live", choiceLabel(run.getHousingChoice()), "Housing is one of the biggest recurring choices in the year."));
        if (run.getPhoneChoice() != null) keyDecisions.add(new ApiDtos.KeyDecisionResponse(2, "The phone decision", choiceLabel(run.getPhoneChoice()), run.getPhoneChoice().contains("premium") ? "A contract trades today's cash for future monthly flexibility." : "Repairing a device kept a recurring commitment out of the budget."));
        if (run.getTransportChoice() != null) keyDecisions.add(new ApiDtos.KeyDecisionResponse(3, "Transport choice", choiceLabel(run.getTransportChoice()), "Transport changes how much cash is available for everything else."));
        keyDecisions.add(new ApiDtos.KeyDecisionResponse(5, "Your savings habit", run.getMonthsWithSavings() > 0 ? "Started an emergency savings habit" : "Did not establish a saving habit", "A small repeatable habit builds resilience over time."));
        return new ApiDtos.YearInMoneyResponse(annualGross, annualNet, spent, run.getTotalSavings(), finalDebt, debtRepaid,
            mapper.readMap(run.getCategorySpend()), surprises, keyDecisions, monthlyBreakdown(run));
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.WhatIfForkResponse> whatIfForks(String runId, AuthenticatedPrincipal principal) {
        RunEntity run = questService.getOwnedRun(runId, principal.subject());
        return buildForks(run);
    }

    @Transactional(readOnly = true)
    public ApiDtos.WhatIfForkResponse simulateWhatIf(String runId, ApiDtos.SimulateWhatIfRequest request, AuthenticatedPrincipal principal) {
        return buildForks(questService.getOwnedRun(runId, principal.subject())).stream()
            .filter(fork -> fork.id().equals(request.forkId())).findFirst()
            .orElseThrow(() -> notFound("What-if fork", "FORK_NOT_FOUND"));
    }

    @Transactional
    public ApiDtos.PlayerStateResponse replay(String runId, AuthenticatedPrincipal principal) {
        RunEntity oldRun = questService.getOwnedRun(runId, principal.subject());
        int newSeed = (int) (((long) oldRun.getSeed() * 1103515245L + 12345L) & 0x7fffffffL);
        if (newSeed == 0) newSeed = 1;
        String questId = UUID.randomUUID().toString();
        var quest = new com.moneyquest.entities.QuestEntity(questId, oldRun.getOwnerSubject(), newSeed, Instant.now());
        quest.markStarted(); questRepository.save(quest);
        RunEntity fresh = new RunEntity(UUID.randomUUID().toString(), questId, oldRun.getOwnerSubject(), newSeed,
            oldRun.getGrossIncome(), oldRun.getNetIncome(), Instant.now());
        fresh.addSavingsBucket(new SavingsBucketEntity("bucket-emergency-" + fresh.getId(), "Emergency Fund", ZERO, ZERO, true));
        runRepository.save(fresh);
        return mapper.state(fresh);
    }

    private List<LifeEventResponseWithEntity> selectEvents(RunEntity run, int month, BigDecimal cash,
                                                            List<ApiDtos.TransactionResponse> generated, Instant now) {
        List<String> experienced = mapper.readList(run.getEventsExperienced());
        List<LifeEventResponseWithEntity> selected = new ArrayList<>();
        BigDecimal currentCash = cash;
        List<LifeEventEntity> candidates = lifeEventRepository.findByMonthOrderById(month);
        for (int index = 0; index < candidates.size(); index++) {
            LifeEventEntity event = candidates.get(index);
            double random = Math.sin(run.getSeed() + month * 100.0 + index) * 10000;
            random -= Math.floor(random);
            if (experienced.contains(event.getId()) || random >= event.getProbability().doubleValue()) continue;
            currentCash = currentCash.add(event.getCashEffect() == null ? ZERO : event.getCashEffect());
            if (event.getCashEffect() != null && event.getTransactionType() != null) {
                addTransaction(run, generated, event.getTransactionType(), event.getCashEffect(), event.getTitle(), month, currentCash, now);
                if (event.getCashEffect().compareTo(ZERO) < 0) addCategory(run, categoryForTransaction(event.getTransactionType()), event.getCashEffect().abs());
            }
            experienced = new ArrayList<>(experienced); experienced.add(event.getId()); run.setEventsExperienced(mapper.write(experienced));
            selected.add(new LifeEventResponseWithEntity(event, currentCash));
        }
        return selected;
    }

    private BigDecimal addTransaction(RunEntity run, List<ApiDtos.TransactionResponse> response, String type, BigDecimal amount,
                                      String description, int month, BigDecimal runningBalance, Instant now) {
        TransactionEntity entity = new TransactionEntity(UUID.randomUUID().toString(), type, amount, description, month, now, runningBalance);
        run.addTransaction(entity);
        if (response != null) response.add(mapper.transaction(entity));
        return runningBalance;
    }

    private void addCategory(RunEntity run, String category, BigDecimal amount) {
        Map<String, BigDecimal> spend = mapper.readMap(run.getCategorySpend());
        spend.putIfAbsent(category, ZERO);
        spend.put(category, spend.get(category).add(amount));
        run.setCategorySpend(mapper.write(spend));
        run.setMonthlyCategorySpend(mapper.write(spend));
    }

    private SavingsBucketEntity emergencyBucket(RunEntity run) {
        return run.getSavingsBuckets().stream().filter(SavingsBucketEntity::isEmergencyFund).findFirst()
            .orElseThrow(() -> new IllegalStateException("Emergency savings bucket is missing"));
    }

    private boolean isActive(RecurringCommitmentEntity commitment, int month) {
        return commitment.isActive() && commitment.getStartMonth() <= month && (commitment.getEndMonth() == null || commitment.getEndMonth() >= month);
    }

    private String transactionTypeFor(String category) {
        return switch (category) { case "Housing" -> "RENT"; case "Transport" -> "TRANSPORT"; case "Savings" -> "SAVINGS_TRANSFER"; default -> "PURCHASE"; };
    }

    private String categoryForTransaction(String type) {
        return switch (type) { case "ENTERTAINMENT" -> "Entertainment"; case "FAMILY_SUPPORT" -> "FamilySupport"; case "EMERGENCY_EXPENSE" -> "Convenience"; default -> "Income"; };
    }

    private ApiDtos.HealthDimensionResponse dimension(BigDecimal value, String explanation) {
        BigDecimal bounded = value.max(ZERO).min(BigDecimal.ONE);
        String state = bounded.compareTo(new BigDecimal("0.85")) >= 0 ? "Strong" : bounded.compareTo(new BigDecimal("0.68")) >= 0 ? "Healthy" : bounded.compareTo(new BigDecimal("0.50")) >= 0 ? "Stable" : bounded.compareTo(new BigDecimal("0.30")) >= 0 ? "Building" : bounded.compareTo(new BigDecimal("0.15")) >= 0 ? "Vulnerable" : "Critical";
        return new ApiDtos.HealthDimensionResponse(state, bounded, explanation);
    }

    private ApiDtos.MoneyMomentResponse chooseMoneyMoment(RunEntity run, DecisionEntity decision, ApiDtos.DecisionOptionResponse option, List<String> seen) {
        if (run.getAvailableCash().compareTo(new BigDecimal("3000")) < 0 && !seen.contains("mm-where-did-money-go")) return new ApiDtos.MoneyMomentResponse("mm-where-did-money-go", "Where did the money go?", "A few attractive choices can leave less room than expected.", "The monthly number is only one part of a financial decision.", "🔎", "Available cash falls below R3,000", Map.of("availableCash", run.getAvailableCash()));
        if ("Housing".equals(decision.getCategory()) && !seen.contains("mm-real-cost-apartment")) return new ApiDtos.MoneyMomentResponse("mm-real-cost-apartment", "The real cost of a home", "Rent is a monthly promise that follows you through the year.", "Recurring commitments shape future choices before everyday spending begins.", "🏠", "A housing decision is completed", Map.of("monthlyRent", option.monthlyCommitment() == null ? ZERO : option.monthlyCommitment(), "annualRent", (option.monthlyCommitment() == null ? ZERO : option.monthlyCommitment()).multiply(BigDecimal.valueOf(12))));
        if (option.debtOffer() != null && !seen.contains("mm-tomorrows-money")) return new ApiDtos.MoneyMomentResponse("mm-tomorrows-money", "Borrowing uses tomorrow's money", "The instalment feels manageable today because it arrives every month after today.", "Debt changes the cash you will have available for future decisions.", "💳", "A credit option is selected", Map.of("monthlyRepayment", option.debtOffer().monthlyRepayment(), "term", BigDecimal.valueOf(option.debtOffer().term())));
        if ("Savings".equals(decision.getCategory()) && option.monthlyCommitment() != null && option.monthlyCommitment().compareTo(ZERO) > 0 && !seen.contains("mm-small-habit")) return new ApiDtos.MoneyMomentResponse("mm-small-habit", "Small habits become real buffers", "The first deposit is small. Its value is that it repeats.", "Consistency is what turns a good intention into resilience.", "🛡️", "A savings commitment is selected", Map.of("monthlySaving", option.monthlyCommitment(), "annualSaving", option.monthlyCommitment().multiply(BigDecimal.valueOf(12))));
        return null;
    }

    private List<ApiDtos.MonthSummaryResponse> monthlyBreakdown(RunEntity run) {
        List<ApiDtos.MonthSummaryResponse> result = new ArrayList<>();
        String[] labels = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        for (int month = 1; month <= 12; month++) {
            int requestedMonth = month;
            List<TransactionEntity> transactions = run.getTransactions().stream().filter(value -> value.getMonth() == requestedMonth).toList();
            BigDecimal committed = run.getRecurringCommitments().stream().filter(value -> isActive(value, requestedMonth)).map(RecurringCommitmentEntity::getAmount).reduce(ZERO, BigDecimal::add);
            BigDecimal debt = transactions.stream().filter(value -> "DEBT_REPAYMENT".equals(value.getType())).map(value -> value.getAmount().abs()).reduce(ZERO, BigDecimal::add);
            BigDecimal spent = transactions.stream().filter(value -> value.getAmount().compareTo(ZERO) < 0 && !List.of("PAYE", "UIF").contains(value.getType())).map(value -> value.getAmount().abs()).reduce(ZERO, BigDecimal::add);
            BigDecimal available = transactions.isEmpty() ? (month == run.getCurrentMonth() ? run.getAvailableCash() : ZERO) : transactions.get(transactions.size() - 1).getRunningBalance();
            BigDecimal savings = transactions.stream().filter(value -> "SAVINGS_TRANSFER".equals(value.getType())).map(value -> value.getAmount().abs()).reduce(ZERO, BigDecimal::add);
            result.add(new ApiDtos.MonthSummaryResponse(month, labels[month - 1], run.getGrossIncome(), run.getNetIncome(), committed, debt, spent, available, savings,
                lifeEventRepository.findByMonthOrderById(month).stream().map(LifeEventEntity::getId).toList(), decisionRepository.findByMonthOrderById(month).stream().map(DecisionEntity::getId).toList()));
        }
        return result;
    }

    private ApiDtos.AnnualisedSurpriseResponse annualised(String label, RunEntity run, String category, BigDecimal fallback, String description) {
        BigDecimal monthly = run.getRecurringCommitments().stream().filter(value -> category.equals(value.getCategory()) && value.isActive()).map(RecurringCommitmentEntity::getAmount).reduce(ZERO, BigDecimal::add);
        if (monthly.compareTo(ZERO) == 0) monthly = fallback;
        return new ApiDtos.AnnualisedSurpriseResponse(label, monthly, monthly.multiply(BigDecimal.valueOf(12)), description);
    }

    private String choiceLabel(String choice) {
        if (choice.contains("premium")) return "Premium option";
        if (choice.contains("mid")) return "Mid-range option";
        if (choice.contains("car")) return "Bought the Corolla";
        if (choice.contains("public")) return "Gautrain + Uber";
        return choice;
    }

    private List<ApiDtos.WhatIfForkResponse> buildForks(RunEntity run) {
        BigDecimal debt = run.getDebts().stream().map(DebtAccountEntity::getBalance).reduce(ZERO, BigDecimal::add);
        BigDecimal baseSpent = run.getTransactions().stream().filter(value -> value.getAmount().compareTo(ZERO) < 0).map(value -> value.getAmount().abs()).reduce(ZERO, BigDecimal::add);
        BigDecimal months = BigDecimal.valueOf(Math.max(run.getCurrentMonth(), 1));
        ApiDtos.WhatIfOutcomeResponse original = outcome(run.getAvailableCash(), run.getTotalSavings(), debt, baseSpent, run.getAvailableCash().divide(months, 2, RoundingMode.HALF_UP), emergencyBucket(run).getBalance());
        BigDecimal housing = run.getRecurringCommitments().stream().filter(value -> "Housing".equals(value.getCategory()) && value.isActive()).map(RecurringCommitmentEntity::getAmount).findFirst().orElse(new BigDecimal("9500"));
        BigDecimal phone = run.getDebts().stream().filter(value -> value.getName().toLowerCase().contains("phone") || value.getName().toLowerCase().contains("galaxy")).map(DebtAccountEntity::getMonthlyRepayment).findFirst().orElse(ZERO);
        ApiDtos.WhatIfOutcomeResponse cheaperHome = outcome(run.getAvailableCash().add(housing.subtract(new BigDecimal("6500")).multiply(BigDecimal.valueOf(Math.max(run.getCurrentMonth() - 1, 0)))), run.getTotalSavings().add(housing.subtract(new BigDecimal("6500")).multiply(BigDecimal.valueOf(Math.max(run.getCurrentMonth() / 2, 0)))), debt, baseSpent.subtract(housing.subtract(new BigDecimal("6500"))), run.getAvailableCash().divide(months, 2, RoundingMode.HALF_UP), emergencyBucket(run).getBalance());
        ApiDtos.WhatIfOutcomeResponse oldPhone = outcome(run.getAvailableCash().add(phone.multiply(BigDecimal.valueOf(Math.max(run.getCurrentMonth() - 2, 0)))), run.getTotalSavings().add(phone.multiply(BigDecimal.valueOf(Math.max(run.getCurrentMonth() / 2, 0)))), debt.subtract(phone.multiply(BigDecimal.valueOf(Math.max(run.getCurrentMonth() - 2, 0)))).max(ZERO), baseSpent.subtract(phone), run.getAvailableCash().divide(months, 2, RoundingMode.HALF_UP), emergencyBucket(run).getBalance());
        ApiDtos.WhatIfOutcomeResponse savedEarly = outcome(run.getAvailableCash(), run.getTotalSavings().max(new BigDecimal("12000")), debt.subtract(new BigDecimal("3000")).max(ZERO), baseSpent, run.getAvailableCash().divide(months, 2, RoundingMode.HALF_UP), new BigDecimal("12000"));
        return List.of(
            new ApiDtos.WhatIfForkResponse("fork-apartment", "What if you chose the cheaper apartment?", "Instead of paying the current monthly housing cost, you chose Roodepoort at R6,500/month.", 1, "Current apartment", "Roodepoort Flatlet — R6,500/month", original, cheaperHome),
            new ApiDtos.WhatIfForkResponse("fork-phone", "What if you kept your old phone?", "Instead of a phone contract, you repaired your screen for R450 once.", 2, phone.compareTo(ZERO) > 0 ? "Phone contract" : "Repaired screen (R450)", "Screen repair — R450 once", original, oldPhone),
            new ApiDtos.WhatIfForkResponse("fork-savings", "What if you saved R1,000 every month?", "Starting from Month 1, R1,000 automatically moved to your emergency fund every payday.", 1, "Your current savings habit", "R1,000/month emergency savings from Month 1", original, savedEarly));
    }

    private ApiDtos.WhatIfOutcomeResponse outcome(BigDecimal cash, BigDecimal savings, BigDecimal debt, BigDecimal spent, BigDecimal monthlyAvailable, BigDecimal emergency) {
        return new ApiDtos.WhatIfOutcomeResponse(cash, savings, debt, spent, monthlyAvailable, debt.compareTo(ZERO) == 0, emergency.divide(new BigDecimal("8000"), 2, RoundingMode.HALF_UP));
    }

    private void validateMonth(int month) { if (month < 1 || month > 12) throw badRequest("Month must be between 1 and 12.", "INVALID_MONTH"); }
    private ApiException badRequest(String message, String code) { return new ApiException(HttpStatus.BAD_REQUEST, message, code); }
    private ApiException notFound(String resource, String code) { return new ApiException(HttpStatus.NOT_FOUND, resource + " was not found.", code); }
    private record LifeEventResponseWithEntity(LifeEventEntity event, BigDecimal cashAfter) { }
}
