'use babel';

import RichTextPasterView from './rich-text-paster-view';
import { CompositeDisposable } from 'atom';

export default {

  richTextPasterView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.richTextPasterView = new RichTextPasterView(state.richTextPasterViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.richTextPasterView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rich-text-paster:execute': () => this.execute()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.richTextPasterView.destroy();
  },

  serialize() {
    return {
      richTextPasterViewState: this.richTextPasterView.serialize()
    };
  },

  execute() {
    var editor = atom.workspace.getActiveTextEditor();
    var TurndownService = require('turndown');
    var turndownPluginGfm = require('turndown-plugin-gfm')
    var gfm = turndownPluginGfm.gfm;

    var turndownService = new TurndownService()
    turndownService.use(gfm);

    var text = require('electron').clipboard.readHTML();
    var markdown = turndownService.turndown(text);
    editor.insertText(markdown);
    return true;
  }
};
