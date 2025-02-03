import type { Test } from "./test-model.js";

export interface TestPlan {
  id: string;
  name: string;
  tests: Test[];
  url: string;
}
