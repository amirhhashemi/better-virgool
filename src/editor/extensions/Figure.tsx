import {
  defaultBlockAt,
  mergeAttributes,
  Node,
  nodeInputRule,
} from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import cn from "clsx";
import { Selection } from "prosemirror-state";
import { Trash } from "~/icons";

interface FigureOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figure: {
      setFigure: (options: { src: string; alt?: string }) => ReturnType;
    };
  }
}

const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

// TODO: add placeholder
export const Figure = Node.create<FigureOptions>({
  name: "figure",
  inline: false,
  group: "block",
  content: "inline*",
  draggable: true,
  selectable: true,
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

const FigureWrapper = ({ node, deleteNode }: NodeViewProps) => {
  return (
    <NodeViewWrapper className="flex justify-center" data-type="figure">
      <figure className="relative group">
        {node.attrs.src && <img src={node.attrs.src} alt="Image" />}
        {/* TODO: sync alt with caption */}
        <NodeViewContent as="figcaption" className="text-center" dir="auto" />
        <button
          className={cn(
            "w-8 h-8 p-2 z-20",
            "absolute top-2 right-2 flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 bg-gray-800 hover:bg-gray-700 text-rose-500 rounded",
            "ease-in-out transition duration-200"
          )}
          onClick={() => deleteNode()}
        >
          <Trash size={"1.2rem"} />
        </button>
      </figure>
    </NodeViewWrapper>
  );
};
