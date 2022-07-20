import {
  mergeAttributes,
  nodeInputRule,
  defaultBlockAt,
  Node,
} from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Selection, Plugin, PluginKey } from "prosemirror-state";

import { FigureWrapper } from "../wrappers/Figure";
import { compressImage } from "../../../utils/compressImage";

export interface FigureOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figure: {
      setFigure: (options: {
        src: string;
        alt?: string;
        caption?: string;
      }) => ReturnType;
    };
  }
}

export const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export const Figure = Node.create<FigureOptions>({
  name: "figure",
  group: "block",
  content: "inline*",
  draggable: true,
  selectable: false,
  isolating: true,
  marks: "",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("src"),
      },

      alt: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("alt"),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        contentElement: "figcaption",
        getAttrs: (node) => {
          const datatype = (node as HTMLElement).getAttribute("data-type");
          return datatype === "figure" && null;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, { "data-type": "figure" }),
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          draggable: false,
          contenteditable: false,
        }),
      ],
      ["figcaption", 0],
    ];
  },

  addCommands() {
    return {
      setFigure:
        ({ caption, ...attrs }) =>
        ({ chain }) => {
          return (
            chain()
              .insertContent({
                type: this.name,
                attrs,
                content: caption ? [{ type: "text", text: caption }] : [],
              })
              // set cursor at end of caption field
              .command(({ tr, commands }) => {
                const { doc, selection } = tr;
                const position = doc.resolve(selection.to).end();

                return commands.setTextSelection(position);
              })
              .run()
          );
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        return editor.commands.command(({ state, dispatch }) => {
          const { $head, $anchor } = state.selection;

          if (!$head.sameParent($anchor)) {
            return false;
          }

          const above = $head.node(-1);
          const after = $head.indexAfter(-1);
          const type = defaultBlockAt(above.contentMatchAt(after));

          if (!type || !above.canReplaceWith(after, after, type)) {
            return false;
          }

          if (dispatch) {
            const pos = $head.after();
            const tr = state.tr.replaceWith(pos, pos, type.createAndFill()!);

            tr.setSelection(Selection.near(tr.doc.resolve(pos), 1));
            dispatch(tr.scrollIntoView());
          }

          return true;
        });
      },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, src, alt] = match;

          return { src, alt };
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("figureDropPlugin"),
        props: {
          handleDrop(view, event) {
            const {
              state: { schema, tr },
              dispatch,
            } = view;
            if (!event?.dataTransfer?.files.length) return false;

            const image = Array.from(event.dataTransfer.files).find((file) =>
              /image/i.test(file.type)
            );

            if (!image) return false;

            event.preventDefault();

            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });

            compressImage(image, (result) => {
              const reader = new FileReader();

              reader.onload = (readerEvent) => {
                schema;
                const node = schema.nodes.figure.create({
                  src: readerEvent.target?.result,
                });

                if (coordinates && typeof coordinates.pos === "number") {
                  const transaction = tr.insert(coordinates?.pos, node);

                  dispatch(transaction);
                }
              };

              reader.readAsDataURL(result);
            });

            return true;
          },
          handlePaste(view, event) {
            if (!event.clipboardData?.files?.length) {
              return false;
            }

            const {
              state: { schema, tr },
              dispatch,
            } = view;

            const image = Array.from(event.clipboardData.files).find((file) =>
              /image/i.test(file.type)
            );

            if (!image) return false;

            event.preventDefault();

            compressImage(image, (result) => {
              const reader = new FileReader();

              reader.onload = (readerEvent) => {
                schema;
                const node = schema.nodes.figure.create({
                  src: readerEvent.target?.result,
                });

                const transaction = tr.replaceSelectionWith(node);

                dispatch(transaction);
              };

              reader.readAsDataURL(result);
            });

            return true;
          },
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureWrapper);
  },
});
