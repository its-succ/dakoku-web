import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-item/paper-item.js';
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
          <paper-item>[[item]]</paper-item>
        </template>
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

  handleListSuccess(response) {
    console.log(arguments)
  }

  handleListError() {
    console.log(arguments)
  }
}

window.customElements.define(DakokuUser.is, DakokuUser);
