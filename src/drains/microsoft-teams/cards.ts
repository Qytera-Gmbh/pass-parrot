import type { TestResults } from "../../models/test-results-model.js";
import { createPieChart } from "./card-chart.js";
import type { AdaptiveCard } from "./card-model.js";

export interface AdaptiveCardMessage {
  attachments: { content: AdaptiveCard; contentType: string; contentUrl: null | string }[];
  type: "message";
}

/**
 * Returns a test plan card message that can be sent to a Microsoft Teams channel.
 *
 * @param results the test plan to convert to a message
 * @param details additional test plan details to include in the message
 * @returns the payload that can be sent to an incoming webhook
 *
 * @see https://dev.teams.microsoft.com/cards/new
 */
export function getTestResultsCard(
  results: TestResults,
  details?: Record<string, string>
): AdaptiveCardMessage {
  const passedTests = results.results.filter((test) => test.result.status === "pass").length;
  const failedTests = results.results.filter((test) => test.result.status === "fail").length;
  const skippedTests = results.results.filter((test) => test.result.status === "skipped").length;
  const pendingTests = results.results.filter((test) => test.result.status === "pending").length;
  const totalTests = results.results.length;
  const testPlanFacts = Object.entries(details ?? {}).map(([key, value]) => {
    return { title: key, value: value };
  });
  const testPlanUrl = results.url;
  const chart = createPieChart({
    fail: failedTests,
    pass: passedTests,
    pending: pendingTests,
    skip: skippedTests,
  });
  return {
    attachments: [
      {
        content: {
          $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
          body: [
            {
              columns: [
                {
                  items: [
                    {
                      color: "Accent",
                      id: "f0a8a71f-0486-4ca8-cab2-00410663dd54",
                      isSubtle: false,
                      size: "Large",
                      style: "heading",
                      text: "Test Plan Summary",
                      type: "TextBlock",
                      weight: "Default",
                      wrap: true,
                    },
                  ],
                  type: "Column",
                  width: "stretch",
                },
              ],
              type: "ColumnSet",
            },
            {
              columns: [
                {
                  horizontalAlignment: "Left",
                  items: [
                    {
                      facts: testPlanFacts,
                      type: "FactSet",
                    },
                    {
                      actions: [
                        {
                          id: "a0d1f8b8-6b23-5154-aed7-32339d3fc94b",
                          style: "positive",
                          title: "Open Test Plan",
                          type: "Action.OpenUrl",
                          url: testPlanUrl,
                        },
                      ],
                      horizontalAlignment: "Left",
                      id: "be02d0bd-4a06-bd08-fd62-dc18904d2b6a",
                      spacing: "Small",
                      type: "ActionSet",
                    },
                  ],
                  type: "Column",
                  verticalContentAlignment: "Top",
                  width: "auto",
                },
                {
                  horizontalAlignment: "Center",
                  items: [
                    {
                      horizontalAlignment: "Left",
                      items: [
                        {
                          facts: [
                            {
                              title: "Tests Cases",
                              value: totalTests,
                            },
                            {
                              title: "Passed",
                              value: passedTests,
                            },
                            {
                              title: "Failed",
                              value: failedTests,
                            },
                            {
                              title: "Skipped",
                              value: skippedTests,
                            },
                            {
                              title: "Pending",
                              value: pendingTests,
                            },
                          ],
                          id: "fef53cec-044b-0178-b62a-41a1eacdb85c",
                          separator: true,
                          type: "FactSet",
                        },
                      ],
                      type: "Container",
                    },
                  ],
                  spacing: "Medium",
                  style: "default",
                  type: "Column",
                  verticalContentAlignment: "Center",
                  width: "auto",
                },
                {
                  horizontalAlignment: "Center",
                  items: [
                    {
                      id: "a1f89b56-a930-3387-e7ff-a8b33bb29655",
                      spacing: "None",
                      type: "Image",
                      url: chart,
                    },
                  ],
                  spacing: "Medium",
                  style: "default",
                  type: "Column",
                  verticalContentAlignment: "Center",
                  width: "stretch",
                },
              ],
              horizontalAlignment: "Center",
              id: "19442bf3-8d9e-a48d-b621-bcc0e2e8a095",
              type: "ColumnSet",
            },
          ],
          rtl: false,
          type: "AdaptiveCard",
          version: "1.5",
          verticalContentAlignment: "center",
        },
        contentType: "application/vnd.microsoft.card.adaptive",
        contentUrl: null,
      },
    ],
    type: "message",
  };
}
