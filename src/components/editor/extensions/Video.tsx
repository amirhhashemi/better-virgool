import { Node, nodeInputRule } from "@tiptap/react";
import { Plugin, PluginKey } from "prosemirror-state";

export interface VideoOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string }) => ReturnType;
    };
  }
}

const VIDEO_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export const Video = Node.create({
  name: "video",

  group: "block",

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (el) => (el as HTMLSpanElement).getAttribute("src"),
        renderHTML: (attrs) => ({ src: attrs.src }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
        getAttrs: (el) => ({
          src: (el as HTMLVideoElement).getAttribute("src"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      { controls: "true", ...HTMLAttributes },
      ["source", HTMLAttributes],
    ];
  },

  addCommands() {
    return {
      setVideo:
        ({ src }) =>
        ({ commands }) =>
          commands.insertContent(`<video controls="true" src="${src}" />`),
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: VIDEO_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [, , src] = match;

          return { src };
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("videoDropPlugin"),

        props: {
          handleDrop(view, event) {
            const {
              state: { schema, tr },
              dispatch,
            } = view;

            if (!event.dataTransfer?.files?.length) return false;

            const video = Array.from(event.dataTransfer.files).find((file) =>
              /video/i.test(file.type)
            );

            if (!video) return false;

            event.preventDefault();

            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });

            const reader = new FileReader();

            reader.onload = (readerEvent) => {
              const node = schema.nodes.video.create({
                src: readerEvent.target?.result,
              });

              if (coordinates && typeof coordinates.pos === "number") {
                const transaction = tr.insert(coordinates?.pos, node);

                dispatch(transaction);
              }
            };

            reader.readAsDataURL(video);

            return true;
          },
        },
      }),
    ];
  },
});
