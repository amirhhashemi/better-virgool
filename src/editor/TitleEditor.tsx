import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import CharacterCount from "@tiptap/extension-character-count";
import { Document } from "@tiptap/extension-document";
import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import { TextDirection } from "./extensions/TextDirection";
import { useEditorHydration, useEditorStore } from "~/stores/useEditorStore";

const CHAR_LIMIT = 100;

export const TitleEditor = () => {
  const setTitle = useEditorStore((s) => s.setTitleHtml);
  const hydrated = useEditorHydration();

  const TitleDocument = Document.extend({
    content: "heading",
  });

  const editor = useEditor({
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
        limit: CHAR_LIMIT,
      }),
    ],
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setTitle(html);
    },
  });

  useEffect(() => {
    if (hydrated) {
      editor
        ?.chain()
        .setContent(useEditorStore.getState().titleHtml)
        .focus()
        .run();
    }
  }, [hydrated]);

  return editor && hydrated ? (
    <div className="prose prose-sm sm:prose-base mx-auto py-8 px-1 sm:px-2">
      <EditorContent editor={editor} />
      <div className="text-gray-400 float-left">
        {/* TODO: use farsi digits */}
        {/* eslint-disable-next-line */}
        {editor.storage.characterCount.characters()}/{CHAR_LIMIT} کاراکتر
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-32">
      <div className="prose animate-pulse w-full">
        <h1 className="rounded bg-gray-300 h-10" />
      </div>
    </div>
  );
};
