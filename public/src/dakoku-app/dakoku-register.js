import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class DakokuRegister extends PolymerElement {
  static get template() {
    return html`
    <iron-ajax id="ajax" method="POST" url="/api/register" content-type="application/json" body="[[registerData]]" on-response="handleRegisterSuccess" on-error="handleRegisterError"></iron-ajax>
    <h3>社員証登録</h3>
    <paper-input label="社員証のNFCコード" value="{{cardNumber::input}}"></paper-input>
    <paper-input label="TeamSpritのパスワード" type="password" value="{{password::input}}"></paper-input>
    <paper-button raised="" class="indigo" on-click="register">登録</paper-button>
`;
  }

  static get is() {
    return 'dakoku-register';
  }

  static get properties() {
    return {
      cardNumber: String,
      password: String,
      registerData: {
        type: Object,
        computed: 'computeRegisterData(cardNumber, password)'
      }
    };
  }

  register() {
    this.$.ajax.generateRequest();
  }

  computeRegisterData(cardNumber, password) {
    return {
      cardNumber: cardNumber,
      password: password
    }
  }

  handleRegisterSuccess() {
    console.log(arguments)
  }

  handleRegisterError() {
    console.log(arguments)
  }
}

window.customElements.define(DakokuRegister.is, DakokuRegister);
