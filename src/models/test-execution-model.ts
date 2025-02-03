import type { HasId, HasName, HasUrl } from "./common-model.js";
import type { Test } from "./test-model.js";
import type { TestResult } from "./test-result-model.js";

/**
 * A test execution stores tests and their results.
 */
export interface TestExecution extends HasId, HasName, HasUrl {
  tests: {
    /**
     * The result of the test.
     */
    result: TestResult;
    /**
     * THe test details.
     */
    test: Test;
  }[];
}
