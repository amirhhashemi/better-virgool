import toast from "react-hot-toast";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import BubbleMenu from "@tiptap/extension-bubble-menu";

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
      BubbleMenu,
      CodeBlock,
      Heading,
      Underline,
      Superscript,
      Subscript,
      Figure.configure({
        onError: (e) => toast.error(e.message),
      }),
      SmilieReplacer,
      TextDirection.configure({
        types: ["paragraph", "heading", "blockquote", "listItem"],
      }),
      Link.extend({
        inclusive: false,
      }).configure({ openOnClick: false }),
    ];
  },
});
