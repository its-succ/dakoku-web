import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class DakokuRegister extends PolymerElement {
  static get template() {
    return html`
      <custom-style>
        <style>
          paper-button.indigo {
            background-color: var(--paper-indigo-500);
            color: white;
            --paper-button-raised-keyboard-focus: {
              background-color: var(--paper-pink-a200) !important;
              color: white !important;
            };
          }
          paper-button:hover {
            background-color: var(--paper-indigo-100);
          }
          paper-button[disabled] {
            color: white;
            background-color: var(--paper-indigo-50);
          }
        </style>
      </custom-style>
      <iron-ajax
        id="ajax"
        method="POST"
        url="/api/users"
        content-type="application/json"
        body="[[registerData]]"
        on-response="handleRegisterSuccess"
        on-error="handleRegisterError"></iron-ajax>
      <h3>カード登録</h3>
<paper-input id="cardnumber" label="NFC ID" placeholder="社員証やSUICAなどのカードIDを16桁の16進数で入力してください" value="{{cardNumber::input}}" required allowed-pattern="[0-9a-fA-F]" maxlength="16" error-message="社員証やSUICAなどのカードIDを16桁の16進数で入力してください"></paper-input>
      <paper-input id="password" label="TeamSpritのパスワード" placeholder="TeamSpritのパスワードを入力してください" type="password" value="{{password::input}}" required auto-validate error-message="必須入力です"></paper-input>
      <br><br>
      <paper-button id="button" raised active disabled class="indigo" on-click="register">登録</paper-button>
    `;
  }

  static get is() {
    return 'dakoku-register';
  }

  static get properties() {
    return {
      cardNumber: {
        type: String,
        observer: '_cardNumberChanged'
      },
      password: String,
      registerData: {
        type: Object,
        computed: 'computeRegisterData(cardNumber, password)'
      },
      token: String,
    };
  }

  static get observers() {
    return [
      '_validate(cardNumber, password)'
    ]
  }

  register() {
    this.$.ajax.headers = {
      Authorization: 'Bearer ' + this.token
    };
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

  _cardNumberChanged(value) {
    this.$.cardnumber.invalid = value.length !== 16;
  }

  _validate() {
    this.$.button.disabled = !this.cardNumber
        || !this.password
        || this.$.cardnumber.invalid
        || this.$.password.invalid;
  }
}

window.customElements.define(DakokuRegister.is, DakokuRegister);
