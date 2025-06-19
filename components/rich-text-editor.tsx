"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Edit3,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing your article...",
  height = "400px",
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertHTML = (html: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const div = document.createElement("div");
        div.innerHTML = html;
        const fragment = document.createDocumentFragment();
        let node;
        while ((node = div.firstChild)) {
          fragment.appendChild(node);
        }
        range.insertNode(fragment);
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle common shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          executeCommand("bold");
          break;
        case "i":
          e.preventDefault();
          executeCommand("italic");
          break;
        case "u":
          e.preventDefault();
          executeCommand("underline");
          break;
      }
    }
  };

  const toolbarButtons = [
    {
      icon: Bold,
      command: "bold",
      title: "Bold (Ctrl+B)",
    },
    {
      icon: Italic,
      command: "italic",
      title: "Italic (Ctrl+I)",
    },
    {
      icon: Underline,
      command: "underline",
      title: "Underline (Ctrl+U)",
    },
    {
      icon: Heading1,
      command: "formatBlock",
      value: "h1",
      title: "Heading 1",
    },
    {
      icon: Heading2,
      command: "formatBlock",
      value: "h2",
      title: "Heading 2",
    },
    {
      icon: Heading3,
      command: "formatBlock",
      value: "h3",
      title: "Heading 3",
    },
    {
      icon: List,
      command: "insertUnorderedList",
      title: "Bullet List",
    },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      title: "Numbered List",
    },
    {
      icon: Quote,
      html: '<blockquote style="border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1rem 0; font-style: italic;">Quote text here</blockquote>',
      title: "Quote",
    },
    {
      icon: AlignLeft,
      command: "justifyLeft",
      title: "Align Left",
    },
    {
      icon: AlignCenter,
      command: "justifyCenter",
      title: "Align Center",
    },
    {
      icon: AlignRight,
      command: "justifyRight",
      title: "Align Right",
    },
  ];

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      insertHTML(
        `<img src="${url}" alt="Image" style="max-width: 100%; height: auto; margin: 1rem 0;" />`
      );
    }
  };

  const insertCodeBlock = () => {
    insertHTML(
      `<pre style="background-color: #f3f4f6; padding: 1rem; border-radius: 0.375rem; overflow-x: auto; margin: 1rem 0;"><code>// Your code here</code></pre>`
    );
  };

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 flex flex-wrap gap-1">
        <div className="flex gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => {
                if (button.html) {
                  insertHTML(button.html);
                } else {
                  executeCommand(button.command, button.value);
                }
              }}
              title={button.title}
              className="h-8 w-8 p-0"
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={insertLink}
            title="Insert Link"
            className="h-8 w-8 p-0"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertImage}
            title="Insert Image"
            className="h-8 w-8 p-0"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertCodeBlock}
            title="Insert Code Block"
            className="h-8 w-8 p-0"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex gap-1">
          <Button
            variant={isPreview ? "ghost" : "default"}
            size="sm"
            onClick={() => setIsPreview(false)}
            title="Edit Mode"
            className="h-8 px-3"
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant={isPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(true)}
            title="Preview Mode"
            className="h-8 px-3"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {isPreview ? (
          <div
            className="prose prose-lg max-w-none p-4 dark:prose-invert bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            style={{ minHeight: height }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-4 focus:outline-none prose prose-lg max-w-none dark:prose-invert bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            style={{ minHeight: height }}
            onInput={(e) => onChange(e.currentTarget.innerHTML)}
            onKeyDown={handleKeyDown}
            dangerouslySetInnerHTML={{ __html: value }}
            data-placeholder={placeholder}
          />
        )}

        {!isPreview && !value && (
          <div
            className="absolute top-4 left-4 text-gray-400 dark:text-gray-500 pointer-events-none"
            style={{ fontSize: "1.125rem", lineHeight: "1.75rem" }}
          >
            {placeholder}
          </div>
        )}
      </div>

      {/* Footer with helpful tips */}
      <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex flex-wrap gap-4">
          <span>
            💡 Tip: Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline
          </span>
          <span>📝 HTML tags are supported for advanced formatting</span>
        </div>
      </div>
    </Card>
  );
}
