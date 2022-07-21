import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

import { Extension } from "@tiptap/core";
import { Figure } from "./Figure";
import { TextDirection } from "./TextDirection";
import { Heading } from "./Heading";
import { CodeBlock } from "./CodeBlock";
import { SmilieReplacer } from "./SmilieReplacer";

export const RichText = Extension.create({
  name: "richText",

  addExtensions() {
    return [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
      }),
      CodeBlock,
      Heading,
      Underline,
      Figure,
      SmilieReplacer,
      TextDirection.configure({
        types: ["paragraph", "heading", "blockquote", "listItem"],
      }),
      Link.configure({ openOnClick: false }),
    ];
  },
});
