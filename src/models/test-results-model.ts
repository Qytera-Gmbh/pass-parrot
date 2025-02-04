import type { HasId, HasName, HasUrl } from "./common-model.js";
import type { Test } from "./test-model.js";
import type { TestResult } from "./test-result-model.js";

/**
 * Stores tests and their results.
 */
export interface TestResults extends HasId, HasName, HasUrl {
  results: {
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
