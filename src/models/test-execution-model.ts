import type { Test } from "./test-model.js";
import type { TestResult } from "./test-result-model.js";

/**
 * A test execution stores tests and their results.
 */
export interface TestExecution {
  /**
   * The unique identifier of the test execution.
   *
   * Examples:
   * - Jira/Xray: `PRJ-123`
   */
  id: string;
  name: string;
  tests: {
    /**
     * The latest result of the test.
     */
    result: TestResult;
    /**
     * THe test details.
     */
    test: Test;
  }[];
  url: string;
}
