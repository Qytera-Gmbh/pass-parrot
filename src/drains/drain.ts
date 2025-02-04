import type { TestResults } from "../models/test-results-model.js";

/**
 * A drain represents a service or tool to which test information can be pushed, such as Slack,
 * Microsoft Teams or simply the standard output.
 */
export interface Drain<Output> {
  /**
   * Writes test results, containing one or more tests and their results.
   *
   * @param results the results to write
   * @returns the drained result
   */
  writeTestResults(results: TestResults): Promise<Output>;
}
