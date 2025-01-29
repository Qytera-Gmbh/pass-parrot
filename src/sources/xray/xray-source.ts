import type { XrayClientCloud } from "@qytera/xray-client";
import { XrayClientServer } from "@qytera/xray-client";
import type { Version3Client } from "jira.js";
import { Version2Client } from "jira.js";
import type { TestPlan } from "../../models/testplan-model.js";
import type { Source } from "../source.js";

export class XraySource implements Source<string> {
  private readonly config: XraySourceOptions;

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
      throw new Error("Not yet implemented");
    }
  }

  private static async getTestPlanServer(args: {
    jiraClient: Version2Client | Version3Client;
    testPlanKey: string;
    url: string;
    xrayClient: XrayClientServer;
  }): Promise<TestPlan> {
    const testPlan: TestPlan = {
      tests: [],
    };
    const tests = await args.xrayClient.testPlans.getTests(args.testPlanKey);
    const testKeys = tests.map((test) => test.key);
    let startAt = 0;
    let hasMoreTests = true;
    while (hasMoreTests) {
      const query = {
        fields: ["summary", "key", "id"],
        jql: `issue in (${testKeys.join(",")})`,
        startAt: startAt,
      };
      let result;
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
          testPlan.tests.push({
            name: issue.fields.summary,
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
