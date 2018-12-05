import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/google-signin/google-signin.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/google-signin/google-signin-aware.js';
import './dakoku-register.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 */
class DakokuApp extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }
    </style>
    <google-signin-aware id="signInAware" scopes="profile" hosted-domain="esm.co.jp" is-authorized="{{isAuthorized}}" initialized="{{initialized}}" signed-in="{{signedIn}}" on-google-signin-aware-success="handleSignin" on-google-signin-offline-success="handleOffline"></google-signin-aware>

    <google-signin brand="google" height="standard" client-id="512704348312-hhq0htjk798tahele7tf32n2ckc4supa.apps.googleusercontent.com"></google-signin>

    <iron-ajax id="ajax" method="POST" url="/auth" content-type="application/x-www-form-urlencoded" body="[[tokenObject]]" on-response="handleAuthSuccess" on-error="handleAuthError"></iron-ajax>

    <template is="dom-if" if="{{isAuthorized}}">
      <h2>打刻アプリにようこそ [[email]]!</h2>
      <dakoku-register></dakoku-register>
    </template>
`;
  }

  static get is() { return 'dakoku-app'; }
  static get properties() {
    return {
      email: {
        type: String,
        value: 'dakoku-app'
      },
      tokenObject: {
        type: Object,
        computed: 'computeTokenObject(idToken)'
      }
    };
  }

  handleSignin(response) {
    const user = gapi.auth2.getAuthInstance()['currentUser'].get();
    const basicProfile = user.getBasicProfile();
    this.email = basicProfile.getEmail();
    this.idToken = user.getAuthResponse().id_token;
    this.$.ajax.generateRequest();
  }

  handleOffline(response) {
    console.log('Offline code received: ' + response.detail.code);
  }

  handleAuthSuccess() {
    console.log(arguments)
  }

  handleAuthError() {
    console.log(arguments)
  }

  computeTokenObject(idToken) {
    return {idToken};
  }
}

window.customElements.define(DakokuApp.is, DakokuApp);
