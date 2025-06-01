import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";
import { NodeSelection } from "@tiptap/pm/state";
import "./TipTapEditor.css";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }; // Removed table initialization

  return (
    <div className="editor-menu-bar mb-2">
      <div className="btn-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("bold") ? "active" : ""
          }`}
          title="Bold"
        >
          <i className="fas fa-bold"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("italic") ? "active" : ""
          }`}
          title="Italic"
        >
          <i className="fas fa-italic"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("underline") ? "active" : ""
          }`}
          title="Underline"
        >
          <i className="fas fa-underline"></i>
        </button>
      </div>{" "}
      <div className="btn-group ms-2">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("heading", { level: 2 }) ? "active" : ""
          }`}
          title="Heading"
        >
          <i className="fas fa-heading"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("blockquote") ? "active" : ""
          }`}
          title="Quote"
        >
          <i className="fas fa-quote-right"></i>
        </button>
      </div>
      <div className="btn-group ms-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("bulletList") ? "active" : ""
          }`}
          title="Bullet List"
        >
          <i className="fas fa-list-ul"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("orderedList") ? "active" : ""
          }`}
          title="Numbered List"
        >
          <i className="fas fa-list-ol"></i>
        </button>
      </div>
      <div className="btn-group ms-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive({ textAlign: "left" }) ? "active" : ""
          }`}
          title="Align Left"
        >
          <i className="fas fa-align-left"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive({ textAlign: "center" }) ? "active" : ""
          }`}
          title="Align Center"
        >
          <i className="fas fa-align-center"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive({ textAlign: "right" }) ? "active" : ""
          }`}
          title="Align Right"
        >
          <i className="fas fa-align-right"></i>
        </button>
      </div>{" "}
      <div className="btn-group ms-2">
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter the URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`btn btn-sm btn-outline-secondary ${
            editor.isActive("link") ? "active" : ""
          }`}
          title="Add Link"
        >
          <i className="fas fa-link"></i>
        </button>
        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="btn btn-sm btn-outline-secondary"
            title="Remove Link"
          >
            <i className="fas fa-unlink"></i>
          </button>
        )}
      </div>{" "}
      <div className="btn-group ms-2">
        <button
          type="button"
          onClick={addImage}
          className="btn btn-sm btn-outline-secondary"
          title="Insert Image"
        >
          <i className="fas fa-image"></i>
        </button>
      </div>
    </div>
  );
};

const TipTapEditor = ({ value, onChange, style }) => {
  const handlePaste = useCallback((event) => {
    const items = Array.from(event.clipboardData?.items || []);

    // Handle image paste from clipboard (screenshot or copied image)
    const imageItem = items.find((item) => item.type.startsWith("image"));
    if (imageItem) {
      event.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          editor.chain().focus().setImage({ src: e.target.result }).run();
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleDrop = useCallback((event) => {
    const items = Array.from(event.dataTransfer?.items || []);

    // Handle image drop
    const imageItem = items.find((item) => item.type.startsWith("image"));
    if (imageItem) {
      event.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          editor.chain().focus().setImage({ src: e.target.result }).run();
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Enable paste handling but remove table and horizontal rule
        paste: {
          transformPasted: true,
          transformPastedHTML: true,
        },
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary text-decoration-underline",
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "img-fluid rounded resizable-image",
          draggable: "true",
        },
        allowBase64: true,
        inline: true,
        resizable: true,
      }),
      Dropcursor,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    editorProps: {
      handlePaste: (view, event) => {
        handlePaste(event);
        return false; // Let TipTap handle other paste events
      },
      handleDrop: (view, event) => {
        handleDrop(event);
        return false; // Let TipTap handle other drop events
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  return (
    <div
      className="tiptap-editor"
      style={style}
      onDragOver={(e) => e.preventDefault()}
    >
      <MenuBar editor={editor} />
      <div
        className="border rounded p-3 editor-content-wrapper"
        style={{
          minHeight: style?.height || "200px",
          maxHeight: style?.maxHeight || "600px",
          overflowY: "auto",
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTapEditor;
