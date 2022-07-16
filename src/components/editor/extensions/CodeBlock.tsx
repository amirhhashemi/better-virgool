import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import { lowlight } from "lowlight/lib/common.js";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";

import { CodeBlockWrapper } from "../wrappers/CodeBlock";

export const CodeBlock = CodeBlockLowlight.extend({
  parseHTML() {
    return [
      {
        tag: "pre",
        contentElement: "code",
        getAttrs: (node) => {
          const datatype = (node as HTMLElement).getAttribute("data-type");
          return datatype === "code-block" && null;
        },
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "pre",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "code-block",
        dir: "ltr",
      }),
      [
        "code",
        {
          class: node.attrs.language
            ? this.options.languageClassPrefix + node.attrs.language
            : null,
        },
        0,
      ],
    ];
  },
  // addNodeView() {
  //   return ReactNodeViewRenderer(CodeBlockWrapper);
  // },
}).configure({
  lowlight,
});
