import { readdirSync } from "node:fs";
import { join } from "node:path";

import "dotenv/config";

/**
 * Recursively returns all files in the given directory that match the provided filename filter.
 *
 * @param dir - the entry directory
 * @param filter - the filename filter
 * @returns all matching files
 */
export function findFiles(dir: string, filter: (filename: string) => boolean): string[] {
  const files = readdirSync(dir, { withFileTypes: true });
  let testFiles: string[] = [];
  for (const file of files) {
    const fullPath = join(dir, file.name);
    if (file.isDirectory()) {
      testFiles = testFiles.concat(findFiles(fullPath, filter));
    } else if (file.isFile() && filter(file.name)) {
      testFiles.push(fullPath);
    }
  }
  return testFiles;
}

/**
 * Returns an environment variable value for a specified environment variable.
 *
 * @param kind the environment variable
 * @returns the value
 */
export function getEnv(
  kind: "jira-password" | "jira-token" | "jira-username" | "xray-client-id" | "xray-client-secret"
): string {
  let value: string | undefined;
  switch (kind) {
    case "xray-client-id":
      value = process.env.XRAY_CLIENT_ID;
      break;
    case "xray-client-secret":
      value = process.env.XRAY_CLIENT_SECRET;
      break;
    case "jira-password":
      value = process.env.JIRA_PASSWORD;
      break;
    case "jira-token":
      value = process.env.JIRA_TOKEN;
      break;
    case "jira-username":
      value = process.env.JIRA_USERNAME;
      break;
  }
  if (!value) {
    throw new Error(`Environment variable is undefined: ${kind}`);
  }
  return value;
}
