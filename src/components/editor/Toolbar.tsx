import Compressor from "compressorjs";

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
  H1,
  H2,
  H3,
} from "../../icons";
import { useFileReader } from "../../hooks/useFileReader";
import { ButtonGroup } from "../ButtonGroup";

interface ToolbarProps {
  editor: Editor;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  const [linkOpen, setLinkOpen] = useState(false);
  const [link, setLink] = useState<string>("");
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
        </ButtonGroup>
      </div>
    </IconContext.Provider>
  );
};
