import type { TestResults } from "../models/test-results-model.js";

/**
 * A source represents a service or tool from which test information can be pulled, such as an Xray
 * test execution, an Azure DevOps test run or a simple Excel sheet.
 */
export interface Source<SourceDetails> {
  /**
   * Retrieves test results from the source, containing one or more tests and their results.
   *
   * @param source the source to retrieve results from
   * @returns the test results
   */
  getTestResults(source: SourceDetails): Promise<TestResults> | TestResults;
}
