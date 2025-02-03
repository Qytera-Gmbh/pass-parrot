export interface HasId {
  /**
   * A unique identifier.
   *
   * Examples:
   * - Jira/Xray: `PRJ-123`
   */
  id: string;
}

export interface HasName {
  /**
   * The name.
   *
   * Examples:
   * - Jira/Xray: the issue summary
   */
  name: string;
}

export interface HasUrl {
  /**
   * A URL that points to the item.
   */
  url: string;
}
