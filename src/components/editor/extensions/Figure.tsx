import {
  mergeAttributes,
  nodeInputRule,
  defaultBlockAt,
  Node,
} from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Selection } from "prosemirror-state";

import { FigureWrapper } from "../wrappers/Figure";

interface FigureOptions {
  HTMLAttributes: Record<string, any>;
  maxSize: number;
  onError: (err: Error) => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figure: {
      setFigure: (options: { src: string; alt?: string }) => ReturnType;
    };
  }
}

export const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;
export const maxSize = 3000000;

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
      maxSize,
      onError: (err: Error) => console.error(err),
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
        (attrs) =>
        ({ chain }) => {
          return (
            chain()
              .insertContent({
                type: this.name,
                attrs,
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

  addNodeView() {
    return ReactNodeViewRenderer(FigureWrapper);
  },
});
