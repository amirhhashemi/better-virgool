import { Editor } from "@tiptap/core";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import Blockquote from "@tiptap/extension-blockquote";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import {
  BubbleMenu as TiptapBubbleMenu,
  EditorContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import cn from "clsx";
import { useEffect } from "react";
import { CodeBlock } from "~/editor/extensions/CodeBlock";
import { Figure } from "~/editor/extensions/Figure";
import { Heading } from "~/editor/extensions/Heading";
import { SmilieReplacer } from "~/editor/extensions/SmilieReplacer";
import { TextDirection } from "~/editor/extensions/TextDirection";
import { Trash } from "~/icons";
import { useEditorHydration, useEditorStore } from "~/stores/useEditorStore";
import { Toolbar } from "./Toolbar";

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
          href={editor.getAttributes("link").href || undefined}
          target="_blank"
          className="!cursor-pointer !text-white"
        >
          {/* eslint-disable-next-line */}
          {editor.getAttributes("link").href?.substring(0, 15) + "..."}
        </a>
      </div>
    </TiptapBubbleMenu>
  );
};

export const RichTextEditor = () => {
  const setEditorContent = useEditorStore((s) => s.setContentHtml);
  const contentHtml = useEditorStore((s) => s.contentHtml);
  const hydrated = useEditorHydration();

  const editor = useEditor({
    content: contentHtml,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
      }),
      BubbleMenuExtension,
      CodeBlock,
      Heading,
      Underline,
      Superscript,
      Subscript,
      Figure,
      SmilieReplacer,
      CharacterCount,
      TextDirection.configure({
        defaultDirection: "rtl",
        types: ["paragraph", "heading", "blockquote", "listItem"],
      }),
      Blockquote.extend({
        content: "paragraph*",
      }),
      Link.extend({
        inclusive: false,
      }).configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "یه چیزی بنویس...",
        includeChildren: true,
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

  return editor && hydrated ? (
    <div>
      <Toolbar editor={editor} />
      <BubbleMenu editor={editor} />
      <div
        className={cn(
          "mt-6 mx-auto px-1 sm:px-2 pb-4",
          "prose prose-sm sm:prose-base md:prose-md",
          "prose-img:mb-2 prose-img:rounded prose-figcaption:text-center",
          "prose-a:text-rose-500",
        )}
      >
        <EditorContent editor={editor} />
        <div className="text-gray-400 float-left">
          {/* eslint-disable-next-line */}
          {editor.storage.characterCount.words()} کلمه
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center">
      <div className="animate-pulse w-full">
        <div className="bg-black h-12" />
      </div>
      <div className="mt-10" />
      <div className="prose animate-pulse w-full">
        <p className="rounded bg-gray-300 h-5" />
        <p className="rounded bg-gray-300 h-5" />
        <p className="rounded bg-gray-300 h-5 w-3/4" />
      </div>
    </div>
  );
};
