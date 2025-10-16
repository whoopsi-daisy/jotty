import { Extension, KeyboardShortcutCommand } from "@tiptap/core";

export const KeyboardShortcuts = Extension.create({
  name: "keyboardShortcuts",

  addKeyboardShortcuts(): Record<string, KeyboardShortcutCommand> {
    const setLink = () => {
      const url = window.prompt("URL");
      if (url) {
        this.editor.chain().focus().setLink({ href: url }).run();
      }
    };

    return {
      "Mod-b": () => this.editor.chain().focus().toggleBold().run(),
      "Mod-i": () => this.editor.chain().focus().toggleItalic().run(),
      "Mod-u": () => this.editor.chain().focus().toggleUnderline().run(),
      "Mod-Shift-x": () => this.editor.chain().focus().toggleStrike().run(),
      "Mod-e": () => this.editor.chain().focus().toggleCode().run(),
      "Mod-k": () => {
        setLink();
        return true;
      },

      "Mod-Alt-1": () =>
        this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      "Mod-Alt-2": () =>
        this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      "Mod-Alt-3": () =>
        this.editor.chain().focus().toggleHeading({ level: 3 }).run(),

      "Mod-Shift-8": () => this.editor.chain().focus().toggleBulletList().run(),
      "Mod-Shift-7": () =>
        this.editor.chain().focus().toggleOrderedList().run(),
      "Mod-Shift-9": () => this.editor.chain().focus().toggleTaskList().run(),
      "Mod-Shift-b": () => this.editor.chain().focus().toggleBlockquote().run(),

      "Mod-Alt-c": () => this.editor.chain().focus().toggleCodeBlock().run(),
    };
  },
});
