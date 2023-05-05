import { LitElement, html, css } from 'lit';
import { FormControlMixin } from './src/FormControlMixin.js';
import {
  maxLengthValidator,
  minLengthValidator,
  patternValidator,
  programmaticValidator,
  requiredValidator,
} from './src/validators.js';
import { submit } from './src/utils';
import { live } from 'lit/directives/live.js';

export class ComplexFormControl extends FormControlMixin(LitElement) {
  static get formControlValidators() {
    return [
      requiredValidator,
      programmaticValidator,
      maxLengthValidator,
      minLengthValidator,
      patternValidator,
    ];
  }

  static get properties() {
    return {
      required: { type: Boolean, reflect: true },
      minLength: { type: Number, attribute: 'minlength' },
      maxLength: { type: Number, attribute: 'maxlength' },
      pattern: { type: String, reflect: true },
      validationMessage: { type: String, reflect: false },
    };
  }

  constructor() {
    super();
    this.required = false;
    this.minLength = null;
    this.maxLength = null;
    this.pattern = null;
    this.validationMessage = '';
    this.value = '';

    this.addEventListener('keydown', this.onKeydown);
    this.addEventListener('invalid', this.onInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.onKeydown);
    this.removeEventListener('invalid', this.onInvalid);
  }

  onInvalid = (event) => {
    event.preventDefault();
    this.validationTarget.focus();
  };

  onKeydown = (event) => {
    if (event.code === 'Enter') {
      if (this.form) {
        submit(this.form);
      }
    }
  };

  validationMessageCallback(message) {
    this.validationMessage = message;
  }

  updated(changed) {
    if (changed.has('value')) {
      this.setValue(this.value);
    }
  }
}

customElements.define('complex-form-control', ComplexFormControl);

export class ComplexDemo extends ComplexFormControl {
  render() {
    return html`
      <label for="control"><slot></slot></label>
      <input
        aria-describedby="hint"
        id="control"
        .minLength="${live(this.minLength)}"
        ?required="${this.required}"
        .value="${live(this.value)}"
        @input="${this.onInput}"
      />
     
    `;
  }

  firstUpdated() {
    this.validationTarget = this.renderRoot.querySelector('input');
  }

  onInput({ target }) {
    this.value = target.value;
  }

  updated(changed) {
    if (changed.has('value')) {
      this.setValue(this.value);
    }
  }
}

customElements.define('complex-demo', ComplexDemo);
