package com.moneyquest.content;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class GameCatalog {
    private GameCatalog() { }

    public record DecisionSeed(String id, String title, String narrative, String context, int month,
                               String category, List<Map<String, Object>> options) { }

    public record EventSeed(String id, int month, String type, String title, String narrative, String emoji,
                            BigDecimal cashEffect, String transactionType, boolean triggersDecision,
                            String decisionId, BigDecimal probability) { }

    public static List<DecisionSeed> decisions() {
        return List.of(
            decision("decision-housing", "Where will you live?", "You've got the job. Now you need a place to call home in Johannesburg. You've shortlisted three options. Each has its appeal.", "Your first full-time payday just landed. Time to sort out where you'll live.", 1, "Housing",
                option("opt-housing-basic", "Roodepoort Flatlet", "A practical studio in Roodepoort. Older building, no frills, but yours. 30 min commute. Water and lights included.", 500, 6500, "Rent — Roodepoort", "🏠", "Affordable", "Practical, independent, low-pressure", null),
                option("opt-housing-mid", "Braamfontein 1-Bed", "Trendy Braamfontein apartment. Walking distance to coffee shops, close to the CBD. Modern finishes, secure parking, fibre-ready.", 1000, 9500, "Rent — Braamfontein", "🏙️", "Popular", "Urban, social, aspirational", null),
                option("opt-housing-premium", "Sandton Studio", "Sleek Sandton studio with gym, pool, and concierge. The address that impresses. Walking distance to Sandton City.", 2000, 13500, "Rent — Sandton", "✨", "Aspirational", "Premium, status, central", null)),
            decision("decision-phone", "Your phone is showing its age.", "Your current phone's screen has a crack and the battery barely lasts a day. A colleague mentions the new Samsung Galaxy S25 just dropped. You check it out on your lunch break.", "Month 2. You have some cash but commitments are building.", 2, "Smartphone",
                option("opt-phone-keep", "Keep the old phone", "Get the screen repaired for R450. Not glamorous, but it works.", 450, null, null, "🔧", "Practical", "Sensible, patient", null),
                option("opt-phone-mid", "Samsung Galaxy A55", "Great mid-range phone. R8,999 upfront or R299/month on a 24-month contract.", 299, 299, "Phone contract — Galaxy A55", "📱", "Smart choice", "Connected, practical", null),
                option("opt-phone-premium", "Samsung Galaxy S25", "The one everyone's talking about. R22,999 or R649/month on a 36-month contract. Pay R1,500 deposit today.", 1500, 649, "Phone contract — Galaxy S25", "🌟", "Premium", "Status, cutting-edge", offer("FlexiTalk Network", 1500, 649, 36))),
            decision("decision-transport", "How will you get around?", "Three months in and the Gautrain + Uber combo is eating more than you thought. A friend is selling their 2019 Toyota Corolla. The bank has a pre-approval waiting.", "Month 3. Your transport costs are unpredictable.", 3, "Transport",
                option("opt-transport-public", "Gautrain + Uber", "Keep using public transport and Uber for convenience. No fixed commitment, but variable monthly cost of around R1,800.", 0, 1800, "Transport — Gautrain/Uber", "🚇", "Flexible", "Urban, sustainable", null),
                option("opt-transport-car", "Buy the Corolla", "2019 Toyota Corolla, 68k km. R189,000. Pay R15,000 deposit, finance the rest at R3,850/month over 60 months. Add insurance: R850/month.", 15000, 4700, "Car payment + insurance", "🚗", "Freedom", "Independent, status", offer("QuickDrive Finance", 15000, 3850, 60))),
            decision("decision-clothing", "Big work function coming up.", "Your company's client dinner is next week. Your manager mentioned it's a smart-casual event at a Sandton restaurant. You want to look the part.", "Month 4. Work social life is ramping up.", 4, "Clothing",
                option("opt-clothing-basic", "Work with what you have", "Dress up what you already own. Maybe buy one item from Woolworths for R600.", 600, null, null, "👔", "Resourceful", null, null),
                option("opt-clothing-mid", "Zara outfit (R2,400)", "A sharp Zara outfit that works for work and going out. Pay cash.", 2400, null, null, "🛍️", "Stylish", null, null),
                option("opt-clothing-account", "Stuttafords store account", "Open a store account. Get R4,500 of clothing today. Pay R450/month over 12 months. No deposit.", 0, 450, "Stuttafords account", "💳", "Buy now", null, offer("Stuttafords Credit", 0, 450, 12))),
            decision("decision-savings", "Build your financial foundation?", "Five months in and you're starting to see patterns. Your available cash varies wildly month to month. A colleague mentions she puts away R1,000 every payday without thinking about it.", "Month 5. A moment of reflection.", 5, "Savings",
                option("opt-savings-none", "Skip it for now", "You have expenses. You'll start saving when things settle down.", 0, null, null, "⏳", "Later", null, null),
                option("opt-savings-small", "Save R500/month", "Set up a recurring transfer to a separate emergency savings pocket.", 500, 500, "Emergency savings — R500", "🛡️", "Start small", null, null),
                option("opt-savings-serious", "Save R1,000/month", "Commit R1,000 every payday to a dedicated emergency fund.", 1000, 1000, "Emergency savings — R1,000", "💪", "Committed", null, null)),
            decision("decision-bnpl", "Your friends are going to Bali.", "Eight of your friends are booking a 5-day trip to Bali for R14,500 all-in. The deal closes in 48 hours. PayLater SA is offering: R3,625 today, then three monthly instalments of R3,625.", "Month 8. FOMO is real.", 8, "Travel",
                option("opt-bnpl-skip", "Skip this one", "You'd love to go but the timing isn't right. Your friends will understand.", 0, null, null, "🏠", "Responsible", null, null),
                option("opt-bnpl-cash", "Pay cash (R14,500)", "Pay the full amount upfront. You'll need to dip into savings or existing cash.", 14500, null, null, "✈️", "Full pay", null, null),
                option("opt-bnpl-split", "Use PayLater SA", "R3,625 today, then R3,625/month for 3 months. Go now, pay later.", 3625, 3625, "PayLater SA — Bali trip", "🌴", "BNPL", null, offer("PayLater SA", 3625, 3625, 3))),
            decision("decision-housing-upgrade", "Your lease is up for renewal.", "Your 12-month lease is ending. Your landlord is offering a renewal. But you've also seen a nicer place nearby, and a cheaper option if you want to cut costs.", "Month 10. Re-evaluate your housing.", 10, "Housing",
                option("opt-housing-downgrade", "Move somewhere cheaper", "Find a cheaper flat to free up R2,000–3,000/month. Less impressive but more sustainable.", 1500, -2000, "Housing adjustment", "📦", "Downsize", null, null),
                option("opt-housing-renew", "Renew your current lease", "Stay where you are. Comfortable, familiar. Small 5% increase.", 0, null, null, "🔄", "Stable", null, null),
                option("opt-housing-upgrade", "Upgrade to better place", "A newer building, better area, R2,500 more per month. Worth it?", 2000, 2500, "Housing upgrade premium", "⬆️", "Upgrade", null, null))
        );
    }

    public static List<EventSeed> events() {
        return List.of(
            new EventSeed("event-concert-m2", 2, "social", "Sho Madjozi concert this weekend", "Your friends are going to the Sho Madjozi concert at the Ticketpro Dome. Tickets are R850. \"You're coming, right?\"", "🎵", bd(-850), "ENTERTAINMENT", false, null, bd("0.80")),
            new EventSeed("event-family-m3", 3, "family", "Your mom needs help", "Your mother calls. The fridge broke down. She doesn't ask directly, but you can hear it in her voice. Replacing it costs R4,200. You could send what you can.", "👩‍👧", bd(-2500), "FAMILY_SUPPORT", false, null, bd("0.65")),
            new EventSeed("event-side-hustle-m5", 5, "career", "Side hustle opportunity", "A friend needs a freelance logo designed. You have the skills. They're offering R3,500 for the project, payable on delivery.", "💼", bd(3500), "SIDE_INCOME", false, null, bd("0.55")),
            new EventSeed("event-phone-damage-m5", 5, "unexpected", "Phone screen cracked", "You dropped your phone on the way to the office. The screen is cracked. Repair: R1,200 at a certified shop, or R650 at a local repair place.", "📱", bd(-1200), "EMERGENCY_EXPENSE", false, null, bd("0.45")),
            new EventSeed("event-bonus-m6", 6, "career", "A surprise performance bonus", "Your manager tells you the team exceeded its target. A small bonus lands with this month's salary.", "🎁", bd(5000), "BONUS", false, null, bd("0.35")),
            new EventSeed("event-medical-m7", 7, "unexpected", "A weekend emergency", "A bad fall means a trip to the doctor and an unexpected bill before payday.", "🏥", bd(-2800), "EMERGENCY_EXPENSE", false, null, bd("0.30")),
            new EventSeed("event-family-m9", 9, "family", "A family celebration", "Your cousin is getting married. You want to show up for the family, including a thoughtful gift and travel.", "🎉", bd(-1800), "FAMILY_SUPPORT", false, null, bd("0.72")),
            new EventSeed("event-refund-m11", 11, "career", "An old deposit comes back", "Your previous landlord finally returns part of your deposit after the inspection.", "💰", bd(2200), "REFUND", false, null, bd("0.60"))
        );
    }

    private static DecisionSeed decision(String id, String title, String narrative, String context, int month,
                                         String category, Map<String, Object>... options) {
        return new DecisionSeed(id, title, narrative, context, month, category, List.of(options));
    }

    private static Map<String, Object> option(String id, String label, String description, int cost,
                                              Integer monthlyCommitment, String commitmentName, String emoji,
                                              String tag, String lifestyle, Map<String, Object> debtOffer) {
        Map<String, Object> value = new LinkedHashMap<>();
        value.put("id", id); value.put("label", label); value.put("description", description);
        value.put("cost", cost); if (monthlyCommitment != null) value.put("monthlyCommitment", monthlyCommitment);
        if (commitmentName != null) value.put("commitmentName", commitmentName); value.put("emoji", emoji);
        if (tag != null) value.put("tag", tag); if (lifestyle != null) value.put("lifestyle", lifestyle);
        if (debtOffer != null) value.put("debtOffer", debtOffer); return value;
    }

    private static Map<String, Object> offer(String provider, int deposit, int monthly, int term) {
        Map<String, Object> value = new LinkedHashMap<>(); value.put("provider", provider);
        value.put("depositRequired", deposit); value.put("monthlyRepayment", monthly); value.put("term", term); return value;
    }

    private static BigDecimal bd(int value) { return BigDecimal.valueOf(value); }
    private static BigDecimal bd(String value) { return new BigDecimal(value); }
}
