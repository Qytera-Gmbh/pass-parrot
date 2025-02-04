import type { TestResults } from "../../models/test-results-model.js";
import type { Drain } from "../drain.js";
import type { AdaptiveCardMessage } from "./cards.js";
import { getTestResultsCard } from "./cards.js";

export class MicrosoftTeamsDrain implements Drain<AdaptiveCardMessage> {
  private readonly incomingWebhookUrl: string;

  constructor(config: { incomingWebhookUrl: string }) {
    this.incomingWebhookUrl = config.incomingWebhookUrl;
  }

  public async writeTestResults(results: TestResults): Promise<AdaptiveCardMessage> {
    const card = getTestResultsCard(results, { ["ID"]: results.id, ["Name"]: results.name });
    await fetch(this.incomingWebhookUrl, {
      body: JSON.stringify(card),
      headers: { ["Content-Type"]: "application/json" },
      method: "POST",
    });
    return card;
  }
}
