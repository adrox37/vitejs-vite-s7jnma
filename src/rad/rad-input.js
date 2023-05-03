import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';

class RadInput extends LitElement {
  static get formAssociated() {
    return true;
  }

  static get properties() {
    return {
      name: { type: String, reflect: true },
      required: { type: Boolean, reflect: true },
      value: { type: String },
    };
  }

  static get styles() {
    return css`
    :host {
      display: block;
      font-family: system-ui;;
      margin: 0 0 16px;
    }
    label {
      color: #141414;
      display: block;
      font-size: 14px;
      margin-bottom: 8px;
    }
    input {
      border: 1px solid hsl(250, 100%, 25%);
      border-radius: 8px;
      color: #141414;
      font-size: 16px;
      padding: 8px;
    }
    `;
  }

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.name = name;
    this.required = false;
    this.value = '';

    /** Placeholder for required */
    this._required = false;
  }

  render() {
    return html`
      <label for="input"><slot></slot></label>
      <input type="${this.type}" name="${this.name}" id="input" .value="${this.value}" ?required="${this.required}" @input="${this._onInput}" novalidate>
      <span>${this.internals.validationMessage}</span>
    `;
  }

  _onInput(event) {
    this.value = event.target.value;
    this.internals.setFormValue(this.value);
    this._manageRequired();
  }

  _manageRequired() {
    const { value } = this;
    const input = this.shadowRoot.querySelector('input');
    console.log({ value, required: this.required });
    if (value === '' && this.required) {
      this.internals.setValidity(
        {
          valueMissing: true,
        },
        'This field is required',
        input
      );
    } else {
      this.internals.setValidity({});
    }
  }

  /** LitElement lifecycle method */
  firstUpdated(...args) {
    super.firstUpdated(...args);
    /** This ensures our element always participates in the form */
    this.internals.setFormValue(this.value);

    /** Make sure validations are set up */
    this._manageRequired();
  }

  get required() {
    return this._required;
  }

  set required(isRequired) {
    console.log({ isRequired });
    this._required = isRequired;
    this.internals.ariaRequired = isRequired;
  }
}

customElements.define('rad-input', RadInput);

/** Get a reference to the form */
const form = document.querySelector('form');

/** Get the output element to display form data in */
const output = document.querySelector('output');

/** Prevent default on form submissions */
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const form = event.target;
  console.log('Rad input:', form.radInput);

  /** Get all of the form data */
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => (data[key] = value));
  output.innerHTML = JSON.stringify(data, null, 2);
  console.log('rad value: ', document.querySelector('[name="radInput"]').value);
});
