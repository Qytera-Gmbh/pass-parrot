import type { TestPlan } from "../models/testplan-model.js";

/**
 * A drain represents a service or tool to which test information can be pushed, such as Slack,
 * Microsoft Teams or simply the standard output.
 */
export interface Drain {
  /**
   * Writes a test plan, containing one or more tests.
   *
   * @param testPlan the details of the test plan to write
   */
  writeTestPlan(testPlan: TestPlan): Promise<void>;
}
