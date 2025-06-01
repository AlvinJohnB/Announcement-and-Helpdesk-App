import React, { useState } from "react";

const BBCodeEditor = ({ value, onChange }) => {
  // BBCode toolbar buttons configuration
  const buttons = [
    { tag: "b", label: "Bold", icon: "fas fa-bold" },
    { tag: "i", label: "Italic", icon: "fas fa-italic" },
    { tag: "u", label: "Underline", icon: "fas fa-underline" },
    { tag: "url", label: "Link", icon: "fas fa-link" },
    { tag: "quote", label: "Quote", icon: "fas fa-quote-right" },
    { tag: "list", label: "List", icon: "fas fa-list" },
    { tag: "*", label: "List Item", icon: "fas fa-list-ul" },
  ];

  const insertBBCode = (tag) => {
    const textarea = document.getElementById("bbcode-editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let newText;

    switch (tag) {
      case "*":
        newText = `[*]${selectedText}`;
        break;
      case "list":
        newText = `[list]\n[*]${selectedText || "List item"}\n[/list]`;
        break;
      case "url":
        const url = prompt("Enter URL:", "http://");
        if (url) {
          newText = `[url=${url}]${selectedText || url}[/url]`;
        } else {
          return;
        }
        break;
      default:
        newText = `[${tag}]${selectedText}[/${tag}]`;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="bbcode-editor-container">
      <div className="btn-toolbar mb-2" role="toolbar">
        {buttons.map(({ tag, label, icon }) => (
          <button
            key={tag}
            type="button"
            className="btn btn-sm btn-outline-secondary me-1"
            title={label}
            onClick={() => insertBBCode(tag)}
          >
            <i className={icon}></i>
          </button>
        ))}
      </div>
      <textarea
        id="bbcode-editor"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="10"
        style={{ fontFamily: "monospace" }}
      />
    </div>
  );
};

export default BBCodeEditor;
