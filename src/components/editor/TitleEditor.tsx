import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";

import { Document } from "@tiptap/extension-document";
import { useEditor, EditorContent } from "@tiptap/react";

import { TextDirection } from "./extensions/TextDirection";
import { useEditorStore } from "../../global-stores/useEditorStore";

export const TitleEditor = () => {
  const setTitle = useEditorStore((s) => s.setTitleHtml);
  const title = useEditorStore((s) => s.titleHtml);

  const TitleDocument = Document.extend({
    content: "heading",
  });

  const editor = useEditor({
    content: title,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base mx-auto py-6",
      },
    },
    extensions: [
      TitleDocument,
      Text,
      TextDirection.configure({ types: ["heading"] }),
      Heading.configure({
        levels: [1],
      }),
      Placeholder.configure({
        placeholder: "عنوان ...",
      }),
    ],
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setTitle(html);
    },
  });

  return <EditorContent className="text-x" editor={editor} />;
};
