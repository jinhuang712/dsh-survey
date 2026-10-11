/** What kind of question this is, derived once so every mode agrees. */

/** The draft a question starts from; also the fallback for a missing slot. */
export const BLANK_DRAFT = { picked: [], custom: "", skipped: false };

export function describeQuestion(q) {
  const options = Array.isArray(q.options) ? q.options : [];
  const isBool = q.kind === "boolean";
  const isCompare = q.kind === "compare";
  const isOpen = !isBool && !isCompare && options.length === 0;
  const type = isBool
    ? "boolean"
    : isCompare
      ? "compare"
      : q.multi_select === true
        ? "multi"
        : isOpen
          ? "open"
          : "single";
  return { options, isBool, isCompare, isOpen, typeKey: "type." + type };
}
