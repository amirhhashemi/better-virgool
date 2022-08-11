import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Editor } from "@tiptap/react";
import cn from "clsx";
import Compressor from "compressorjs";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { IconContext } from "react-icons";
import {
  Blockquote,
  Bold,
  Check,
  Code,
  H1,
  H2,
  H3,
  HorizontalRule,
  ImageAdd,
  Italic,
  Link,
  OrderedList,
  Strikethrough,
  Subscript,
  Superscript,
  TextLtr,
  TextRtl,
  Underline,
  UnorderedList,
} from "~/icons";

const MAX_IMAGE_SIZE_IN_MB = 4;

interface ToolbarButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  isActive?: boolean;
  tooltip?: string;
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ children, icon, isActive, tooltip, ...rest }, ref) => {
    const classes = cn(
      "w-8 h-8 p-2",
      "flex items-center justify-center",
      "outline-none rounded font-bold border-transparent hover:border-rose-500 hover:border",
      "ease-in-out transition duration-200",
      isActive ? "bg-rose-500" : "bg-black",
    );

    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button ref={ref} className={classes} {...rest}>
              <span className="m-2 flex items-center">{icon}</span>
              {children}
            </button>
          </Tooltip.Trigger>
          {tooltip && (
            <Tooltip.Content sideOffset={10}>
              <div className="text-red-300 text-sm opacity-90 px-2 py-1 rounded bg-gray-800">
                {tooltip}
              </div>
            </Tooltip.Content>
          )}
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  },
);

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ToolbarButtonGroup = ({
  children,
  className,
  ...rest
}: ButtonGroupProps) => {
  const classes = cn("flex items-center gap-x-0.5", className);

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

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
        <ToolbarButton
          tooltip="لینک"
          isActive={editor.isActive("link")}
          icon={<Link />}
        />
      </Popover.Trigger>
      <Popover.Content>
        <div className="relative z-50">
          <input
            dir="ltr"
            value={link ?? ""}
            onChange={(e) => setLink(e.target.value)}
            className="w-full py-2 pl-2 pr-14 text-sm text-black border-2 border-gray-200 rounded-lg"
            onKeyDown={(e) => {
              if (link && e.key === "Enter") {
                e.preventDefault();
                setLinkCommand();
              }
            }}
            placeholder="لینک"
          />
          <button
            className="absolute p-1 text-white -translate-y-1/2 bg-green-500 rounded-full top-1/2 right-2"
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

const ToolbarImageInput = ({ editor }: { editor: Editor }) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const insertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    if (file.size > MAX_IMAGE_SIZE_IN_MB * 1000000) {
      toast.error(
        `حجم تصاویر حداکثر میتواند ${MAX_IMAGE_SIZE_IN_MB} مگابایت باشد`,
      );

      return;
    }

    const arrayBufferReader = new FileReader();

    arrayBufferReader.onload = (e) => {
      if (!e.target?.result) {
        return;
      }

      const imageMimes = [
        {
          mime: "image/png",
          pattern: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
        },
        {
          mime: "image/jpeg",
          pattern: [0xff, 0xd8, 0xff],
        },
        {
          mime: "image/gif",
          pattern: [0x47, 0x49, 0x46, 0x38],
        },
        {
          mime: "image/webp",
          pattern: [
            0x52,
            0x49,
            0x46,
            0x46,
            undefined,
            undefined,
            undefined,
            undefined,
            0x57,
            0x45,
            0x42,
            0x50,
            0x56,
            0x50,
          ],
        },
      ];

      const bytes = new Uint8Array(e.target.result as ArrayBuffer);

      const valid = imageMimes.some((mime) =>
        mime.pattern.every((p, i) => !p || bytes[i] === p),
      );

      if (!valid) {
        toast.error("تنها فایل های png, jpeg, gif و webp قابل آپلود هستند");
        return;
      }

      new Compressor(file, {
        quality: 0.8,
        success: (result) => {
          const reader = new FileReader();

          reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
              editor
                .chain()
                .focus()
                .setFigure({ src: e.target.result as string })
                .run();
            }
          };

          reader.onerror = () => {
            toast.error("برگذاری فایل ناموفق بود لطفا دوباره امتحان کنید");
          };

          reader.readAsDataURL(result);
        },
        error: () => {
          toast.error("برگذاری فایل ناموفق بود لطفا دوباره امتحان کنید");
        },
      });
    };

    arrayBufferReader.readAsArrayBuffer(file.slice(0, 14));
  };

  const handleInputClick = () => {
    imageInputRef.current?.click();
  };

  return (
    <ToolbarButton
      tooltip="تصویر"
      icon={<ImageAdd />}
      onClick={handleInputClick}
    >
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={insertImage}
        className={cn(
          "w-full py-2 px-4",
          "hidden rounded rounded-8 border focus:outline-none bg-gray-100",
          "placeholder:text-right",
        )}
      />
    </ToolbarButton>
  );
};

export const Toolbar = ({ editor }: ToolbarProps) => {
  return (
    <IconContext.Provider value={{ size: "1.2rem" }}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 bg-black text-white p-2 sticky top-0 z-50">
        <ToolbarButtonGroup>
          <ToolbarButton
            tooltip="راست به چپ"
            isActive={editor.isActive({ dir: "rtl" })}
            onClick={() => editor.chain().focus().setTextDirection("rtl").run()}
            icon={<TextRtl />}
          />

          <ToolbarButton
            tooltip="چپ به راست"
            isActive={editor.isActive({ dir: "ltr" })}
            onClick={() => editor.chain().focus().setTextDirection("ltr").run()}
            icon={<TextLtr />}
          />
        </ToolbarButtonGroup>

        <ToolbarButtonGroup>
          <ToolbarButton
            tooltip="جدا کننده"
            isActive={editor.isActive("horizontalRule")}
            onClick={() =>
              editor.chain().focus().setHorizontalRule().enter().run()
            }
            icon={<HorizontalRule />}
          />

          <ToolbarImageInput editor={editor} />
        </ToolbarButtonGroup>

        <ToolbarButtonGroup>
          <ToolbarButton
            tooltip="فهرست نقطه ای (Ctrl+Shift+8)"
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            icon={<UnorderedList />}
          />

          <ToolbarButton
            tooltip="فهرست شماره گذاری شده (Ctrl+Shift+7)"
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={<OrderedList />}
          />

          <ToolbarButton
            tooltip="کد (Ctrl+Alt+C)"
            isActive={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            icon={<Code />}
          />

          <ToolbarButton
            tooltip="نقل‌قول (Ctrl+Shift+B)"
            isActive={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            icon={<Blockquote />}
          />
        </ToolbarButtonGroup>

        <ToolbarButtonGroup>
          <ToolbarButton
            tooltip="عنوان ۲ (Ctrl+Alt+2)"
            isActive={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            icon={<H1 />}
          />

          <ToolbarButton
            tooltip="عنوان ۳ (Ctrl+Alt+3)"
            isActive={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            icon={<H2 />}
          />

          <ToolbarButton
            tooltip="عنوان ۴ (Ctrl+Alt+4)"
            isActive={editor.isActive("heading", { level: 4 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            icon={<H3 />}
          />
        </ToolbarButtonGroup>

        <ToolbarButtonGroup>
          <ToolbarButton
            tooltip="توان (.+Ctrl)"
            isActive={editor.isActive("superscript")}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            icon={<Superscript />}
          />

          <ToolbarButton
            tooltip="فرجه (,+Ctrl)"
            isActive={editor.isActive("subscript")}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            icon={<Subscript />}
          />

          <ToolbarButton
            tooltip="ضخیم (Ctrl+B)"
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            icon={<Bold />}
          />

          <ToolbarButton
            tooltip="تاکید (Ctrl+I)"
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            icon={<Italic />}
          />

          <ToolbarButton
            tooltip="خط زیر (Ctrl+U)"
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            icon={<Underline />}
          />

          <ToolbarButton
            tooltip="خط رو! (Ctrl+X)"
            isActive={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            icon={<Strikethrough />}
          />

          <ToolbarLinkToggler editor={editor} />
        </ToolbarButtonGroup>
      </div>
    </IconContext.Provider>
  );
};
