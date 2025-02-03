import { TestExecution } from "../models/test-execution-model.js";
import type { TestPlan } from "../models/test-plan-model.js";

/**
 * A source represents a service or tool from which test information can be pulled, such as Xray or
 * an Excel sheet.
 */
export interface Source<TestPlanFilter, TestExecutionFilter> {
  getTestExecution(testExecution: TestExecutionFilter): Promise<TestExecution> | TestExecution;
  /**
   * Retrieves a test plan, containing one or more tests.
   *
   * @param testPlan the details of the test plan to retrieve
   * @returns the test plan
   */
  getTestPlan(testPlan: TestPlanFilter): Promise<TestPlan> | TestPlan;
}
