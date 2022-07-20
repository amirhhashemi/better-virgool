import { NodeViewWrapper, NodeViewProps, NodeViewContent } from "@tiptap/react";

import { X } from "../../../icons";

export const FigureWrapper = ({ node, deleteNode }: NodeViewProps) => {
  return (
    <NodeViewWrapper as="figure" className="relative" data-type="figure">
      {node.attrs.src && <img src={node.attrs.src} alt="Image" />}
      <NodeViewContent as="figcaption" className="text-center" dir="auto" />

      <X
        size={"2rem"}
        className="absolute top-2 right-2 cursor-pointer text-rose-500 z-40"
        onClick={() => deleteNode()}
      />
    </NodeViewWrapper>
  );
};
