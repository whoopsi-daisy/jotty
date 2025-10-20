# Testing custom syntax

# Comprehensive Content Test

This note demonstrates all supported custom HTML tags and Markdown features.

You can press <kbd>Cmd</kbd> + <kbd>K</kbd> to open the search palette. Please <mark>pay close attention</mark> to this important note, as it confirms all features are working as expected.

---

### Inline Formatting

- **Chemical Formula:** H<sub>2</sub>O
- **Mathematical Equation:** E=mc<sup>2</sup>
- **Acronym Definition:** This app uses a <abbr title="What You See Is What You Get">WYSIWYG</abbr> editor.

### Task List

- [x] Test custom HTML tags
- [x] Verify table styling
- [ ] Write documentation for users

### Standard Table

<table style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Feature</p></th><th colspan="1" rowspan="1"><p>Status</p></th><th colspan="1" rowspan="1"><p>Notes</p></th></tr><tr><td colspan="1" rowspan="1"><p>Highlighting</p></td><td colspan="1" rowspan="1"><p>Working</p></td><td colspan="1" rowspan="1"><p>Uses the <code>&lt;mark&gt;</code> tag.</p></td></tr><tr><td colspan="1" rowspan="1"><p>Sub/Superscript</p></td><td colspan="1" rowspan="1"><p>Working</p></td><td colspan="1" rowspan="1"><p>Uses <code>&lt;sub&gt;</code> and <code>&lt;sup&gt;</code>.</p></td></tr><tr><td colspan="1" rowspan="1"><p>Collapsible Blocks</p></td><td colspan="1" rowspan="1"><p>Working</p></td><td colspan="1" rowspan="1"><p>Uses <code>&lt;details&gt;</code> and <code>&lt;summary&gt;</code>.</p></td></tr></tbody></table>

### Collapsible Section

<details>Details

Details

Details

Details

Details

Details Click here for advanced details

This is a collapsible section containing extra information. It's useful for hiding supplementary content or spoilers.

- You can nest lists inside.
- And other block elements, like another horizontal rule.

---


</details>

### Code Block

```javascript
function greet(name) {
  // This is a standard GFM code block.
  console.log(`Hello, ${name}!`);
}
```

`greet('World');`