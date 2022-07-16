import Placeholder from "@tiptap/extension-placeholder";

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
    editorProps: {
      attributes: {
        class:
          "mx-auto prose prose-sm sm:prose-base md:prose-md prose-stone prose-img:mx-auto prose-img:mb-2 prose-a:text-rose-500 prose-img:rounded prose-figcaption:text-center",
      },
    },
    extensions: [
      RichText,
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
        <div className="">
          <TitleEditor />
        </div>
        <Toolbar editor={editor} />
        <div className="mt-6" />
        <EditorContent editor={editor} />
      </div>
    )
  );
};
