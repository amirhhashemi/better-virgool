import Compressor from "compressorjs";

import { useState, useRef } from "react";
import { Editor } from "@tiptap/react";

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
  TextLeft,
  TextRight,
  OrderedList,
  UnorderedList,
  ImageAdd,
  HorizontalRule,
  H1,
  H2,
  H3,
  Video,
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
  const { setFile: setVideo } = useFileReader({
    onLoad: async (result) => {
      editor
        .chain()
        .focus()
        .setVideo({ src: result as string })
        .run();
    },
  });

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const insertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const file: File = e.target.files[0];

    new Compressor(file, {
      quality: 0.8,
      success(result) {
        setImage(result as File);
      },
      error(err) {
        console.log("fileCompressionError:", err.message);
      },
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const insertVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }
    const file: File = e.target.files[0];

    setVideo(file);

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center bg-black text-white p-2 sticky top-0 z-50">
        <ButtonGroup>
          <Button
            active={editor.isActive({ dir: "rtl" })}
            onClick={() => editor.chain().focus().setTextDirection("rtl").run()}
            icon={TextRight}
          />

          <Button
            active={editor.isActive({ dir: "ltr" })}
            onClick={() => editor.chain().focus().setTextDirection("ltr").run()}
            icon={TextLeft}
          />
        </ButtonGroup>

        <ButtonGroup>
          <Button
            active={editor.isActive("horizontalRule")}
            onClick={() =>
              editor.chain().focus().setHorizontalRule().enter().run()
            }
            icon={HorizontalRule}
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

          <Button>
            <label htmlFor="video-uploader">
              <Input
                ref={videoInputRef}
                id="video-uploader"
                type="file"
                accept="video/*"
                onChange={insertVideo}
                className="hidden"
              />
              <Video />
            </label>
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            icon={Code}
          />
          <Button
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            icon={UnorderedList}
          />

          <Button
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={OrderedList}
          />

          <Button
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            icon={Blockquote}
          />
        </ButtonGroup>

        <ButtonGroup>
          <Button
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            icon={H1}
          />

          <Button
            active={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            icon={H2}
          />

          <Button
            active={editor.isActive("heading", { level: 4 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            icon={H3}
          />
        </ButtonGroup>

        <ButtonGroup>
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
            active={editor.isActive("link")}
            onClick={() => setLinkOpen(!linkOpen)}
            icon={Link}
          />
        </ButtonGroup>
      </div>

      {linkOpen && (
        <Input
          className="mx-auto block bg-rose-300"
          placeholder="لینک..."
          onChange={(e) => setLink(e.target.value)}
          value={link}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              editor
                .chain()
                .toggleLink({
                  href: link,
                  target: "_blank",
                })
                .focus()
                .run();
              setLink("");
              setLinkOpen(false);
            }
          }}
        />
      )}
    </>
  );
};
