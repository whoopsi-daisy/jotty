import TurndownService from "turndown";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { Element } from "hast";

const turndownPluginGfm = require("turndown-plugin-gfm");

export const createTurndownService = () => {
  const service = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    bulletListMarker: "-",
    br: "\n",
  });

  service.use(turndownPluginGfm.gfm);

  service.addRule("listItem", {
    filter: (node) => {
      return node.nodeName === "LI";
    },
    replacement: (content, node) => {
      return `- ${content.trim()}\n`;
    },
  });

  service.addRule("horizontalRule", {
    filter: (node) => {
      return node.nodeName === "HR";
    },
    replacement: (content, node) => {
      return `\n---\n`;
    },
  });

  service.addRule("taskList", {
    filter: (node) => {
      return (
        node.nodeName === "LI" && node.getAttribute("data-type") === "taskItem"
      );
    },
    replacement: (content, node) => {
      const isChecked =
        (node as HTMLElement).getAttribute("data-checked") === "true";
      return `- [${isChecked ? "x" : " "}] ${content.trim()}\n`;
    },
  });

  service.addRule("fileAttachment", {
    filter: (node) => {
      return (
        node.nodeName === "P" &&
        (node as HTMLElement).hasAttribute("data-file-attachment")
      );
    },
    replacement: (content, node) => {
      const element = node as HTMLElement;
      const url = element.getAttribute("data-url");
      const fileName = element.getAttribute("data-file-name");
      const type = element.getAttribute("data-type");

      if (type === "image") {
        return `![${fileName}](${url})`;
      } else {
        return `[📎 ${fileName}](${url})`;
      }
    },
  });

  return service;
};

const hasClass = (node: Element, className: string) => {
  const classList = node.properties?.className;
  if (Array.isArray(classList)) {
    return classList.some((cn) => String(cn) === className);
  }
  if (typeof classList === "string") {
    return classList.split(" ").includes(className);
  }
  return false;
};

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(() => {
    return (tree) => {
      visit(tree, "element", (node: Element) => {
        if (node.tagName === "ul" && hasClass(node, "task-list")) {
          node.properties = node.properties || {};
          node.properties["data-type"] = "taskList";
        }
        if (node.tagName === "li" && hasClass(node, "task-list-item")) {
          node.properties = node.properties || {};
          node.properties["data-type"] = "taskItem";
          const checkbox = node.children[0];
          if (
            checkbox?.type === "element" &&
            checkbox.tagName === "input" &&
            checkbox.properties?.type === "checkbox"
          ) {
            node.properties["data-checked"] =
              checkbox.properties.checked != null &&
              checkbox.properties.checked !== false;
            node.children.shift();

            if (
              node.children[0]?.type === "text" &&
              node.children[0].value.startsWith("\n")
            ) {
              node.children[0].value = node.children[0].value.trimStart();
            }

            const contentNodes = [...node.children];
            node.children = [
              {
                type: "element",
                tagName: "p",
                properties: {},
                children: contentNodes,
              },
            ];
          }
        }
      });
    };
  })
  .use(rehypeStringify);

export const convertMarkdownToHtml = (markdown: string): string => {
  if (!markdown || typeof markdown !== "string") return "";
  const file = markdownProcessor.processSync(markdown);
  return String(file);
};

export const convertHtmlToMarkdown = (html: string): string => {
  const turndownService = createTurndownService();
  return turndownService.turndown(html);
};

export const processMarkdownContent = (content: string): string => {
  if (!content || typeof content !== "string") return "";
  return content.trim();
};

export const convertHtmlToMarkdownUnified = (html: string): string => {
  if (!html || typeof html !== "string") return "";
  return convertHtmlToMarkdown(html);
};

export const getMarkdownPreviewContent = (
  content: string,
  isMarkdownMode: boolean
): string => {
  if (isMarkdownMode) {
    return processMarkdownContent(content);
  } else {
    return convertHtmlToMarkdownUnified(content);
  }
};
