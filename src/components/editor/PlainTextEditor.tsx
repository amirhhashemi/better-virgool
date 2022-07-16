import Placeholder from "@tiptap/extension-placeholder";

import { useEditor, EditorContent } from "@tiptap/react";

import { PlainText } from "./extensions/PlainText";

export const PlainTextEditor = () => {
  const editor = useEditor({
    extensions: [
      PlainText,
      Placeholder.configure({
        placeholder: "یه چیزی بنویس...",
      }),
    ],
  });

  return <EditorContent editor={editor} />;
};
