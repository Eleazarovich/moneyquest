import type {
  Decision,
  FinancialHealthSnapshot,
  GameService,
  LifeEvent,
  MoneyMoment,
  PlayerState,
  TaxConfiguration,
  Transaction,
  WhatIfFork,
  YearInMoneySummary,
} from './types';

type QuestResponse = {
  id: string;
  accessToken?: string;
};

type ApiErrorResponse = {
  message?: string;
  code?: string;
};

type RequestOptions = RequestInit & {
  requiresAuth?: boolean;
  accessToken?: string;
};

type ActiveSession = {
  runId: string;
  accessToken: string;
};

const ACTIVE_SESSION_KEY = 'moneyquest.active-session';
const DEFAULT_API_BASE_URL = 'http://localhost:8080';

function apiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (configuredBaseUrl) return configuredBaseUrl.replace(/\/+$/, '');

  // The exported frontend is served by Spring Boot, so production requests can
  // use the same origin. Local development still needs the standalone backend.
  return process.env.NODE_ENV === 'development' ? DEFAULT_API_BASE_URL : '';
}

function readSession(): ActiveSession | null {
  if (typeof window === 'undefined') return null;

  const serialized = window.localStorage.getItem(ACTIVE_SESSION_KEY);
  if (!serialized) return null;

  try {
    const session = JSON.parse(serialized) as Partial<ActiveSession>;
    if (typeof session.runId !== 'string' || typeof session.accessToken !== 'string') return null;
    return { runId: session.runId, accessToken: session.accessToken };
  } catch {
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
    return null;
  }
}

function writeSession(session: ActiveSession) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  }
}

function clearSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
  }
}

export class GameApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'GameApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = false, accessToken, ...init } = options;
  const token = accessToken ?? readSession()?.accessToken;

  if (requiresAuth && !token) {
    throw new GameApiError(401, 'Start a quest before accessing the run.');
  }

  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    cache: 'no-store',
    headers,
  });

  if (!response.ok) {
    let body: ApiErrorResponse = {};
    try {
      body = (await response.json()) as ApiErrorResponse;
    } catch {
      // Keep the HTTP status as the fallback when the server returns no JSON.
    }
    throw new GameApiError(response.status, body.message || `MoneyQuest API request failed (${response.status}).`, body.code);
  }

  return (await response.json()) as T;
}

function runPath(runId: string, suffix = '') {
  return `/api/runs/${encodeURIComponent(runId)}${suffix}`;
}

const realGameService: GameService = {
  async createRun(seed?: number): Promise<PlayerState> {
    const quest = await request<QuestResponse>('/api/quests', {
      method: 'POST',
      body: JSON.stringify(seed === undefined ? {} : { seed }),
    });
    const token = quest.accessToken ?? readSession()?.accessToken;
    if (!token) throw new GameApiError(401, 'The quest did not return an access token.');

    const state = await request<PlayerState>(`/api/quests/${encodeURIComponent(quest.id)}/start`, {
      method: 'POST',
      accessToken: token,
    });
    writeSession({ runId: state.runId, accessToken: token });
    return state;
  },

  async getActiveRun(): Promise<PlayerState | null> {
    const session = readSession();
    if (!session) return null;

    try {
      return await request<PlayerState>(runPath(session.runId), { requiresAuth: true });
    } catch (error) {
      if (error instanceof GameApiError && (error.status === 401 || error.status === 403 || error.status === 404)) {
        clearSession();
        return null;
      }
      throw error;
    }
  },

  getPlayerState(runId: string): Promise<PlayerState> {
    return request<PlayerState>(runPath(runId), { requiresAuth: true });
  },

  processMonth(runId: string, month: number): Promise<{ events: LifeEvent[]; decisions: Decision[]; transactions: Transaction[] }> {
    return request(runPath(runId, `/next-event?month=${encodeURIComponent(month)}`), { requiresAuth: true });
  },

  makeDecision(runId: string, decisionId: string, optionId: string): Promise<{ newState: PlayerState; moneyMoment?: MoneyMoment }> {
    return request(runPath(runId, `/decisions/${encodeURIComponent(decisionId)}`), {
      method: 'POST',
      body: JSON.stringify({ optionId }),
      requiresAuth: true,
    });
  },

  getFinancialHealth(runId: string): Promise<FinancialHealthSnapshot> {
    return request(runPath(runId, '/financial-health'), { requiresAuth: true });
  },

  getYearInMoney(runId: string): Promise<YearInMoneySummary> {
    return request(runPath(runId, '/year-in-money'), { requiresAuth: true });
  },

  getWhatIfForks(runId: string): Promise<WhatIfFork[]> {
    return request(runPath(runId, '/what-if'), { requiresAuth: true });
  },

  simulateWhatIf(runId: string, forkId: string): Promise<WhatIfFork> {
    return request(runPath(runId, '/what-if'), {
      method: 'POST',
      body: JSON.stringify({ forkId }),
      requiresAuth: true,
    });
  },

  async replayQuest(runId: string): Promise<PlayerState> {
    const state = await request<PlayerState>(runPath(runId, '/replay'), {
      method: 'POST',
      requiresAuth: true,
    });
    const token = readSession()?.accessToken;
    if (!token) throw new GameApiError(401, 'The replay did not have an active access token.');
    writeSession({ runId: state.runId, accessToken: token });
    return state;
  },

  getTaxConfiguration(): Promise<TaxConfiguration> {
    return request<TaxConfiguration>('/api/tax-configuration?year=2026-27');
  },
};

export { ACTIVE_SESSION_KEY, realGameService };
export default realGameService;
