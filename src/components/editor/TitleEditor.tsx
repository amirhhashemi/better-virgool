import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import CharacterCount from "@tiptap/extension-character-count";

import { Document } from "@tiptap/extension-document";
import { useEditor, EditorContent } from "@tiptap/react";

import { TextDirection } from "./extensions/TextDirection";
import { useEditorStore } from "../../global-stores/useEditorStore";

const limit = 100;

export const TitleEditor = () => {
  const setTitle = useEditorStore((s) => s.setTitleHtml);
  const title = useEditorStore((s) => s.titleHtml);

  const TitleDocument = Document.extend({
    content: "heading",
  });

  const editor = useEditor({
    content: title,
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
      CharacterCount.configure({
        limit,
      }),
    ],
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setTitle(html);
    },
  });

  return (
    editor && (
      <div className="prose prose-sm sm:prose-base mx-auto py-8">
        <EditorContent editor={editor} />
        <div className="text-gray-400">
          {editor.storage.characterCount.characters()}/{limit} کاراکتر
        </div>
      </div>
    )
  );
};
