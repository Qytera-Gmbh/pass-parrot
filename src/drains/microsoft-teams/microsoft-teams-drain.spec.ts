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
        { id: "PAPA-151", name: "test 150", status: "pass", url: `${url}/browse/PAPA-151` },
        { id: "PAPA-150", name: "test 149", status: "pass", url: `${url}/browse/PAPA-150` },
        { id: "PAPA-68", name: "test 67", status: "fail", url: `${url}/browse/PAPA-68` },
        { id: "PAPA-67", name: "test 66", status: "fail", url: `${url}/browse/PAPA-67` },
        { id: "PAPA-66", name: "test 65", status: "pending", url: `${url}/browse/PAPA-66` },
        { id: "PAPA-9", name: "test 8", status: "pending", url: `${url}/browse/PAPA-9` },
        { id: "PAPA-8", name: "test 7", status: "skipped", url: `${url}/browse/PAPA-8` },
        { id: "PAPA-7", name: "test 6", status: "skipped", url: `${url}/browse/PAPA-7` },
      ],
      url: `${url}/browse/PAPA-152`,
    });
  });
});
