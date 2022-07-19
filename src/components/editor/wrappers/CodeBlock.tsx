import { NodeViewWrapper, NodeViewProps, NodeViewContent } from "@tiptap/react";

export const CodeBlockWrapper = ({
  updateAttributes,
  extension,
}: NodeViewProps) => {
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
