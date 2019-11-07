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
      <style>
        .buttons {
          position: relative;
        }
      </style>
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
      <iron-ajax
        id="deleteCard"
        method="DELETE"
        url="/api/users/{{targetCardNumber}}"
        headers$='{"Authorization": "Bearer {{token}}"}'
        on-response="handleDeleteSuccess"
        on-error="handleDeleteError">
      </iron-ajax>

      <h3>カード一覧</h3>
      <div role="listbox">
        <template is="dom-repeat" items="{{items}}" mutable-data>
          <paper-item>
            <paper-item-body>[[item]]</paper-item-body>
            <paper-icon-item on-click="confirmDelete">
              <iron-icon icon="delete"></iron-icon> 
            </paper-icon-item>
          </paper-item>
        </template>
        
        <paper-dialog id="dialog">
            <h2>削除確認</h2>
            <p>{{targetCardNumber}}</p>
            <p>上記のカードを削除します。よろしいですか？</p>
            <div class="buttons">
              <paper-button dialog-dismiss autofocus>いいえ</paper-button>
              <paper-button dialog-confirm on-click="deleteCard">はい</paper-button>
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
      token: String,
      targetCardNumber: {
        type: String
      }
    };
  }

  confirmDelete(event) {
    this.targetCardNumber = event.model.item;
    this.$.dialog.open();
  }

  deleteCard(item) {
    console.log('deleteCard')
    this.$.deleteCard.generateRequest();
  }

  handleListSuccess(response) {
    console.log(arguments)
  }

  handleListError() {
    console.log(arguments)
  }

  handleDeleteSuccess(response) {
    const index = this.items.indexOf(this.targetCardNumber);
    this.splice('items', index, 1);

    console.log(arguments)
  }

  handleDeleteError() {
    console.log(arguments)
  }
}

window.customElements.define(DakokuUser.is, DakokuUser);
