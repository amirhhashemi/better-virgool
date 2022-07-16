import TiptapHeading, { HeadingOptions } from "@tiptap/extension-heading";
import { textblockTypeInputRule } from "@tiptap/core";

export const Heading = TiptapHeading.extend<HeadingOptions>({
  addInputRules() {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{1,${level - 1}})\\s$`),
        type: this.type,
        getAttributes: {
          level: level,
        },
      });
    });
  },
}).configure({
  levels: [2, 3, 4],
});
