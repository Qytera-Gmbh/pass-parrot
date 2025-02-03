import type { TestPlan } from "../models/test-plan-model.js";

/**
 * A drain represents a service or tool to which test information can be pushed, such as Slack,
 * Microsoft Teams or simply the standard output.
 */
export interface Drain<TestPlanOutput> {
  /**
   * Writes a test plan, containing one or more tests.
   *
   * @param testPlan the details of the test plan to write
   * @returns the drained result
   */
  writeTestPlan(testPlan: TestPlan): Promise<TestPlanOutput>;
}
