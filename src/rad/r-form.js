import { LitElement, html, css } from 'lit-element';
import './rad-input.js';

class RForm extends LitElement {
  static get formAssociated() {
    return true;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin-bottom: 16px;
      }
      fieldset {
        border-color: var(--primary-color);
      }
      legend {
        color: var(--primary-color);
        font-family: system-ui;
        font-size: 24px;
        margin-bottom: 12px;
      }
    `;
  }

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  async firstUpdated(...args) {
    await super.firstUpdated(...args);
    this._setValue();
  }

  render() {
    return html`
      <form>
        <fieldset>
          <legend>Address</legend>
          <rad-input @input="${this._setValue}" name="line-1">Line one</rad-input>
          <rad-input @input="${this._setValue}" name="line-2">Line two</rad-input>
          <rad-input @input="${this._setValue}" name="city">City</rad-input>
          <rad-input @input="${this._setValue}" name="state">State</rad-input>
        </fieldset>
      </form>
    `;
  }

  _setValue() {
    const form = this.shadowRoot.querySelector('form');
    const formData = new FormData(form);
    this.internals.setFormValue(formData);
    console.log(form, formData.get('line-1'));
  }
}
customElements.define('r-form', RForm);
