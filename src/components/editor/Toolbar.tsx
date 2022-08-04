import toast from "react-hot-toast";
import * as Popover from "@radix-ui/react-popover";

import { useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import { IconContext } from "react-icons";

import { compressImage } from "../../utils/compressImage";
import { Button } from "../Button";
import { Input } from "../Input";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Link,
  Code,
  Blockquote,
  TextLtr,
  TextRtl,
  OrderedList,
  UnorderedList,
  ImageAdd,
  HorizontalRule,
  Superscript,
  Subscript,
  H1,
  H2,
  H3,
  Check,
} from "../../icons";
import { useFileReader } from "../../hooks/useFileReader";
import { ButtonGroup } from "../ButtonGroup";
import { maxSize as maxImageSize } from "./extensions/Figure";

interface ToolbarProps {
  editor: Editor;
}

const ToolbarLinkToggler = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const setLinkCommand = () => {
    if (link) {
      editor
        .chain()
        .focus()
        .setLink({ href: link })
        .setTextSelection(editor.state.selection.to)
        .run();
    }
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(openning) => {
        if (!openning) {
          setOpen(openning);
          setLink(null);
        }

        if (openning) {
          if (editor.isActive("link")) {
            editor
              .chain()
              .focus()
              .unsetMark("link", { extendEmptyMarkRange: true })
              .run();
          } else if (!editor.state.selection.empty) {
            setOpen(true);
          }
        }
      }}
    >
      <Popover.Trigger asChild>
        <Button isActive={editor.isActive("link")} icon={<Link />} />
      </Popover.Trigger>
      <Popover.Content>
        <div className="relative z-50">
          <input
            dir="ltr"
            value={link || ""}
            onChange={(e) => setLink(e.target.value)}
            className="w-full py-3 pl-2 pr-16 text-sm text-black border-2 border-gray-200 rounded-lg"
            onKeyDown={(e) => {
              if (link && e.key === "Enter") {
                e.preventDefault();
                setLinkCommand();
              }
            }}
            placeholder="لینک"
          />
          <button
            className="absolute p-1 text-white -translate-y-1/2 bg-green-500 rounded-full top-1/2 right-4"
            onClick={() => {
              setLinkCommand();
            }}
          >
            <Check />
          </button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export const Toolbar = ({ editor }: ToolbarProps) => {
  const { setFile: setImage } = useFileReader({
    onLoad: async (result) => {
      editor
        .chain()
        .focus()
        .setFigure({ src: result as string })
        .run();
    },
  });

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const insertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const file: File = e.target.files[0];

    if (file.size > maxImageSize) {
      toast.error(
        `حجم تصاویر حداکثر میتواند ${maxImageSize / 1000000} مگابایت باشد`
      );
      return;
    }

    compressImage(file, (result) => setImage(result as File));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  return (
    <IconContext.Provider value={{ size: "1.2rem" }}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 bg-black text-white p-2 sticky top-0 z-50">
        <ButtonGroup>
          <Button
            isActive={editor.isActive({ dir: "rtl" })}
            onClick={() => editor.chain().focus().setTextDirection("rtl").run()}
            icon={<TextRtl />}
          />

          <Button
            isActive={editor.isActive({ dir: "ltr" })}
            onClick={() => editor.chain().focus().setTextDirection("ltr").run()}
            icon={<TextLtr />}
          />
        </ButtonGroup>

        <ButtonGroup>
          <Button
            isActive={editor.isActive("horizontalRule")}
            onClick={() =>
              editor.chain().focus().setHorizontalRule().enter().run()
            }
            icon={<HorizontalRule />}
          />

          <Button>
            <label htmlFor="file-uploader">
              <Input
                ref={imageInputRef}
                id="file-uploader"
                type="file"
                accept="image/*"
                onChange={insertImage}
                className="hidden"
              />
              <ImageAdd />
            </label>
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            icon={<UnorderedList />}
          />

          <Button
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={<OrderedList />}
          />

          <Button
            isActive={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            icon={<Code />}
          />

          <Button
            isActive={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            icon={<Blockquote />}
          />
        </ButtonGroup>

        <ButtonGroup>
          <Button
            isActive={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            icon={<H1 />}
          />

          <Button
            isActive={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            icon={<H2 />}
          />

          <Button
            isActive={editor.isActive("heading", { level: 4 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            icon={<H3 />}
          />
        </ButtonGroup>

        <ButtonGroup>
          <Button
            isActive={editor.isActive("superscript")}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            icon={<Superscript />}
          />

          <Button
            isActive={editor.isActive("subscript")}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            icon={<Subscript />}
          />

          <Button
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            icon={<Bold />}
          />

          <Button
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            icon={<Italic />}
          />

          <Button
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            icon={<Underline />}
          />

          <Button
            isActive={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            icon={<Strikethrough />}
          />

          <ToolbarLinkToggler editor={editor} />
        </ButtonGroup>
      </div>
    </IconContext.Provider>
  );
};
