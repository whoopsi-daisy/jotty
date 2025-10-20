import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
  ReactNodeViewProps,
} from "@tiptap/react";
import { FC } from "react";

const DetailsNodeView: FC<ReactNodeViewProps<HTMLElement>> = ({ node }) => {
  return (
    <NodeViewWrapper as="details">
      <summary className="font-semibold cursor-pointer select-none">
        {node.attrs.summary}
      </summary>
      <NodeViewContent as="div" />
    </NodeViewWrapper>
  );
};

export const DetailsExtension = Node.create({
  name: "details",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      summary: {
        default: "Details",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "details",
        getAttrs: (dom) => {
          const summaryElement = (dom as HTMLElement).querySelector("summary");
          return { summary: summaryElement?.textContent || "Details" };
        },
        contentElement: (dom: HTMLElement) => {
          const summaryElement = dom.querySelector("summary");

          if (summaryElement) {
            summaryElement.remove();
          }

          const contentWrapper = dom.querySelector("div");

          return contentWrapper || dom;
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "details",
      mergeAttributes(HTMLAttributes),
      ["summary", node.attrs.summary],
      ["div", 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DetailsNodeView);
  },
});
