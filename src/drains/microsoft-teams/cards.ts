import * as Adaptive from "adaptivecards";
import type { TestResults } from "../../models/test-results-model.js";
import { createPieChart } from "./card-chart.js";

export interface AdaptiveCardMessage {
  attachments: { content: Adaptive.PropertyBag; contentType: string; contentUrl: null | string }[];
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
  const card = new Adaptive.AdaptiveCard();
  card.version = new Adaptive.Version(1, 5);
  card.addItem(
    getHeading({ button: { title: "Open Test Results", url: results.url }, title: "Test Results" })
  );
  card.addItem(
    getQuickSummary({
      facts: Object.entries(details ?? {}).map(([key, value]) => new Adaptive.Fact(key, value)),
      stats: {
        failed: results.results.filter((test) => test.result.status === "fail").length,
        passed: results.results.filter((test) => test.result.status === "pass").length,
        pending: results.results.filter((test) => test.result.status === "pending").length,
        skipped: results.results.filter((test) => test.result.status === "skipped").length,
      },
    })
  );
  card.addItem(getTestList());
  const json = card.toJSON();
  if (!json) {
    throw new Error("failed to create adaptive card");
  }
  return {
    attachments: [
      {
        content: json,
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
    button.horizontalAlignment = Adaptive.HorizontalAlignment.Right;
    const openUrlAction = new Adaptive.OpenUrlAction();
    openUrlAction.style = Adaptive.ActionStyle.Positive;
    openUrlAction.title = config.button.title;
    openUrlAction.url = config.button.url;
    button.addAction(openUrlAction);
    buttonColumn.addItem(button);
    heading.addColumn(buttonColumn);
  }
  return heading;
}

function getQuickSummary(config: {
  facts?: Adaptive.Fact[];
  stats: {
    /**
     * The number of failing tests.
     */
    failed: number;
    /**
     * The number of passing tests.
     */
    passed: number;
    /**
     * The number of pending tests.
     */
    pending: number;
    /**
     * The number of skipped tests.
     */
    skipped: number;
  };
}): Adaptive.CardElement {
  const summary = new Adaptive.ColumnSet();

  // Additional facts.
  if (config.facts && config.facts.length > 0) {
    const additionalFactsColumn = new Adaptive.Column("auto");
    additionalFactsColumn.verticalContentAlignment = Adaptive.VerticalAlignment.Top;
    const facts = new Adaptive.FactSet();
    facts.horizontalAlignment = Adaptive.HorizontalAlignment.Left;
    facts.facts = config.facts;
    summary.addColumn(additionalFactsColumn);
  }

  // Tests summary.
  const testsColumn = new Adaptive.Column("auto");
  testsColumn.verticalContentAlignment = Adaptive.VerticalAlignment.Top;
  const testFacts = new Adaptive.FactSet();
  testFacts.facts = [
    new Adaptive.Fact(
      "Test Cases",
      (
        config.stats.failed +
        config.stats.passed +
        config.stats.pending +
        config.stats.skipped
      ).toString()
    ),
    new Adaptive.Fact("Passed", config.stats.passed.toString()),
    new Adaptive.Fact("Failed", config.stats.failed.toString()),
    new Adaptive.Fact("Skipped", config.stats.skipped.toString()),
    new Adaptive.Fact("Pending", config.stats.pending.toString()),
  ];
  testFacts.horizontalAlignment = Adaptive.HorizontalAlignment.Left;
  testsColumn.addItem(testFacts);
  summary.addColumn(testsColumn);

  // Chart.
  const chartColumn = new Adaptive.Column("auto");
  chartColumn.verticalContentAlignment = Adaptive.VerticalAlignment.Top;
  const pieChart = new Adaptive.Image();
  pieChart.url = createPieChart({
    failed: config.stats.failed,
    passed: config.stats.passed,
    pending: config.stats.pending,
    skipped: config.stats.skipped,
  });
  chartColumn.addItem(pieChart);
  summary.addColumn(chartColumn);
  return summary;
}

function getTestList(): Adaptive.CardElement {
  const showTestsId = "show-tests-button";
  const hideTestsId = "hide-tests-button";
  const container = new Adaptive.Container();
  const showTestsButton = new Adaptive.ActionSet();
  showTestsButton.id = showTestsId;
  const showTestsAction = new Adaptive.ToggleVisibilityAction();
  showTestsAction.title = "Show Tests";
  showTestsAction.iconUrl = "icon:TaskListLtr";
  showTestsAction.addTargetElement(showTestsId, false);
  showTestsAction.addTargetElement(hideTestsId, true);
  showTestsButton.addAction(showTestsAction);
  container.addItem(showTestsButton);
  const hideTestsButton = new Adaptive.ActionSet();
  hideTestsButton.id = hideTestsId;
  const hideTestsAction = new Adaptive.ToggleVisibilityAction();
  showTestsAction.title = "Hide Tests";
  showTestsAction.iconUrl = "icon:TaskListLtr";
  showTestsAction.addTargetElement(showTestsId, true);
  showTestsAction.addTargetElement(hideTestsId, false);
  hideTestsButton.addAction(hideTestsAction);
  container.addItem(hideTestsButton);
  return container;
}

const CARD = {
  $schema: "https://adaptivecards.io/schemas/adaptive-card.json",
  body: [
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
