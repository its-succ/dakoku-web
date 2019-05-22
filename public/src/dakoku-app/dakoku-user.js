import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-list/iron-list.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class DakokuUser extends PolymerElement {
  static get template() {
    return html`
      <custom-style>
        <style>
        <!-- TODO Style必要か確認する -->
        </style>
      </custom-style>
      <!--  TODO iron-ajax でAPI呼ぶ -->
      <h3>カード一覧</h3>
      <!-- TODO APIで取得した結果を反映する -->
      <iron-list items="[[items]]">
        <template>
          <div>
            CardNo: [[item]]
          </div>
        </template>
      </iron-list>
    `;
  }

  static get is() {
    return 'dakoku-user';
  }

  static get properties() {
    return {
      items: {
        type: Array,
        value: function() {
          return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        }
      },
      token: String,
    };
  }

  handleRegisterSuccess() {
    console.log(arguments)
  }

  handleRegisterError() {
    console.log(arguments)
  }
}

window.customElements.define(DakokuUser.is, DakokuUser);
