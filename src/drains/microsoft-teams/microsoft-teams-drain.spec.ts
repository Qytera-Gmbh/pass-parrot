import assert from "node:assert";
import path from "node:path";
import { describe, it } from "node:test";
import { getEnv } from "../../../test/util.js";
import { MicrosoftTeamsDrain } from "./microsoft-teams-drain.js";

describe(path.relative(process.cwd(), import.meta.filename), () => {
  it("pushes test plan data", async () => {
    const url = getEnv("jira-url");
    const drain = new MicrosoftTeamsDrain({
      incomingWebhookUrl: getEnv("microsoft-teams-webhook-url"),
    });
    const card = await drain.writeTestResults({
      id: "PAPA-152",
      name: "Test Plan With Tests",
      results: [
        {
          result: { status: "pass", url: `${url}/browse/PAPA-151` },
          test: { id: "PAPA-151", name: "test 150", url: `${url}/browse/PAPA-151` },
        },
        {
          result: { status: "pass", url: `${url}/browse/PAPA-150` },
          test: { id: "PAPA-150", name: "test 149", url: `${url}/browse/PAPA-150` },
        },
        {
          result: { status: "fail", url: `${url}/browse/PAPA-68` },
          test: { id: "PAPA-68", name: "test 67", url: `${url}/browse/PAPA-68` },
        },
        {
          result: { status: "fail", url: `${url}/browse/PAPA-67` },
          test: { id: "PAPA-67", name: "test 66", url: `${url}/browse/PAPA-67` },
        },
        {
          result: { status: "pending", url: `${url}/browse/PAPA-66` },
          test: { id: "PAPA-66", name: "test 65", url: `${url}/browse/PAPA-66` },
        },
        {
          result: { status: "pending", url: `${url}/browse/PAPA-9` },
          test: { id: "PAPA-9", name: "test 8", url: `${url}/browse/PAPA-9` },
        },
        {
          result: { status: "skipped", url: `${url}/browse/PAPA-8` },
          test: { id: "PAPA-8", name: "test 7", url: `${url}/browse/PAPA-8` },
        },
        {
          result: { status: "skipped", url: `${url}/browse/PAPA-7` },
          test: { id: "PAPA-7", name: "test 6", url: `${url}/browse/PAPA-7` },
        },
      ],
      url: `${url}/browse/PAPA-152`,
    });
    assert.deepStrictEqual(card, {
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
                        facts: [
                          { title: "ID", value: "PAPA-152" },
                          { title: "Name", value: "Test Plan With Tests" },
                        ],
                        type: "FactSet",
                      },
                      {
                        actions: [
                          {
                            id: "a0d1f8b8-6b23-5154-aed7-32339d3fc94b",
                            style: "positive",
                            title: "Open Test Plan",
                            type: "Action.OpenUrl",
                            url: `${url}/browse/PAPA-152`,
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
                              { title: "Tests Cases", value: 8 },
                              { title: "Passed", value: 2 },
                              { title: "Failed", value: 2 },
                              { title: "Skipped", value: 2 },
                              { title: "Pending", value: 2 },
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
                        url: "data:image/png;base64,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",
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
    });
  });
});
