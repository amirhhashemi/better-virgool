import {
  Editor,
  BubbleMenu as TiptapBubbleMenu,
  isTextSelection,
} from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Link,
  Code,
  Blockquote,
  TextLeft,
  TextRight,
} from "../../icons";
import { Button } from "../Button";

interface BubbleMenuProps {
  editor: Editor;
}

export const BubbleMenu = ({ editor, ...props }: BubbleMenuProps) => {
  return (
    <TiptapBubbleMenu
      {...props}
      editor={editor}
      shouldShow={({ editor, state, from, to }) => {
        const { doc, selection } = state;
        const { empty } = selection;

        // Sometime check for `empty` is not enough.
        // Doubleclick an empty paragraph returns a node size of 2.
        // So we check also for an empty text size.
        const isEmptyTextBlock =
          !doc.textBetween(from, to).length && isTextSelection(state.selection);

        if (empty || isEmptyTextBlock) {
          return false;
        }

        if (editor.isActive("image")) {
          return false;
        }

        return true;
      }}
      tippyOptions={{
        duration: 70,
      }}
    >
      <div className="btn-group rounded bg-blue-900">
        <Button
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
        />

        <Button
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
        />

        <Button
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={Underline}
        />

        <Button
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={Strikethrough}
        />

        <Button
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          icon={Code}
        />

        <Button
          active={editor.isActive("link")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: "link" })
              .run()
          }
          icon={Link}
        />

        <button className="h-4 my-4 bofore:bg-rose-300 after:bg-rose-300 gap-4 whitespace-nowrap"></button>

        <Button
          active={editor.isActive({ dir: "ltr" })}
          onClick={() => editor.chain().focus().setTextDirection("ltr").run()}
          icon={TextLeft}
        />

        <Button
          active={editor.isActive({ dir: "rtl" })}
          onClick={() => editor.chain().focus().setTextDirection("rtl").run()}
          icon={TextRight}
        />

        <Button
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={Blockquote}
        />
      </div>
    </TiptapBubbleMenu>
  );
};
