import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-list/iron-list.js';
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
      <iron-list items="[[items]]" as="item">
        <template>
          <div>
            No : [[item]]
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
      token: String
    };
  }

  handleListSuccess(response) {
    console.log(arguments)
  }

  handleListError() {
    console.log(arguments)
  }
}

window.customElements.define(DakokuUser.is, DakokuUser);
