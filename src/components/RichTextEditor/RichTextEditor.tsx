import { Editor } from '@tinymce/tinymce-react';
import React from 'react';
import { debounce } from 'core/helpers/debounce';
import './RichTextEditor.scss';

export interface TextEditorProps {
  value?: string;

  className?: string;

  editorConfig?: Record<string, any>;

  onChange?(value: string): void;

  id?: string;
}

function TextEditor(props: TextEditorProps) {
  const { value, onChange, editorConfig } = props;

  const handleChange = React.useCallback(
    debounce((...[content]: any) => {
      if (typeof onChange === 'function') {
        onChange(content);
      }
    }),
    [onChange],
  );

  return (
    <Editor
      apiKey="btweto7oo1j5i28zy9dgdruzdq11o6j2udeg394im1uygruk"
      value={value}
      onEditorChange={handleChange}
      plugins="wordcount"
      init={editorConfig}
    />
  );
}

export default TextEditor;
