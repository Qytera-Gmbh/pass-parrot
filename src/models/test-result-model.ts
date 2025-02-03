import type { HasUrl } from "./common-model.js";

/**
 * The result of an executed test.
 */
export interface TestResult extends HasUrl {
  /**
   * The execution status.
   */
  status: "fail" | "pass" | "pending" | "skipped";
}
