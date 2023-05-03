import { LitElement, html, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export class TInput extends LitElement {
  static get formAssociated() {
    return true;
  }

  static get properties() {
    return {
      disabled: { type: Boolean, reflect: true },
      error: { type: Boolean, reflect: true },
      id: { type: String },
      maxLength: { type: Number },
      minLength: { type: Number },
      label: { type: String },
      name: { type: String },
      pattern: { type: String, reflect: true },
      placeholder: { type: String },
      readonly: { type: Boolean },
      required: { type: Boolean, reflect: true },
      type: { type: String },
      validateOnInput: { type: Boolean },
      value: { type: String },
      messaging: { type: Object },
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this.error = false;
    this.id = this.name;
    this.label = '';
    this.maxLength = undefined;
    this.minLength = undefined;
    this.name = '';
    this.placeholder = '';
    this.type = 'text';
    this.types = ['text', 'email', 'number', 'tel', 'date'];
    this.required = false;
    this.value = '';
    this.messaging = {};

    this.internals = this.attachInternals();
  }

  firstUpdated(...args) {
    super.firstUpdated(...args);
    this.inputElement = this.renderRoot.querySelector('input');
    /** This ensures our element always participates in the form */
    this.internals.setFormValue(this.value);

    /** Make sure validations are set up */
    this._manageRequired();
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) {
      // dispatchCustomEvent(this, 'input', this.value);

      if (this.value !== this.inputElement.value) {
        if (this.value) {
          this.inputElement.value = this.value;
        } else {
          this.inputElement.value = '';
        }

        // this.validate();
        // this.notifyValueChanged();
      }
      // this.autoFormatHandling()
    }

    if (changedProperties.has('error')) {
      if (!this.error) {
        this.setCustomValidity = undefined;
        this.validity = undefined;
        this.removeAttribute('validity');
      }

      //this.validate();
    }

    if (changedProperties.has('validity')) {
      this.notifyValidityChange();
    }
  }

  render() {
    const lblClasses = {
      required: this.required,
    };

    const inputClasses = {
      required: this.required,
    };
    console.log('this.pattern', this.pattern);
    return html`
      ${
        this.label
          ? html`<label class="${classMap(lblClasses)}" for="${
              this.id
            }" part="label">${this.label}</label>`
          : ''
      }
      <input
        ?aria-invalid="${this.error}"
        ?disabled="${this.disabled}"
        ?readonly="${this.readonly}"
        ?required="${ifDefined(this.required ? 'true' : undefined)}"
        .value="${this.value}"
        @blur="${this.handleBlur}"
        @input="${this.onInput}"
        class="${classMap(inputClasses)}"
        id="${this.id}"
        maxlength="${ifDefined(this.maxLength ? this.maxLength : undefined)}"
        minlength="${ifDefined(this.minLength ? this.minLength : undefined)}"
        name="${ifDefined(this.name)}"
        pattern="${ifDefined(this.pattern)}"
        placeholder="${ifDefined(this.placeholder)}"
        type="${this._inputType(this.type)}"
        part="input"
      >
      <span>${this.internals.validationMessage}</span>
    `;
  }

  onInput() {
    this.value = this.inputElement.value;
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

  handleBlur() {
    this.inputElement.scrollLeft = 100;

    // this.validate()
  }

  _inputType(type) {
    if (this.types.includes(type)) {
      return type;
    }
    return 'text';
  }
}

if (!window.customElements.get('t-input')) {
  window.customElements.define('t-input', TInput);
}
