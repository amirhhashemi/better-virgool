import cn from "clsx";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEditorStore } from "../../global-stores/useEditorStore";

import { RichText } from "./extensions/RichText";
import { Toolbar } from "./Toolbar";
import { TitleEditor } from "./TitleEditor";

export const RichTextEditor = () => {
  const setEditorContent = useEditorStore((s) => s.setContentHtml);
  const editorContent = useEditorStore((s) => s.contentHtml);

  const editor = useEditor({
    content: editorContent,
    extensions: [
      RichText,
      CharacterCount,
      Placeholder.configure({
        placeholder: "یه چیزی بنویس...",
      }),
    ],
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setEditorContent(html);
    },
  });

  return (
    editor && (
      <div>
        <TitleEditor />
        <Toolbar editor={editor} />
        <div
          className={cn(
            "mt-6 mx-auto px-1 sm:px-2 pb-4",
            "prose prose-sm sm:prose-base md:prose-md prose-stone",
            "prose-img:mx-auto prose-img:mb-2 prose-img:rounded prose-figcaption:text-center",
            "prose-a:text-rose-500"
          )}
        >
          <EditorContent editor={editor} />
          <div className="text-gray-400 float-left">
            {editor.storage.characterCount.words()} کلمه
          </div>
        </div>
      </div>
    )
  );
};
