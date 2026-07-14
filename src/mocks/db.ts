/**
 * In-memory mock database. Feature api/ modules read and mutate this
 * store through their own service functions (never directly from UI),
 * always going through `delay()` to simulate network latency.
 *
 * TODO: implement the store (state + subscribe/notify so permission and
 * data changes propagate immediately without a reload).
 */
export {}
