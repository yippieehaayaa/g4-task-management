import { createLogger } from "@g4/logger";

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

interface CircuitBreakerOptions {
  /** Display name for logging */
  name: string;
  /** Number of consecutive failures before the circuit opens */
  failureThreshold: number;
  /** Time in ms to wait before transitioning from OPEN to HALF_OPEN */
  resetTimeoutMs: number;
  /** Number of successful requests in HALF_OPEN to close the circuit */
  halfOpenMaxAttempts: number;
}

class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private readonly log;

  constructor(private readonly options: CircuitBreakerOptions) {
    this.log = createLogger({
      service: "api-gateway",
      module: "circuit-breaker",
      target: options.name,
    });
  }

  /**
   * Returns the current circuit state.
   * Automatically transitions from OPEN → HALF_OPEN when the reset timeout expires.
   */
  get currentState(): CircuitState {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime >= this.options.resetTimeoutMs) {
        this.transition("HALF_OPEN");
      }
    }
    return this.state;
  }

  /** Whether the circuit allows requests through */
  isAvailable(): boolean {
    return this.currentState !== "OPEN";
  }

  /** Record a successful upstream response (non-5xx) */
  recordSuccess(): void {
    if (this.state === "HALF_OPEN") {
      this.successCount++;
      if (this.successCount >= this.options.halfOpenMaxAttempts) {
        this.transition("CLOSED");
      }
      return;
    }
    this.failureCount = 0;
  }

  /** Record a failed upstream response (5xx or connection error) */
  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === "HALF_OPEN") {
      this.transition("OPEN");
      return;
    }

    if (this.failureCount >= this.options.failureThreshold) {
      this.transition("OPEN");
    }
  }

  private transition(newState: CircuitState): void {
    const previousState = this.state;
    this.state = newState;

    if (newState === "CLOSED") {
      this.failureCount = 0;
      this.successCount = 0;
    }

    if (newState === "HALF_OPEN") {
      this.successCount = 0;
    }

    this.log.warn(
      { from: previousState, to: newState },
      "Circuit breaker state changed",
    );
  }
}

/**
 * Global registry of circuit breaker instances.
 * Allows the health/readiness endpoints to inspect breaker states.
 */
const breakers = new Map<string, CircuitBreaker>();

const getOrCreateBreaker = (options: CircuitBreakerOptions): CircuitBreaker => {
  const existing = breakers.get(options.name);
  if (existing) return existing;

  const breaker = new CircuitBreaker(options);
  breakers.set(options.name, breaker);
  return breaker;
};

const getBreakers = (): ReadonlyMap<string, CircuitBreaker> => breakers;

export {
  CircuitBreaker,
  getBreakers,
  getOrCreateBreaker,
  type CircuitBreakerOptions,
  type CircuitState,
};
