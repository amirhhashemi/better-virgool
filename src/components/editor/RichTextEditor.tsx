import cn from "clsx";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

import {
  useEditor,
  EditorContent,
  BubbleMenu as TiptapBubbleMenu,
} from "@tiptap/react";
import { useEffect } from "react";
import { Editor } from "@tiptap/core";

import {
  useEditorStore,
  useEditorHydration,
} from "../../global-stores/useEditorStore";
import { RichText } from "./extensions/RichText";
import { Toolbar } from "./Toolbar";
import { TitleEditor } from "./TitleEditor";
import { Trash } from "../../icons";

const BubbleMenu = ({ editor }: { editor: Editor }) => {
  return (
    <TiptapBubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isActive("link")}
      tippyOptions={{
        placement: "bottom",
        offset: [0, 0],
      }}
    >
      <div className="flex items-center bg-black px-2 rounded">
        <button
          className="text-rose-500 ml-2"
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
        >
          <Trash />
        </button>
        <a
          dir="ltr"
          href={editor.getAttributes("link").href}
          target="_blank"
          className="!cursor-pointer !text-white"
        >
          {editor.getAttributes("link").href?.substring(0, 15) + "..."}
        </a>
      </div>
    </TiptapBubbleMenu>
  );
};

export const RichTextEditor = () => {
  const setEditorContent = useEditorStore((s) => s.setContentHtml);
  const hydrated = useEditorHydration();

  const editor = useEditor({
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

  useEffect(() => {
    if (hydrated) {
      editor?.commands.setContent(useEditorStore.getState().contentHtml);
    }
  }, [hydrated]);

  return (
    editor && (
      <div>
        <TitleEditor />
        <Toolbar editor={editor} />
        <BubbleMenu editor={editor} />
        <div
          className={cn(
            "mt-6 mx-auto px-1 sm:px-2 pb-4",
            "prose prose-sm sm:prose-base md:prose-md prose-stone",
            "prose-img:mb-2 prose-img:rounded prose-figcaption:text-center",
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
