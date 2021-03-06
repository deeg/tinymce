/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Tools from 'tinymce/core/api/util/Tools';
import { Editor } from '../../../../../../core/main/ts/api/Editor';
import { Toolbar } from '@ephox/bridge';

const toggleFormat = (editor: Editor, fmt: string) => {
  return () => {
    editor.execCommand('mceToggleFormat', false, fmt);
  };
};

const onSetupFormatToggle = (editor: Editor, name: string) => (api: Toolbar.ToolbarToggleButtonInstanceApi) => {
  const handler = (state: boolean) => {
    api.setActive(state);
  };

  if (editor.formatter) {
    api.setActive(editor.formatter.match(name));
    editor.formatter.formatChanged(name, handler);
  } else {
    editor.on('init', () => {
      api.setActive(editor.formatter.match(name));
      editor.formatter.formatChanged(name, handler);
    });
  }

  return () => { };
};

const registerFormatButtons = (editor: Editor) => {
  Tools.each([
    {name: 'bold', text: 'Bold', icon: 'bold'},
    {name: 'italic', text: 'Italic', icon: 'italic'},
    {name: 'underline', text: 'Underline', icon: 'underline'},
    {name: 'strikethrough', text: 'Strikethrough', icon: 'strike-through'},
    {name: 'subscript', text: 'Subscript', icon: 'subscript'},
    {name: 'superscript', text: 'Superscript', icon: 'superscript'}
  ], (btn) => {
    editor.ui.registry.addToggleButton(btn.name, {
      tooltip: btn.text,
      icon: btn.icon,
      onSetup: onSetupFormatToggle(editor, btn.name),
      onAction: toggleFormat(editor, btn.name)
    });
  });
};

const registerCommandButtons = (editor: Editor) => {
  Tools.each([
    {name: 'cut', text: 'Cut', action: 'Cut', icon: 'cut'},
    {name: 'copy', text: 'Copy', action: 'Copy', icon: 'copy'},
    {name: 'paste', text: 'Paste', action: 'Paste', icon: 'paste'},
    {name: 'help', text: 'Help', action: 'mceHelp', icon: 'help'},
    {name: 'selectall', text: 'Select all', action: 'SelectAll', icon: 'select-all'},
    // visualaid was here but also exists in VisualAid.ts?
    {name: 'newdocument', text: 'New document', action: 'mceNewDocument', icon: 'new-document'},
    {name: 'removeformat', text: 'Clear formatting', action: 'RemoveFormat', icon: 'remove-formatting'},
    {name: 'remove', text: 'Remove', action: 'Delete', icon: 'remove'}
  ], (btn) => {
    editor.ui.registry.addButton(btn.name, {
      tooltip: btn.text,
      icon: btn.icon,
      onAction: () => editor.execCommand(btn.action)
    });
  });
};

const registerCommandToggleButtons = (editor: Editor) => {
  Tools.each([
    {name: 'blockquote', text: 'Blockquote', action: 'mceBlockQuote', icon: 'quote'},
  ], (btn) => {
    editor.ui.registry.addToggleButton(btn.name, {
      tooltip: btn.text,
      icon: btn.icon,
      onAction: () => editor.execCommand(btn.action),
      onSetup: onSetupFormatToggle(editor, btn.name)
    });
  });
};

const registerButtons = (editor: Editor) => {
  registerFormatButtons(editor);
  registerCommandButtons(editor);
  registerCommandToggleButtons(editor);
};

const registerMenuItems = (editor: Editor) => {
  Tools.each([
    {name: 'bold', text: 'Bold', action: 'Bold', icon: 'bold', shortcut: 'Meta+B'},
    {name: 'italic', text: 'Italic', action: 'Italic', icon: 'italic', shortcut: 'Meta+I'},
    {name: 'underline', text: 'Underline', action: 'Underline', icon: 'underline', shortcut: 'Meta+U'},
    {name: 'strikethrough', text: 'Strikethrough', action: 'Strikethrough', icon: 'strike-through', shortcut: ''},
    {name: 'subscript', text: 'Subscript', action: 'Subscript', icon: 'subscript', shortcut: ''},
    {name: 'superscript', text: 'Superscript', action: 'Superscript', icon: 'superscript', shortcut: ''},
    {name: 'removeformat', text: 'Clear formatting', action: 'RemoveFormat', icon: 'remove-formatting', shortcut: ''},
    {name: 'newdocument', text: 'New document', action: 'mceNewDocument', icon: 'new-document', shortcut: ''},
    {name: 'cut', text: 'Cut', action: 'Cut', icon: 'cut', shortcut: 'Meta+X'},
    {name: 'copy', text: 'Copy', action: 'Copy', icon: 'copy', shortcut: 'Meta+C'},
    {name: 'paste', text: 'Paste', action: 'Paste', icon: 'paste', shortcut: 'Meta+V'},
    {name: 'selectall', text: 'Select all', action: 'SelectAll', icon: 'select-all', shortcut: 'Meta+A'}
  ], (btn) => {
    editor.ui.registry.addMenuItem(btn.name, {
      text: btn.text,
      icon: btn.icon,
      shortcut: btn.shortcut,
      onAction: () => editor.execCommand(btn.action)
    });
  });

  editor.ui.registry.addMenuItem('codeformat', {
    text: 'Code',
    icon: 'sourcecode',
    onAction: toggleFormat(editor, 'code')
  });
};

const register = (editor: Editor) => {
  registerButtons(editor);
  registerMenuItems(editor);
};

export default {
  register
};