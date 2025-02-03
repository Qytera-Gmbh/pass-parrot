export interface Test {
  id: string;
  name: string;
  status: "fail" | "pass" | "pending" | "skipped";
  url: string;
}
