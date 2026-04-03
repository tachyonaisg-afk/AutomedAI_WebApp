import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styled from "styled-components";
import { useEffect } from "react";

// ===== STYLED COMPONENTS (MATCH YOUR UI) =====

const EditorWrapper = styled.div`
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  transition: all 0.2s;

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    border-color: #2563eb;
    background: #ffffff;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 6px;
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 0.5rem 0.5rem 0 0;
`;

const ToolButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${({ active }) => (active ? "#2563eb" : "#f1f5f9")};
  color: ${({ active }) => (active ? "#fff" : "#334155")};
  font-size: 13px;
  font-weight: 500;

  &:hover {
    background: ${({ active }) => (active ? "#1d4ed8" : "#e2e8f0")};
  }
`;

const StyledEditorContent = styled(EditorContent)`
  padding: 2px 12px;
  min-height: 40px;
  font-size: 16px;
  color: #0f172a;
  outline: none;        /* ✅ FIX */
  border: none;         /* ✅ FIX */

  p {
    margin: 0 0 2px;
  }

  ul, ol {
    padding-left: 18px;
    margin: 6px 0;
  }

  h1, h2, h3 {
    margin: 6px 0;
    font-weight: 600;
  }

  /* remove internal focus ring */
  &:focus {
    outline: none;
  }

  /* important: remove ProseMirror default border */
  .ProseMirror {
    outline: none !important;
  }
`;

// ===== COMPONENT =====

const WorksheetEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // ✅ HTML output
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();
    const incomingHTML = value || "";

    if (currentHTML !== incomingHTML) {
      editor.commands.setContent(incomingHTML, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <EditorWrapper>
      {/* ===== TOOLBAR ===== */}
      <Toolbar>
        <ToolButton
          type="button"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolButton>

        <ToolButton
          type="button"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolButton>

        <ToolButton
          type="button"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolButton>

        <ToolButton
          type="button"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolButton>

        <ToolButton
          type="button"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolButton>

        <ToolButton
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Clear
        </ToolButton>
      </Toolbar>

      {/* ===== EDITOR ===== */}
      <StyledEditorContent editor={editor} />
    </EditorWrapper>
  );
};

export default WorksheetEditor;