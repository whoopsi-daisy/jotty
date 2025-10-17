import TurndownService from "turndown";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { Element } from "hast";
import { addCustomHtmlTurndownRules } from "@/app/_utils/custom-html-utils";
import { html as beautifyHtml } from "js-beautify";

const turndownPluginGfm = require("turndown-plugin-gfm");

const formatAllHtmlInMarkdown = (markdown: string): string => {
  const beautifyOptions = {
    indent_size: 2,
    unformatted: [],
  };

  const htmlBlockRegex = /<([a-zA-Z0-9]+)(?:[^>]*?)>[\s\S]*?<\/\1>/g;

  return markdown.replace(htmlBlockRegex, (match) => {
    return beautifyHtml(match, beautifyOptions);
  });
};

export const createTurndownService = () => {
  const service = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    bulletListMarker: "-",
  });

  service.use(turndownPluginGfm.gfm);

  addCustomHtmlTurndownRules(service);

  service.addRule("keepHtmlTables", {
    filter: "table",
    replacement: (content, node) => `\n\n${(node as HTMLElement).outerHTML}\n\n`,
  });

  service.addRule("details", {
    filter: "details",
    replacement: function (content, node) {
      const element = node as HTMLElement;
      const summaryNode = element.querySelector("summary");
      const summaryText = summaryNode ? summaryNode.textContent : "Details";

      const contentNode = element.cloneNode(true) as HTMLElement;
      const summaryToRemove = contentNode.querySelector("summary");
      if (summaryToRemove) {
        contentNode.removeChild(summaryToRemove);
      }
      const mainContent = service.turndown(contentNode.innerHTML);

      return `\n<details><summary>${summaryText}</summary>\n\n${mainContent}\n\n</details>\n`;
    },
  });

  service.addRule("listItem", {
    filter: "li",
    replacement: function (content, node, options) {
      const element = node as HTMLElement;
      content = content.trim();
      const isTaskItem = element.getAttribute("data-type") === "taskItem";

      let prefix = "";
      const parent = element.parentNode;

      if (parent && parent.nodeName === "OL") {
        const parentElement = parent as HTMLOListElement;
        const start = parentElement.getAttribute("start");
        const index = Array.prototype.indexOf.call(
          parentElement.children,
          element
        );
        prefix = (start ? Number(start) + index : index + 1) + ". ";
      } else if (isTaskItem) {
        const isChecked = element.getAttribute("data-checked") === "true";
        prefix = options.bulletListMarker + ` [${isChecked ? "x" : " "}] `;
      } else {
        prefix = options.bulletListMarker + " ";
      }

      let indentLevel = -1;
      let current: Node | null = element;
      while (current) {
        if (current.nodeName === "UL" || current.nodeName === "OL") {
          indentLevel++;
        }
        current = current.parentNode;
      }
      const indent = "    ".repeat(Math.max(0, indentLevel));

      return indent + prefix + content + "\n";
    },
  });

  service.addRule("horizontalRule", {
    filter: (node) => node.nodeName === "HR",
    replacement: () => `\n---\n`,
  });

  service.addRule("taskList", {
    filter: (node) =>
      node.nodeName === "LI" && node.getAttribute("data-type") === "taskItem",
    replacement: (content, node) => {
      const isChecked =
        (node as HTMLElement).getAttribute("data-checked") === "true";
      return `- [${isChecked ? "x" : " "}] ${content.trim()}\n`;
    },
  });

  service.addRule("fileAttachment", {
    filter: (node) =>
      node.nodeName === "P" &&
      (node as HTMLElement).hasAttribute("data-file-attachment"),
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
  const rawMarkdown = turndownService.turndown(html);
  return formatAllHtmlInMarkdown(rawMarkdown);
};

export const processMarkdownContent = (content: string): string => {
  if (!content || typeof content !== "string") return "";
  return content;
};

export const convertHtmlToMarkdownUnified = (html: string): string => {
  if (!html || typeof html !== "string") return "";
  const turndownService = createTurndownService();
  const rawMarkdown = turndownService.turndown(html);
  return formatAllHtmlInMarkdown(rawMarkdown);
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