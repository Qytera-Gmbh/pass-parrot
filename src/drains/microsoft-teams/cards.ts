import * as Adaptive from "adaptivecards";
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
  const testPlanUrl = results.url;
  const chart = createPieChart({
    fail: failedTests,
    pass: passedTests,
    pending: pendingTests,
    skip: skippedTests,
  });
  const card = new Adaptive.AdaptiveCard();
  card.version = new Adaptive.Version(1, 5);
  card.addItem(getHeading({ title: "Test Results" }));
  card.addItem(
    getQuickSummary({
      facts: Object.entries(details ?? {}).map(([key, value]) => new Adaptive.Fact(key, value)),
    })
  );

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

function getHeading(config: {
  button?: { title: string; url: string };
  title: string;
}): Adaptive.CardElement {
  const heading = new Adaptive.ColumnSet();
  const titleColumn = new Adaptive.Column("auto");
  const title = new Adaptive.TextBlock(config.title);
  title.color = Adaptive.TextColor.Accent;
  title.id = "heading-title";
  title.isSubtle = false;
  title.size = Adaptive.TextSize.Large;
  title.style = "heading";
  title.weight = Adaptive.TextWeight.Default;
  title.wrap = true;
  titleColumn.addItem(title);
  heading.addColumn(titleColumn);
  if (config.button) {
    const buttonColumn = new Adaptive.Column("stretch");
    const button = new Adaptive.ActionSet();
    button.id = "heading-button";
    button.horizontalAlignment = Adaptive.HorizontalAlignment.Right;
    const openUrlAction = new Adaptive.OpenUrlAction();
    openUrlAction.id = "heading-button-open-url";
    openUrlAction.style = Adaptive.ActionStyle.Positive;
    openUrlAction.title = config.button.title;
    openUrlAction.url = config.button.url;
    button.addAction(openUrlAction);
    buttonColumn.addItem(button);
    heading.addColumn(buttonColumn);
  }
  return heading;
}

function getQuickSummary(config?: { facts?: Adaptive.Fact[] }): Adaptive.CardElement {
  const summary = new Adaptive.ColumnSet();
  if (config?.facts && config.facts.length > 0) {
    const additionalFactsColumn = new Adaptive.Column("auto");
    additionalFactsColumn.horizontalAlignment = Adaptive.HorizontalAlignment.Left;
    additionalFactsColumn.verticalContentAlignment = Adaptive.VerticalAlignment.Top;
    const facts = new Adaptive.FactSet();
    facts.facts = config.facts;
    summary.addColumn(additionalFactsColumn);
  }
  return summary;
}

const CARD = {
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
          width: "auto",
        },
        {
          items: [
            {
              actions: [
                {
                  id: "a0d1f8b8-6b23-5154-aed7-32339d3fc94b",
                  style: "positive",
                  title: "Open Test Plan",
                  type: "Action.OpenUrl",
                  url: "https://example.org",
                },
              ],
              horizontalAlignment: "Right",
              id: "be02d0bd-4a06-bd08-fd62-dc18904d2b6a",
              spacing: "Small",
              type: "ActionSet",
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
              facts: [
                {
                  title: "Fact 1",
                  value: "Value 1",
                },
                {
                  title: "Fact 2",
                  value: "Value 2",
                },
              ],
              type: "FactSet",
            },
          ],
          rtl: false,
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
                      value: "0",
                    },
                    {
                      title: "Passed",
                    },
                    {
                      title: "Failed",
                    },
                    {
                      title: "Skipped",
                    },
                    {
                      title: "Pending",
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
              url: "https://picsum.photos/100/100",
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
    {
      items: [
        {
          actions: [
            {
              iconUrl: "icon:TaskListLtr",
              title: "Show Tests",
              type: "Action.ToggleVisibility",
            },
          ],
          type: "ActionSet",
        },
        {
          actions: [
            {
              iconUrl: "icon:TaskListLtr",
              title: "Hide Tests",
              type: "Action.ToggleVisibility",
            },
          ],
          type: "ActionSet",
        },
      ],
      type: "Container",
    },
    {
      columns: [
        {
          items: [
            {
              actions: [
                {
                  iconUrl: "icon:CursorClick",
                  id: "wetter",
                  style: "positive",
                  type: "Action.OpenUrl",
                  url: "https://example.org",
                },
              ],
              type: "ActionSet",
            },
          ],
          type: "Column",
          width: "auto",
        },
        {
          horizontalAlignment: "Center",
          items: [
            {
              color: "Good",
              horizontalAlignment: "Center",
              name: "Checkmark",
              size: "Small",
              style: "Filled",
              type: "Icon",
            },
          ],
          type: "Column",
          width: "auto",
        },
        {
          items: [
            {
              text: "TCA TR Wetterdaten",
              type: "TextBlock",
              wrap: true,
            },
          ],
          type: "Column",
          width: "stretch",
        },
      ],
      type: "ColumnSet",
    },
  ],
  rtl: false,
  type: "AdaptiveCard",
  version: "1.5",
  verticalContentAlignment: "Center",
};
