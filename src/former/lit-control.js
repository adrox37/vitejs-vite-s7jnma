import { LitElement, html } from 'lit';
import { live } from 'lit/directives/live.js';
import { FormControlMixin } from './src/FormControlMixin.js';
import { requiredValidator, programmaticValidator } from './src/validators';

import './c-input.js';

export class LitControl extends FormControlMixin(LitElement) {
  static properties = {
    error: { type: String, reflect: true },
    required: { type: Boolean, reflect: true },
    _value: { type: String },
  };

  static get formControlValidators() {
    return [requiredValidator, programmaticValidator];
  }

  constructor() {
    super();

    this.error = '';
    this.required = false;
  }

  firstUpdated() {
    this.validationTarget = this.renderRoot.querySelector('input');
    console.log(this.validationTarget, 'a');
  }

  render() {
    return html`
      <c-input 
        label="Test Input"
        required
       
        >
        </c-input>
    `;
  }

  validityCallback(key) {
    if (key === 'valueMissing') {
      return 'You must include a value for all instances of lit-control';
    }
  }

  #onInput = ({ target }) => {
    this.value = target.value;
    console.log('this.value', this.value);
  };
}

customElements.define('lit-control', LitControl);

const form = document.getElementById('form');
const litControl = document.querySelector('lit-control');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  console.log({
    litControl: data.get('lit-control'),
  });
});

litControl.addEventListener('input', (event) => {
  if (event.target.value === 'fooo') {
    event.target.error = 'That is a silly response';
  }
});
