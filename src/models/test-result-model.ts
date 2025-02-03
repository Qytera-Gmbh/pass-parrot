/**
 * The result of an executed test.
 */
export interface TestResult {
  /**
   * The execution status.
   */
  status: "fail" | "pass" | "pending" | "skipped";
  /**
   * The URL to the execution details of the test.
   */
  url: string;
}
