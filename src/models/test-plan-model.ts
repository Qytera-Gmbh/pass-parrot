import type { HasId, HasName, HasUrl } from "./common-model.js";
import type { Test } from "./test-model.js";
import type { TestResult } from "./test-result-model.js";

/**
 * A test plan is a collection of tests.
 */
export interface TestPlan extends HasId, HasName, HasUrl {
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
}
