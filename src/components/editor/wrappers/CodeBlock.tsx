import { NodeViewWrapper, NodeViewProps, NodeViewContent } from "@tiptap/react";

export const CodeBlockWrapper = ({
  updateAttributes,
  extension,
}: NodeViewProps) => {
  return (
    <NodeViewWrapper as="pre" className="relative pt-8" data-type="code-block">
      <NodeViewContent as="code" dir="ltr" />
      <select
        className="hljs absolute top-2 right-2"
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
