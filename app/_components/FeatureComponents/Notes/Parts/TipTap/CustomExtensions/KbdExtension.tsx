import { Mark, mergeAttributes } from "@tiptap/core";

export const KbdExtension = Mark.create({
  name: "kbd",

  parseHTML() {
    return [{ tag: "kbd" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "kbd",
      mergeAttributes(HTMLAttributes, {
        class:
          "bg-muted px-2 py-1 text-xs rounded-md border border-border shadow-border shadow-sm",
      }),
      0,
    ];
  },
});
