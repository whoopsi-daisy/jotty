# markdown syntax

# ⌨️ App Markdown Guide

This guide covers all supported syntax for **creating** rich <mark>content</mark> in your notes. The editor uses an extended version of GitHub Flavored Markdown (GFM) that includes standard syntax as well as several custom HTML tags for advanced formatting. test

---

## Standard Markdown

<kbd>test</kbd>

These are the foundational elements for <abbr title="test">fomatting</abbr> your text.

### Text Formatting

<table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Style</p></th><th colspan="1" rowspan="1"><p>Syntax</p></th><th colspan="1" rowspan="1"><p>Example</p></th></tr><tr><td colspan="1" rowspan="1"><p><strong>Bold</strong></p></td><td colspan="1" rowspan="1"><p><code>**Bold Text**</code></p></td><td colspan="1" rowspan="1"><p><strong>Bold Text</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><em>Italic</em></p></td><td colspan="1" rowspan="1"><p><code>*Italic Text*</code></p></td><td colspan="1" rowspan="1"><p><em>Italic Text</em></p></td></tr><tr><td colspan="1" rowspan="1"><p><s>Strikethrough</s></p></td><td colspan="1" rowspan="1"><p><code>~~Strikethrough~~</code></p></td><td colspan="1" rowspan="1"><p><s>Strikethrough</s></p></td></tr><tr><td colspan="1" rowspan="1"><p><code>Inline Code</code></p></td><td colspan="1" rowspan="1"><p><code>`Inline Code`</code></p></td><td colspan="1" rowspan="1"><p><code>Inline Code</code></p></td></tr><tr><td colspan="1" rowspan="1"><p>Link</p></td><td colspan="1" rowspan="1"><p><code>[Google](https://google.com)</code></p></td><td colspan="1" rowspan="1"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://google.com">Google</a></p></td></tr><tr><td colspan="1" rowspan="1"><p>Image</p></td><td colspan="1" rowspan="1"><p><code>![Alt Text](image_url)</code></p></td><td colspan="1" rowspan="1"><p>An image will be displayed</p></td></tr><tr><td colspan="1" rowspan="1"><p>Blockquote</p></td><td colspan="1" rowspan="1"><p><code>&gt; Quoted text</code></p></td><td colspan="1" rowspan="1"><p>&gt; Quoted text</p></td></tr><tr><td colspan="1" rowspan="1"><p>Horizontal Rule</p></td><td colspan="1" rowspan="1"><p><code>---</code></p></td><td colspan="1" rowspan="1"><p>A horizontal line will appear</p></td></tr></tbody></table>

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Lists

**Unordered List**

```markdown
- Item 1
- Item 2
  - Nested Item
```

**Ordered List**

```markdown
1. First Item
2. Second Item
3. Third Item
```

---

## Advanced Elements

### Task Lists

You can create checklists with interactive checkboxes directly in the editor.

```markdown
- [x] Completed task
- [ ] Incomplete task
```

### Tables

Create tables using standard Markdown pipe syntax or raw HTML.

```markdown
| Feature         | Status    |
| --------------- | --------- |
| Highlighting    | Supported |
| Keyboard Keys   | Supported |
```

***Note:*** *While you can create tables using Markdown, they will always be saved as HTML in the final file to perfectly preserve structure and custom formatting.*

### Code Blocks

Wrap your code in triple backticks. You can specify a language for syntax highlighting.

````markdown
```javascript
function helloWorld() {
  console.log("Hello, world!");
}
```
````

## Custom HTML Tags

For more advanced formatting, you can use the following HTML tags directly in the editor. They will persist when switching between editor modes and will render correctly in the final view.

<table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><td colspan="1" rowspan="1"><p><strong>Element</strong></p></td><td colspan="1" rowspan="1"><p><strong>Description</strong></p></td><td colspan="1" rowspan="1"><p><strong>Syntax &amp; Example</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Keyboard Key</strong></p></td><td colspan="1" rowspan="1"><p><kbd class="bg-muted px-2 py-1 text-xs rounded-md border border-border shadow-border shadow-sm">Enter</kbd></p></td><td colspan="1" rowspan="1"><p><code>&lt;kbd&gt;Enter&lt;/kbd&gt;</code></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Highlight</strong></p></td><td colspan="1" rowspan="1"><p><mark class="bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded-sm">important</mark></p></td><td colspan="1" rowspan="1"><p><code>&lt;mark&gt;important&lt;/mark&gt;</code></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Subscript</strong></p></td><td colspan="1" rowspan="1"><p>H<sub class="">2</sub>O.</p></td><td colspan="1" rowspan="1"><p><code>H&lt;sub&gt;2&lt;/sub&gt;O</code></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Superscript</strong></p></td><td colspan="1" rowspan="1"><p>E=mc<sup class="">2</sup></p></td><td colspan="1" rowspan="1"><p><code>E=mc&lt;sup&gt;2&lt;/sup&gt;</code></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Abbreviation</strong></p></td><td colspan="1" rowspan="1"><p><abbr title="HyperText Markup Language" class="underline decoration-dotted cursor-help">HTML</abbr></p></td><td colspan="1" rowspan="1"><p><code>&lt;abbr title="HyperText Markup Language"&gt;HTML&lt;/abbr&gt;.</code></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Collapsible Section</strong></p></td><td colspan="1" rowspan="1"><p>Creates an interactive, collapsible section to hide content.</p></td><td colspan="1" rowspan="1"><pre><code class="language-html">&lt;details&gt;
&nbsp; &nbsp; &lt;summary&gt;Click to see more!&lt;/summary&gt;&nbsp;
&nbsp; &nbsp; This content is hidden by default but can be expanded.&nbsp;
&lt;/details&gt;</code></pre></td></tr><tr><td colspan="1" rowspan="1"><p><strong>File Attachment</strong></p></td><td colspan="1" rowspan="1"><p>Creates a special link formatted as a downloadable file.</p></td><td colspan="1" rowspan="1"><p><code>[📎 report.pdf](/path/to/file)</code></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Image</strong></p></td><td colspan="1" rowspan="1"><p>Embeds an image directly in the note.</p></td><td colspan="1" rowspan="1"><p><code>![Alt Text](/path/to/image.jpg)</code></p></td></tr></tbody></table>