import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { lowlight } from "lowlight/lib/common.js";

export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockWrapper);
  },
}).configure({
  lowlight,
});

const CodeBlockWrapper = ({ updateAttributes, extension }: NodeViewProps) => {
  return (
    <NodeViewWrapper className="relative" dir="ltr">
      <pre spellCheck={false}>
        <NodeViewContent as="code" />
      </pre>
      <select
        className="hljs absolute top-2 right-2 text-sm"
        contentEditable={false}
        onChange={(event) => updateAttributes({ language: event.target.value })}
      >
        <option value="null">auto</option>
        {extension.options.lowlight
          .listLanguages()
          .map((lang: string, index: number) => (
            <option key={index} value={lang}>
              {lang}
            </option>
          ))}
      </select>
    </NodeViewWrapper>
  );
};
