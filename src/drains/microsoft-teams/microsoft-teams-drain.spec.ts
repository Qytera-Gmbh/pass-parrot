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
    await drain.writeTestPlan({
      id: "PAPA-152",
      name: "Test Plan With Tests",
      tests: [
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
  });
});
