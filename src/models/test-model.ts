export interface Test {
  name: string;
  status: "fail" | "pass" | "pending" | "skipped";
  url: string;
}
