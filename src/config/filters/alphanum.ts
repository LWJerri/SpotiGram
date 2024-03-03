import { makeValidator } from "envalid";

export const alphanum = makeValidator((value) => {
  if (typeof value !== "string" || !value.length) throw new Error("Value must be a non-empty string");

  return value;
});
