CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE tax_configurations (
    tax_year VARCHAR(20) PRIMARY KEY,
    gross_salary DECIMAL(12, 2) NOT NULL,
    paye DECIMAL(12, 2) NOT NULL,
    uif DECIMAL(12, 2) NOT NULL,
    net_salary DECIMAL(12, 2) NOT NULL
);

CREATE TABLE quests (
    id VARCHAR(36) PRIMARY KEY,
    owner_subject VARCHAR(100) NOT NULL,
    seed INTEGER NOT NULL,
    started BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE runs (
    id VARCHAR(36) PRIMARY KEY,
    quest_id VARCHAR(36) NOT NULL UNIQUE,
    owner_subject VARCHAR(100) NOT NULL,
    seed INTEGER NOT NULL,
    current_month INTEGER NOT NULL,
    available_cash DECIMAL(14, 2) NOT NULL,
    total_savings DECIMAL(14, 2) NOT NULL,
    gross_income DECIMAL(14, 2) NOT NULL,
    net_income DECIMAL(14, 2) NOT NULL,
    is_employed BOOLEAN NOT NULL,
    months_with_savings INTEGER NOT NULL,
    game_phase VARCHAR(30) NOT NULL,
    decisions_completed TEXT NOT NULL,
    events_experienced TEXT NOT NULL,
    money_moments_seen TEXT NOT NULL,
    category_spend TEXT NOT NULL,
    monthly_category_spend TEXT NOT NULL,
    housing_choice VARCHAR(100),
    transport_choice VARCHAR(100),
    phone_choice VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_runs_quests FOREIGN KEY (quest_id) REFERENCES quests(id)
);

CREATE TABLE recurring_commitments (
    id VARCHAR(36) PRIMARY KEY,
    run_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(14, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    start_month INTEGER NOT NULL,
    end_month INTEGER,
    active BOOLEAN NOT NULL,
    CONSTRAINT fk_commitments_runs FOREIGN KEY (run_id) REFERENCES runs(id)
);

CREATE TABLE debt_accounts (
    id VARCHAR(36) PRIMARY KEY,
    run_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    principal DECIMAL(14, 2) NOT NULL,
    balance DECIMAL(14, 2) NOT NULL,
    monthly_repayment DECIMAL(14, 2) NOT NULL,
    interest_rate DECIMAL(8, 5) NOT NULL,
    start_month INTEGER NOT NULL,
    active BOOLEAN NOT NULL,
    CONSTRAINT fk_debts_runs FOREIGN KEY (run_id) REFERENCES runs(id)
);

CREATE TABLE savings_buckets (
    id VARCHAR(36) PRIMARY KEY,
    run_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    balance DECIMAL(14, 2) NOT NULL,
    monthly_contribution DECIMAL(14, 2) NOT NULL,
    is_emergency_fund BOOLEAN NOT NULL,
    CONSTRAINT fk_savings_runs FOREIGN KEY (run_id) REFERENCES runs(id)
);

CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    run_id VARCHAR(36) NOT NULL,
    type VARCHAR(40) NOT NULL,
    amount DECIMAL(14, 2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    month INTEGER NOT NULL,
    occurred_at TIMESTAMP NOT NULL,
    running_balance DECIMAL(14, 2) NOT NULL,
    CONSTRAINT fk_transactions_runs FOREIGN KEY (run_id) REFERENCES runs(id)
);

CREATE TABLE decisions (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    narrative TEXT NOT NULL,
    context TEXT NOT NULL,
    month INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    options_json TEXT NOT NULL
);

CREATE TABLE life_events (
    id VARCHAR(100) PRIMARY KEY,
    month INTEGER NOT NULL,
    event_type VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    narrative TEXT NOT NULL,
    emoji VARCHAR(20) NOT NULL,
    cash_effect DECIMAL(14, 2),
    transaction_type VARCHAR(40),
    triggers_decision BOOLEAN NOT NULL,
    decision_id VARCHAR(100),
    probability DECIMAL(5, 4) NOT NULL
);
