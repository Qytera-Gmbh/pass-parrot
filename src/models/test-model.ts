import type { HasId, HasName, HasUrl } from "./common-model.js";

export interface Test extends HasId, HasName, HasUrl {
  // ...
}
