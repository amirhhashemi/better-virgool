import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

import { Extension } from "@tiptap/core";
import { TextDirection } from "./TextDirection";

export const PlainText = Extension.create({
  name: "plainText",

  addExtensions() {
    return [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        hardBreak: false,
        listItem: false,
        orderedList: false,
        dropcursor: false,
        gapcursor: false,
      }),
      TextDirection.configure({
        types: ["paragraph"],
      }),
      Link,
    ];
  },
});
