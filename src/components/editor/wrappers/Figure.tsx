import cn from "clsx";

import { NodeViewWrapper, NodeViewProps, NodeViewContent } from "@tiptap/react";

import { Trash } from "../../../icons";
import { Button } from "../../Button";

export const FigureWrapper = ({ node, deleteNode }: NodeViewProps) => {
  return (
    <NodeViewWrapper
      className="flex justify-center items-center"
      data-type="figure"
    >
      <figure className="relative group">
        {node.attrs.src && <img src={node.attrs.src} alt="Image" />}
        <NodeViewContent as="figcaption" className="text-center" dir="auto" />
        <Button
          className={cn(
            "absolute top-2 right-2",
            "rounded z-40",
            "opacity-0 group-hover:opacity-100 bg-gray-800 hover:bg-gray-700 text-rose-500",
            "transition duration-150"
          )}
          size="sm"
          onClick={() => deleteNode()}
          icon={<Trash size={"1.2rem"} />}
        />
      </figure>
    </NodeViewWrapper>
  );
};
