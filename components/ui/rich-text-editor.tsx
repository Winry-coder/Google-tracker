'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          'h-8 w-8 p-0',
          editor.isActive('bold') && 'bg-slate-200 text-slate-900'
        )}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          'h-8 w-8 p-0',
          editor.isActive('italic') && 'bg-slate-200 text-slate-900'
        )}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          'h-8 w-8 p-0',
          editor.isActive('underline') && 'bg-slate-200 text-slate-900'
        )}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <div className="mx-1 my-auto h-4 w-px bg-slate-300" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          'h-8 w-8 p-0',
          editor.isActive('bulletList') && 'bg-slate-200 text-slate-900'
        )}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          'h-8 w-8 p-0',
          editor.isActive('orderedList') && 'bg-slate-200 text-slate-900'
        )}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          'h-8 w-8 p-0',
          editor.isActive('blockquote') && 'bg-slate-200 text-slate-900'
        )}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <div className="mx-1 my-auto h-4 w-px bg-slate-300" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={setLink}
        className={cn(
          'h-8 w-8 p-0',
          editor.isActive('link') && 'bg-slate-200 text-slate-900'
        )}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className="h-8 w-8 p-0"
      >
        <UnlinkIcon className="h-4 w-4" />
      </Button>
      <div className="ml-auto flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export function RichTextEditor({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none p-4 focus:outline-none min-h-[150px]',
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
