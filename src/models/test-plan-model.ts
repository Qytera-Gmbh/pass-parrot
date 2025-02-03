import type { Test } from "./test-model.js";
import type { TestResult } from "./test-result-model.js";

/**
 * A test plan is a collection of tests.
 */
export interface TestPlan {
  /**
   * The unique identifier of the test plan.
   *
   * Examples:
   * - Jira/Xray: `PRJ-123`
   */
  id: string;
  /**
   * The name of the test plan.
   *
   * Examples:
   * - Jira/Xray: the test plan issue summary
   */
  name: string;
  /**
   * The tests contained within the test plan.
   */
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
  /**
   * A URL that points to the test plan.
   */
  url: string;
}
