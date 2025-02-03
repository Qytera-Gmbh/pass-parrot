import type { TestPlan } from "../../models/testplan-model.js";
import type { Drain } from "../drain.js";
import { getTestPlanCard } from "./cards.js";

export class MicrosoftTeamsDrain implements Drain {
  private readonly incomingWebhookUrl: string;

  constructor(config: { incomingWebhookUrl: string }) {
    this.incomingWebhookUrl = config.incomingWebhookUrl;
  }

  public async writeTestPlan(testPlan: TestPlan): Promise<void> {
    await fetch(this.incomingWebhookUrl, {
      body: JSON.stringify(
        getTestPlanCard(testPlan, { ["ID"]: testPlan.id, ["Name"]: testPlan.name })
      ),
      headers: { ["Content-Type"]: "application/json" },
      method: "POST",
    });
  }
}
