import type { TestPlan } from "../../models/test-plan-model.js";
import type { Drain } from "../drain.js";
import type { AdaptiveCardMessage } from "./cards.js";
import { getTestPlanCard } from "./cards.js";

export class MicrosoftTeamsDrain implements Drain<AdaptiveCardMessage> {
  private readonly incomingWebhookUrl: string;

  constructor(config: { incomingWebhookUrl: string }) {
    this.incomingWebhookUrl = config.incomingWebhookUrl;
  }

  public async writeTestPlan(testPlan: TestPlan): Promise<AdaptiveCardMessage> {
    const card = getTestPlanCard(testPlan, { ["ID"]: testPlan.id, ["Name"]: testPlan.name });
    await fetch(this.incomingWebhookUrl, {
      body: JSON.stringify(card),
      headers: { ["Content-Type"]: "application/json" },
      method: "POST",
    });
    return card;
  }
}
