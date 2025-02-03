import type { XrayClientCloud } from "@qytera/xray-client";
import { XrayClientServer } from "@qytera/xray-client";
import type { Version3Client } from "jira.js";
import { Version2Client } from "jira.js";
import type { SearchForIssuesUsingJqlPost } from "jira.js/out/version3/parameters/index.js";
import type { TestPlan } from "../../models/testplan-model.js";
import type { Source } from "../source.js";
import { convertStatus } from "./xray-status.js";

/**
 * The Xray source is responsible for fetching test report data from
 * [Xray](https://www.getxray.app/).
 */
export class XraySource implements Source<string> {
  private readonly config: XraySourceOptions;

  /**
   * Constructs a new Xray source based on the provided options.
   *
   * @param config the source configuration
   */
  constructor(config: XraySourceOptions) {
    this.config = config;
  }

  /**
   * Retrieves a test plan from the Xray API.
   *
   * @param testPlanKey the test plan to retrieve
   */
  public async getTestPlan(testPlanKey: string): Promise<TestPlan> {
    if (this.config.xray.client instanceof XrayClientServer) {
      return XraySource.getTestPlanServer({
        jiraClient: this.config.jira.client,
        testPlanKey: testPlanKey,
        url: this.config.jira.url,
        xrayClient: this.config.xray.client,
      });
    } else {
      return XraySource.getTestPlanCloud({
        jiraClient: this.config.jira.client,
        testPlanKey: testPlanKey,
        url: this.config.jira.url,
        xrayClient: this.config.xray.client,
      });
    }
  }

  private static async getTestPlanCloud(args: {
    jiraClient: Version2Client | Version3Client;
    testPlanKey: string;
    url: string;
    xrayClient: XrayClientCloud;
  }): Promise<TestPlan> {
    const parsedTestPlan: TestPlan = {
      id: args.testPlanKey,
      name: "unknown",
      tests: [],
      url: `${args.url}/browse/${args.testPlanKey}`,
    };
    let startAt = 0;
    let hasMoreTests = true;
    while (hasMoreTests) {
      const response = await args.xrayClient.graphql.getTestPlans.query(
        { jql: `issue in (${args.testPlanKey})`, limit: 1 },
        (testPlanResults) => [
          testPlanResults.results((testPlan) => [
            testPlan.jira({ fields: ["summary"] }),
            testPlan.tests({ limit: 100, start: startAt }, (testResults) => [
              testResults.results((test) => [
                test.jira({ fields: ["key", "summary"] }),
                test.status({}, (testStatusType) => [testStatusType.name]),
              ]),
            ]),
          ]),
        ]
      );
      parsedTestPlan.name = response.results?.at(0)?.jira?.summary as string;
      const returnedTests = response.results?.at(0)?.tests?.results;
      if (!returnedTests || returnedTests.length === 0) {
        hasMoreTests = false;
      } else {
        for (const issue of returnedTests) {
          if (issue?.jira && issue.status?.name) {
            parsedTestPlan.tests.push({
              id: issue.jira.key as string,
              name: issue.jira.summary as string,
              status: convertStatus(issue.status.name),
              url: `${args.url}/browse/${issue.jira.key as string}`,
            });
          }
        }
        startAt = startAt + returnedTests.length;
      }
    }
    return parsedTestPlan;
  }

  private static async getTestPlanServer(args: {
    jiraClient: Version2Client | Version3Client;
    testPlanKey: string;
    url: string;
    xrayClient: XrayClientServer;
  }): Promise<TestPlan> {
    let result;
    let query: SearchForIssuesUsingJqlPost = {
      fields: ["summary"],
      jql: `issue in (${args.testPlanKey})`,
    };
    // TypeScript won't let us search in the union of version 2 and 3 (jira.js problem).
    if (args.jiraClient instanceof Version2Client) {
      result = await args.jiraClient.issueSearch.searchForIssuesUsingJqlPost(query);
    } else {
      result = await args.jiraClient.issueSearch.searchForIssuesUsingJqlPost(query);
    }
    const testPlan: TestPlan = {
      id: args.testPlanKey,
      name: result.issues?.at(0)?.fields.summary ?? "unknown",
      tests: [],
      url: `${args.url}/browse/${args.testPlanKey}`,
    };
    const tests = await args.xrayClient.testPlans.getTests(args.testPlanKey);
    const testsByKey = new Map<
      string,
      {
        id: number;
        latestStatus: string;
      }
    >();
    for (const test of tests) {
      testsByKey.set(test.key, { id: test.id, latestStatus: test.latestStatus });
    }
    let startAt = 0;
    let hasMoreTests = true;
    while (hasMoreTests) {
      query = {
        fields: ["summary", "key", "id"],
        jql: `issue in (${[...testsByKey.keys()].join(",")})`,
        startAt: startAt,
      };
      // TypeScript won't let us search in the union of version 2 and 3 (jira.js problem).
      if (args.jiraClient instanceof Version2Client) {
        result = await args.jiraClient.issueSearch.searchForIssuesUsingJqlPost(query);
      } else {
        result = await args.jiraClient.issueSearch.searchForIssuesUsingJqlPost(query);
      }
      if (!result.issues || result.issues.length === 0) {
        hasMoreTests = false;
      } else {
        for (const issue of result.issues) {
          const xrayTest = testsByKey.get(issue.key);
          if (!xrayTest) {
            throw new Error(`Unexpected error occurred: ${issue.key} was not returned by Xray`);
          }
          testPlan.tests.push({
            id: issue.fields.key as string,
            name: issue.fields.summary,
            status: convertStatus(xrayTest.latestStatus),
            url: `${args.url}/browse/${issue.key}`,
          });
        }
        startAt = startAt + result.issues.length;
      }
    }
    return testPlan;
  }
}

export interface XraySourceOptions {
  jira: {
    client: Version2Client | Version3Client;
    url: string;
  };
  xray: { client: XrayClientCloud | XrayClientServer };
}
