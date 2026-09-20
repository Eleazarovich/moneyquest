# Money Quest --- MVP Product Specification

**Version:** 1.0\
**Market:** South Africa\
**Primary setting:** Johannesburg\
**Product type:** Interactive financial-life simulation\
**MVP simulation:** 12 months of fictional life in approximately 8--12
minutes

------------------------------------------------------------------------

## 1. Product Vision

Money Quest is a financial-life simulation for young South African
professionals entering the workforce.

It does not begin by teaching budgeting, showing financial-health
scores, or telling players what the "correct" financial decision is.
Instead, the player receives a salary, starts building a life, makes
attractive and realistic decisions, experiences their consequences, and
learns financial concepts at the moment those concepts become personally
meaningful.

The central idea is:

> **Same starting point. Same income. Different decisions. Different
> future.**

Money Quest should feel like living through the first year of adult
financial independence---not completing a financial-literacy course.

The product should be visually beautiful, emotionally believable, fast
to play, highly replayable, and educational without feeling like school.

------------------------------------------------------------------------

## 2. Problem

A young professional can start earning a reasonable salary without
understanding:

-   gross salary versus take-home pay;
-   where their money actually goes;
-   the true annual cost of recurring expenses;
-   how lifestyle inflation develops;
-   how debt reduces future purchasing power;
-   how quickly small purchases accumulate;
-   why an emergency fund matters;
-   how social and family pressure affects financial decisions;
-   how financial resilience affects their options during a crisis;
-   when saving should become consistent;
-   when they may be financially ready to start learning about
    investing.

Traditional financial education often explains these concepts before the
learner has experienced why they matter.

Money Quest reverses that sequence:

> **Experience → consequence → explanation → better decision-making.**

------------------------------------------------------------------------

## 3. Target User

### Primary persona

A South African young professional, approximately **23--36 years old**,
especially someone who has recently entered their first meaningful
full-time job.

They may be earning more money than they have ever managed before, while
simultaneously facing new adult pressures:

-   moving out;
-   choosing where to live;
-   transport or car costs;
-   socialising;
-   dating and relationships;
-   clothing and status purchases;
-   smartphones and electronics;
-   family responsibilities;
-   travel and entertainment;
-   credit offers;
-   debt;
-   saving;
-   eventually investing.

The product must never assume that the player already knows how to
budget.

------------------------------------------------------------------------

## 4. MVP Starting Scenario

Every player begins from the same financial starting point.

### Player

-   Age: **24**
-   Location: **Johannesburg, South Africa**
-   Employment: First proper full-time job
-   Gross salary: **R25,000 per month**
-   Annual gross salary: **R300,000**
-   Starting debt: **R0**
-   Starting savings: **R0**
-   Simulation length: **12 months**

The player is themselves inside a fictional financial scenario. No real
financial information is required.

### First financial lesson: the payslip

The opening should feel celebratory.

> **You got the job. 🎉**\
> Gross salary: R25,000/month\
> Your first payday is coming.

The first salary introduces the difference between gross and take-home
pay.

For the 2026/27 South African tax year, the simulation baseline is
approximately:

  Item                                     Monthly
  ------------------------------- ----------------
  Gross salary                          R25,000.00
  PAYE                                   R3,381.00
  UIF employee contribution                R177.12
  **Approximate take-home pay**     **R21,441.88**

This assumes a person under 65, the standard primary rebate, no
medical-scheme tax credits, no retirement-fund deduction, and no other
employer-specific deductions.

The tax configuration must be data-driven/versioned rather than
permanently hard-coded so future tax-year values can be updated.

The player should understand one simple idea:

> **R25,000 is what you earn. About R21,442 is what reaches you in this
> scenario.**

Then the simulation begins.

------------------------------------------------------------------------

## 5. Core Design Principles

### 5.1 Life first, financial tools later

Do not open with a budget builder.

The player initially behaves like someone entering adult financial life
for the first time. Financial tools are introduced only after the player
experiences the problem they solve.

### 5.2 Experience first, explanation second

Never warn the player that a tempting choice is financially bad before
they make it.

At decision time, show information a normal consumer would reasonably
see:

-   price;
-   deposit;
-   monthly instalment;
-   basic product details;
-   location;
-   appearance;
-   lifestyle appeal.

Consequences and deeper financial meaning are revealed later.

### 5.3 Temptation must be genuinely attractive

An expensive apartment must look better.

A phone upgrade should feel exciting.

A concert should feel worth attending.

A nicer car should feel desirable.

Money Quest must not visually punish expensive options before the player
chooses them. Otherwise the simulation becomes a disguised quiz.

### 5.4 No traditional failure

There is no "Game Over."

Bad financial circumstances reduce the player's available options and
force harder trade-offs.

The player always reaches the end of the 12-month story.

### 5.5 No moralising

Money Quest should explain consequences, not shame behaviour.

The objective is not to teach:

> Spend nothing and save everything.

It is to teach:

> Understand the trade-offs you are making and build a life you can
> sustain.

### 5.6 The future is uncertain

Players should not win by memorising an event sequence.

Some events should be probabilistic so that resilience matters more than
predicting what happens next.

------------------------------------------------------------------------

## 6. Core Gameplay Loop

The primary loop is:

**Payday → life unfolds → temptation/opportunity → decision → recurring
effects → unexpected event → consequence → Money Moment → continue**

A simulated month should move quickly.

The player does not manually manage every grocery purchase or
transaction. Money Quest abstracts ordinary spending while making
meaningful decisions interactive.

A typical month might contain:

1.  Payday.
2.  Automatic recurring commitments.
3.  Everyday living costs.
4.  One or more meaningful decisions.
5.  A social, family, career, or unexpected event.
6.  A consequence or financial state change.
7.  Occasionally, a Money Moment.

The full 12-month simulation should take approximately **8--12 minutes**
and should remain below roughly **13 minutes** for a normal playthrough.

------------------------------------------------------------------------

## 7. Natural Timeline Experience

The simulation should unfold as a visual life timeline rather than a
spreadsheet.

Example:

> **Payday**\
> +R21,441.88

Then:

> Rent paid.

Later:

> Your friends are going to a concert this weekend.

Later:

> Your electricity bill arrives.

Later:

> A friend is selling their previous iPhone.

Later:

> **Available: R3,240**

The player should occasionally experience:

> **How do I only have R3,240 left?**

That confusion creates the opportunity for learning.

------------------------------------------------------------------------

## 8. Decision System

Decisions use **guided freedom**.

The player chooses among realistic alternatives rather than entering
arbitrary amounts for everything.

### Example: apartment

The game might visually present:

**Option A --- Basic** - Older/simpler apartment - Less prestigious
location - Lower monthly cost

**Option B --- Comfortable** - Better apartment - Attractive
neighbourhood - Moderate monthly cost

**Option C --- Aspirational** - Modern apartment - Desirable
Johannesburg lifestyle/location - High monthly cost

The player sees the apartment imagery, lifestyle and price.

The game does **not** say:

-   "This is too expensive."
-   "This uses X% of your income."
-   "Bad choice."
-   "Recommended choice."

If additional costs exist---electricity, internet, transport, moving
expenses---their cumulative significance can emerge through play.

### Other decision categories

The MVP can draw decisions from:

-   housing;
-   transport;
-   smartphone/device;
-   groceries versus convenience food;
-   clothing;
-   nightlife;
-   concerts/events;
-   dating/relationships;
-   travel or weekend experiences;
-   family support;
-   savings;
-   credit;
-   unexpected expenses;
-   career opportunities.

------------------------------------------------------------------------

## 9. Recurring Commitments

Every relevant decision can create a recurring commitment.

Examples:

-   rent;
-   internet;
-   phone contract;
-   vehicle payment;
-   insurance;
-   credit-card minimum payment;
-   personal-loan repayment;
-   clothing/store account;
-   buy-now-pay-later instalment;
-   repayment to a friend/family member.

Recurring commitments are processed automatically on future paydays.

This is essential to the simulation because it teaches that a salary can
remain unchanged while **available income becomes progressively
smaller**.

The system should separately track:

-   gross income;
-   deductions;
-   take-home income;
-   fixed commitments;
-   debt repayments;
-   variable living expenses;
-   discretionary spending;
-   savings;
-   available cash.

------------------------------------------------------------------------

## 10. Debt Engine

Debt is a core gameplay system.

When the player cannot afford something---or runs out of money---the
game should not automatically block them.

It may offer believable escape routes:

-   fictional credit card;
-   fictional personal loan;
-   overdraft;
-   fictional clothing/store account;
-   fictional buy-now-pay-later product;
-   borrowing from a friend;
-   borrowing from family.

For MVP simulation offers, use fictional financial brands/providers
rather than representing a real lender's current offer.

### Design rule

Credit should initially feel helpful.

It should not be presented with red warning screens or villainous
language.

Example:

> **Not enough cash? Pay R620 today and the rest over the next 3
> months.**

The consequence appears naturally later when future salaries arrive and
existing repayments consume them.

### Core lesson

> **Debt can use tomorrow's money to solve today's problem.**

The player may enter an organic debt cycle if previous commitments cause
another shortfall.

------------------------------------------------------------------------

## 11. No Game Over: Forced Trade-offs

Financial difficulty changes the decision space rather than ending the
game.

Possible consequences include:

-   move back home;
-   downgrade housing;
-   sell/give up a vehicle;
-   cancel subscriptions;
-   drastically reduce entertainment;
-   ask family for help;
-   ask a friend for help;
-   take temporary work;
-   delay a purchase;
-   sell possessions;
-   restructure lifestyle.

The emotional lesson is:

> **Earlier you had choices. Now your circumstances are narrowing
> them.**

These events must not be framed as punishment. They are consequences
within the simulation.

------------------------------------------------------------------------

## 12. Life Event Engine

The simulation should contain a curated library of events.

### Categories

**Social** - birthday invitation; - concert; - night out; - wedding; -
weekend away; - peer pressure/status purchase.

**Relationship** - date; - gift; - partner-related expense; - shared
activity.

**Family** - request for support; - family emergency; - opportunity to
contribute to something important.

**Career** - bonus; - salary increase; - promotion opportunity; - job
application; - job rejection; - side-gig opportunity; - freelance
income; - temporary work.

**Unexpected expense** - damaged phone; - medical/out-of-pocket
expense; - transport problem; - household issue; - emergency travel.

**Income shock** - reduced income; - contract ending; - job loss.

Not every event should appear in every playthrough.

------------------------------------------------------------------------

## 13. Randomness and Replayability

The starting conditions remain identical, but selected life events vary.

The system should support a **seeded simulation**:

-   deterministic financial calculations;
-   controlled random event selection;
-   event eligibility rules;
-   probability/weight;
-   dependencies on player state;
-   reproducible runs using a seed.

This lets the product create variety without becoming arbitrary.

Examples:

A job-loss event should not happen in every game.

A side hustle may succeed in one run and fail in another.

A financial shock may arrive in Month 6 in one run and a different shock
in Month 9 in another.

The lesson becomes:

> You cannot predict everything. You can improve how prepared you are.

------------------------------------------------------------------------

## 14. Financial Shield

Emergency resilience should have a visual metaphor: the **Financial
Shield**.

Savings intended for emergencies strengthen the shield.

When an unexpected expense occurs, the experience can visually show the
shock hitting the player's financial position.

Two players facing the same R6,000 emergency may experience very
different outcomes:

**Player A** - emergency savings available; - absorbs expense; - avoids
new debt.

**Player B** - little cash; - existing commitments; - must borrow or
make a difficult trade-off.

The shield should communicate resilience without becoming an arcade
health bar.

------------------------------------------------------------------------

## 15. Money Moments

Money Moments are short, contextual educational experiences triggered
**after** something financially meaningful happens.

They should generally last approximately **10--30 seconds**.

They are visual, concise and based on the player's own simulated
behaviour.

They should not interrupt every decision.

### Initial Money Moment library

#### Where Did My Money Go?

Triggered when cash falls unexpectedly low.

Reconstruct the month's spending visually.

#### Tomorrow's Money

Triggered when debt repayments materially reduce a future payday.

Explain how past borrowing has committed future income.

#### The Real Cost of Your Apartment

Reveal housing's cumulative cost beyond the advertised rent.

#### R500 Didn't Feel Like Much

Show how repeated small expenses accumulate.

#### Lifestyle Creep

Triggered when increased income is followed by increased recurring
lifestyle costs.

#### Your Shield Worked

Triggered when emergency savings prevent borrowing during a shock.

#### The Debt Loop

Triggered when existing repayments contribute to another borrowing need.

#### Keeping Up

Reveal the cumulative cost of status/social decisions.

#### When Income Stops

Triggered after an income shock.

Show how long the player's resources can sustain existing commitments.

#### Payday Got Smaller

Show the difference between salary and truly available income after
commitments.

#### The Cost of Convenience

Aggregate repeated convenience spending such as
delivery/takeaways/transport choices.

#### Small Habit, Big Result

Reveal the cumulative effect of consistent saving.

#### The Annual Number

Convert a seemingly ordinary recurring monthly expense into its annual
cost.

Example:

> Rent: R9,500/month\
> **R114,000/year**

This reveal should be used carefully because annualisation is one of
Money Quest's strongest "wow" educational mechanics.

------------------------------------------------------------------------

## 16. Financial Health --- No Single Score

Money Quest must **not** produce a numerical overall financial score.

Avoid:

-   0--100 ratings;
-   600-point scores;
-   star ratings;
-   "financial XP" that resembles credit scoring.

Instead, the player's position is represented through multiple
dimensions.

### Dimensions

**Resilience** How well can the player absorb an unexpected financial
shock?

**Liquidity** How much accessible money is available?

**Debt Load** How much future income is committed to debt?

**Saving Habit** Is the player consistently keeping part of their
income?

**Lifestyle Balance** Is the player's current lifestyle sustainable
relative to their resources?

Possible qualitative states:

-   Strong
-   Healthy
-   Stable
-   Building
-   Vulnerable
-   Critical

The interface should explain *why* a dimension has its state.

------------------------------------------------------------------------

## 17. Financial Journey

Money Quest can conceptually model progression through:

1.  **Stabilise** --- survive the month without repeatedly requiring
    rescue.
2.  **Control** --- understand where money is going.
3.  **Protect** --- build resilience against shocks.
4.  **Balance** --- enjoy life while maintaining sustainability.
5.  **Build** --- save consistently.
6.  **Grow** --- become ready to learn about long-term wealth building
    and investing.

These are educational states, not rigid levels the player must grind.

Investing is not the starting objective.

------------------------------------------------------------------------

## 18. Month 12 --- "Your Year in Money"

Every player reaches Month 12.

The final experience should be one of the strongest parts of the
product.

### Headline

> **Your Year in Money**

### Summary metrics

Show values such as:

-   total gross income;
-   total take-home income;
-   total spent;
-   amount retained/saved;
-   current debt;
-   total debt repayments;
-   housing spend;
-   transport spend;
-   social/entertainment spend;
-   convenience spending;
-   family support;
-   emergency expenses;
-   recurring commitments;
-   emergency coverage;
-   current monthly available income.

### Annualisation surprise

Aggregate recurring and small expenses into annual totals.

For example:

> **Your apartment didn't cost R9,500.**\
> Rent alone cost R114,000 across the year.\
> With electricity, internet and related housing costs, your total was
> R\_\_\_.

Or:

> **Takeaways: R18,420**

The purpose is not shame.

The message is:

> **This is where your money went.**

### Decision reconstruction

Highlight approximately 3--4 decisions/events that materially changed
the player's trajectory.

Examples:

-   apartment choice;
-   phone purchase;
-   taking credit;
-   building an emergency fund;
-   vehicle commitment;
-   income shock;
-   consistent saving.

------------------------------------------------------------------------

## 19. What-If / Future You

At the end of the Quest, the player should be able to revisit at least
one important decision.

Examples:

> What if I chose the cheaper apartment?

> What if I didn't upgrade my phone?

> What if I saved R1,000 every payday?

The simulation engine forks from that decision and recalculates the
downstream financial outcome.

The UI compares:

**Your Year** vs **Alternative Year**

The purpose is to make opportunity cost tangible.

The MVP does not need a limitless sandbox. Supporting a curated set of
replayable key decisions is sufficient.

------------------------------------------------------------------------

## 20. Replay

After the final breakdown:

> **Think you can build a different year?**

**Replay Quest**

The same baseline is used:

-   same age;
-   same city;
-   same starting salary;
-   same starting resources.

Player choices and probabilistic events can create a different outcome.

This makes the core thesis observable:

> **Same starting point. Different decisions. Different future.**

------------------------------------------------------------------------

## 21. AI Coach

AI should enhance explanation, not control financial calculations.

### Architecture principle

> **Deterministic engine decides what happened. AI explains it.**

The backend calculates:

-   cash flow;
-   debts;
-   balances;
-   recurring commitments;
-   savings;
-   resilience;
-   event consequences;
-   Money Moment triggers;
-   financial-health states.

The LLM receives structured state and generates concise, human-friendly
explanations within strict product rules.

Example backend state:

``` json
{
  "trigger": "PAYDAY_COMPRESSION",
  "takeHomeIncome": 21441.88,
  "recurringCommitments": 9280,
  "debtRepayments": 2840,
  "availableAfterCommitments": 9321.88,
  "debtLoadState": "HIGH"
}
```

The AI can explain:

> Your salary hasn't dropped, but more of it is already committed before
> the month begins. Decisions from previous months are now reducing what
> you can choose to do this month.

The AI must not invent balances, rates, transactions or calculations.

### MVP fallback

Every Money Moment should have deterministic/template copy available so
the simulation remains fully functional if the LLM is unavailable.

------------------------------------------------------------------------

## 22. Backend Architecture

Money Quest should be a serious backend-engineering portfolio project
beneath the polished consumer experience.

### Recommended stack

-   Java
-   Spring Boot
-   Spring Security
-   Spring Data JPA
-   PostgreSQL
-   REST API
-   JWT/session authentication if accounts are introduced
-   Flyway or Liquibase for database migrations
-   OpenAPI documentation
-   JUnit
-   Testcontainers
-   Docker
-   CI/CD
-   frontend framework chosen separately

### Core backend modules

#### Simulation Engine

Controls simulation month/day progression and state transitions.

#### Financial Ledger

Records every financial movement as an immutable transaction.

#### Cash-Flow Engine

Calculates available cash and monthly movement.

#### Recurring Commitment Engine

Creates and processes future obligations.

#### Debt Engine

Manages principal, repayments, instalments, interest/fees where
applicable, and payoff state.

#### Life Event Engine

Determines event eligibility and seeded event selection.

#### Decision Engine

Presents eligible choices and executes selected consequences.

#### Money Moment Engine

Evaluates state and triggers educational moments.

#### Financial Health Engine

Calculates qualitative financial-health dimensions.

#### What-If Engine

Forks state from a historical decision and re-simulates supported
consequences.

#### Tax Configuration

Stores versioned South African tax assumptions used by scenarios.

#### AI Explanation Layer

Turns deterministic simulation facts into concise explanations.

------------------------------------------------------------------------

## 23. Ledger Model

Money should never be represented merely by mutating one `balance` field
without history.

Every financial movement should produce a ledger entry.

Example transaction types:

-   SALARY_GROSS
-   PAYE
-   UIF
-   SALARY_NET
-   RENT
-   UTILITIES
-   TRANSPORT
-   GROCERIES
-   ENTERTAINMENT
-   FAMILY_SUPPORT
-   PURCHASE
-   DEBT_DISBURSEMENT
-   DEBT_REPAYMENT
-   SAVINGS_TRANSFER
-   EMERGENCY_EXPENSE
-   SIDE_INCOME
-   BONUS
-   REFUND

This enables:

-   accurate breakdowns;
-   annual summaries;
-   auditability;
-   Money Moments;
-   What-If simulation;
-   testing;
-   trustworthy calculations.

------------------------------------------------------------------------

## 24. Suggested Domain Model

Core entities may include:

-   `Quest`
-   `QuestRun`
-   `PlayerState`
-   `Month`
-   `Decision`
-   `DecisionOption`
-   `PlayerDecision`
-   `LifeEvent`
-   `EventOutcome`
-   `Transaction`
-   `RecurringCommitment`
-   `DebtAccount`
-   `SavingsBucket`
-   `MoneyMoment`
-   `MoneyMomentTrigger`
-   `FinancialHealthSnapshot`
-   `Scenario`
-   `TaxConfiguration`
-   `SimulationSeed`

Do not over-normalise the MVP merely to demonstrate architecture.

------------------------------------------------------------------------

## 25. State That Must Be Tracked

At minimum:

-   simulation month/date;
-   gross income;
-   net income;
-   employment state;
-   available cash;
-   savings;
-   debt principal;
-   monthly debt repayments;
-   recurring commitments;
-   housing situation;
-   transport situation;
-   selected lifestyle state;
-   spending by category;
-   family/friend obligations;
-   financial-health dimensions;
-   decisions made;
-   events experienced;
-   Money Moments seen;
-   simulation seed.

------------------------------------------------------------------------

## 26. API Surface --- Illustrative

Possible REST endpoints:

``` text
POST   /api/quests
POST   /api/quests/{id}/start
GET    /api/runs/{id}
GET    /api/runs/{id}/timeline
GET    /api/runs/{id}/next-event
POST   /api/runs/{id}/decisions/{decisionId}
GET    /api/runs/{id}/money-moments/{momentId}
GET    /api/runs/{id}/financial-health
GET    /api/runs/{id}/year-in-money
POST   /api/runs/{id}/what-if
POST   /api/runs/{id}/replay
```

The final API should follow domain needs rather than this list
mechanically.

------------------------------------------------------------------------

## 27. Financial Calculation Requirements

All financial calculations should be deterministic and testable.

Use:

-   `BigDecimal` for money in Java;
-   explicit rounding rules;
-   immutable ledger history;
-   idempotency protection for financial/event-processing commands;
-   transaction boundaries for state-changing operations.

Important invariants should include:

-   the same recurring commitment cannot be charged twice for the same
    period;
-   a decision cannot execute twice;
-   replay/What-If cannot mutate the original run;
-   ledger totals reconcile with calculated state;
-   debt cannot disappear without a corresponding repayment/write-off
    event;
-   random events are reproducible from a stored seed.

------------------------------------------------------------------------

## 28. Frontend Experience

The interface should feel closer to a premium interactive story/product
than online banking.

### Visual qualities

-   modern;
-   cinematic but clean;
-   premium;
-   youthful without becoming childish;
-   South African in context;
-   strong typography;
-   rich illustrations;
-   subtle motion;
-   excellent mobile responsiveness;
-   smooth micro-interactions.

### Avoid

-   spreadsheet-first screens;
-   constant charts;
-   corporate banking aesthetics;
-   childish coins/XP everywhere;
-   red/green moral judgement;
-   overwhelming dashboards;
-   excessive text;
-   financial jargon.

### Visual storytelling

Use visuals for:

-   apartments;
-   neighbourhood/lifestyle;
-   phones;
-   cars/transport;
-   social experiences;
-   home/family;
-   Financial Shield;
-   debt commitments;
-   shrinking disposable income;
-   timeline progression;
-   end-of-year reveal.

------------------------------------------------------------------------

## 29. UX Principle: Hide Complexity Until It Matters

The backend may know everything.

The player should not.

Early in the game, the interface can primarily show:

> \*\*Available money: R\_\_\_\_\*\*

As the player learns, Money Quest can introduce richer concepts.

For example, after experiencing recurring commitments:

> Salary received\
> Already committed\
> Actually available

Financial literacy is therefore reflected not only in dialogue but in
the interface itself becoming more financially informative.

------------------------------------------------------------------------

## 30. MVP Authentication

Authentication is **not required for the first playable vertical
slice**.

A Quest can be represented by a server-side run ID/session and played
immediately.

This keeps the opening frictionless.

Account creation can later support:

-   saved runs;
-   long-term progress;
-   multiple scenarios;
-   My Life;
-   cross-device access.

Do not let authentication delay the core simulation.

------------------------------------------------------------------------

## 31. MVP Scope

### Must have

-   one Johannesburg starting scenario;
-   R25,000 gross salary;
-   realistic South African PAYE/UIF baseline;
-   12 simulated months;
-   natural timeline;
-   guided decisions;
-   housing decision;
-   lifestyle/social decisions;
-   recurring commitments;
-   debt/credit;
-   savings;
-   Financial Shield;
-   unexpected expenses;
-   at least one possible income/career shock;
-   forced trade-offs instead of Game Over;
-   event variability;
-   Money Moments;
-   multidimensional financial health;
-   immutable transaction history;
-   Year in Money;
-   annualised spending reveals;
-   at least one What-If comparison;
-   replay;
-   polished responsive visual experience;
-   deterministic backend calculations;
-   automated tests.

### Strong MVP target

Aim for roughly:

-   **20--30 authored life events/decision moments**
-   **10--15 Money Moments**
-   enough conditional logic that a normal run encounters only a subset;
-   several meaningful debt/financial pathways;
-   multiple possible end states.

The goal is not maximum content. It is a highly polished vertical slice
with enough branching to make a second run meaningfully different.

------------------------------------------------------------------------

## 32. Explicitly Out of Scope for MVP

Do not build yet:

-   bank-account integrations;
-   Open Banking integrations;
-   real-money movement;
-   actual investing;
-   brokerage integration;
-   personalised investment recommendations;
-   real lender offers;
-   comparison marketplace;
-   full financial-planning suite;
-   tax filing;
-   credit bureau integration;
-   production-grade KYC;
-   dozens of characters;
-   every South African city;
-   multiplayer/social leaderboard;
-   complex achievements/XP;
-   full "My Life" personal-finance mode.

These can distract from proving the core experience.

------------------------------------------------------------------------

## 33. Future Phase --- My Life

After experiencing a fictional Quest, the user may eventually unlock:

> **My Life**

They enter approximate real information such as:

-   salary;
-   expenses;
-   debt;
-   savings;
-   dependants/responsibilities;
-   goals.

Money Quest can then simulate possible trajectories.

This must remain clearly educational and scenario-based.

------------------------------------------------------------------------

## 34. Future Phase --- Investment Readiness

Money Quest should eventually help answer:

> **Am I financially ready to start investing?**

The system can assess factors such as:

-   positive cash flow;
-   emergency resilience;
-   high-cost debt;
-   saving consistency;
-   upcoming obligations.

The result should be explainable rather than a mysterious score.

Example:

> You're building consistently, but a large unexpected expense would
> currently force you back into debt. Strengthening your emergency
> buffer may give you more resilience before committing more money
> long-term.

------------------------------------------------------------------------

## 35. Future Phase --- South African Product Discovery

Once the user understands their financial position, Money Quest may help
them learn about South African financial-product categories and
providers.

This should compare factual dimensions such as:

-   purpose;
-   product type;
-   fees;
-   minimum contributions;
-   liquidity/access;
-   risk;
-   tax treatment where relevant;
-   regulatory status;
-   key limitations.

It should not pretend there is one universally correct provider.

Real-provider discovery is **not part of the MVP**.

------------------------------------------------------------------------

## 36. Success Criteria

The MVP succeeds if a first-time player can:

1.  Start playing almost immediately.
2.  Understand gross versus take-home income.
3.  Make choices without being told the "right" answer.
4.  Feel genuine temptation between lifestyle options.
5.  Experience recurring commitments.
6.  Understand how debt affects future disposable income.
7.  Experience the value of resilience/emergency savings.
8.  Be surprised by at least one cumulative spending reveal.
9.  Reach Month 12 regardless of financial outcome.
10. Understand where their simulated year's money went.
11. identify at least one decision they would change.
12. Want to replay.
13. finish a typical run within roughly 8--12 minutes.

The strongest user reaction would be:

> **"I knew this stuff in theory, but I never thought about it like
> that."**

------------------------------------------------------------------------

## 37. Portfolio / Engineering Objective

Money Quest must work on two levels.

### For the player

A beautiful, memorable financial-life simulation.

### For an engineering reviewer

Evidence that the builder can design:

-   financial domain models;
-   deterministic calculation engines;
-   state machines;
-   recurring financial obligations;
-   event-driven business rules;
-   branching simulations;
-   audit trails;
-   APIs;
-   relational data;
-   idempotent operations;
-   automated testing;
-   responsible AI boundaries;
-   polished product experiences.

The project should demonstrate that AI is being used where it adds value
while core financial logic remains deterministic, inspectable and
testable.

------------------------------------------------------------------------

## 38. Product North Star

Money Quest is not trying to tell a 24-year-old:

> **Don't enjoy your money.**

It is trying to let them discover:

> **Every lifestyle has a cost. Every commitment affects future choices.
> And the more financially resilient you become, the more choices you
> keep.**

That is the heart of Money Quest.
