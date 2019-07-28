import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-dialog/paper-dialog.js';

import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class DakokuUser extends PolymerElement {
  static get template() {
    return html`
      <iron-ajax
        id="ajax"
        auto
        method="GET"
        url="/api/users"
        content-type="application/json"
        headers$='{"Authorization": "Bearer {{token}}"}'
        last-response="{{items}}"
        on-response="handleListSuccess"
        on-error="handleListError"></iron-ajax>
      <h3>カード一覧</h3>
      <div role="listbox">
        <template is="dom-repeat" items="{{items}}" mutable-data>
          <paper-item>
            <paper-item-body>[[item]]</paper-item-body>
            <paper-icon-item on-click="clickDelete">
              <iron-icon icon="delete"></iron-icon> 
            </paper-icon-item>
          </paper-item>
        </template>
      </div>
      <div>
        <paper-dialog id="dialog">
          <h2>削除確認</h2>
          <p>このカードを削除します。よろしいですか？</p>
          <div>
            <paper-button dialog-dismiss autofocus>いいえ</paper-button>
            <paper-button dialog-confirm>はい</iron-icon></paper-button>
          </div>
        </paper-dialog>
      </div>
      
    `;
  }

  static get is() {
    return 'dakoku-user';
  }

  static get properties() {
    return {
      token: String
    };
  }

  clickDelete(event) {
    this.$.dialog.open();
  }

  handleListSuccess(response) {
    console.log(arguments)
  }

  handleListError() {
    console.log(arguments)
  }
}

window.customElements.define(DakokuUser.is, DakokuUser);
