import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import { FormGroup } from './form-group.js';
import { FormControl } from './form-control.js';
import { FormBuilder } from './form-builder.js';
import { ValidatorsWithEffects as V } from './validation/validators-with-effects.js';
import * as CV from './custom-validators.js';

import { Counter, CounterAccessor } from './counter.js';
// BindConfig
const counterBindConfig = {
  accessor: CounterAccessor,
};

class RadInput extends LitElement {
  static styles = css`

    input[valid], select[valid], textarea[valid] {
      border-color: green !important;
    }
    
    input[invalid], select[invalid], textarea[invalid] {
      border-color: red !important;
    }
    
    input[pending], select[pending], textarea[pending] {
      border-color: orange !important;
    }
    
    input, select, textarea {
      outline: 0;
    }
    
    input[disabled], select[disabled], textarea[disabled] {
      opacity: .3;
    }
    
    input[required] {
      background-image: radial-gradient(black 35%, transparent 35%);
      background-size: 1em 1em;
      background-position: top right;
      background-repeat: no-repeat
    }
    `;

  fb = new FormBuilder(this);

  form = this.fb.group(
    {
      user: this.fb.group(
        {
          name: this.fb.control('Michele', [V.required, V.minLength(2)]),
          surname: this.fb.control('Stieven'),
          gender: this.fb.control('M'),
        },
        {
          asyncValidators: [CV.forbiddenCredentials('mario', 'rossi')],
        }
      ),
      agreement: this.fb.control(false),
      counter: this.fb.control(1),
      phones: this.fb.array([], [CV.allRequired]),
      addresses: this.fb.array(),
    },
    {
      validators: [CV.sameLength('phones', 'addresses')],
    }
  );

  submit(e) {
    e.preventDefault();
    console.log(this.form.value);
  }

  render() {
    const { bind } = this.form;

    return html`
        <h3>Form</h3>
        <form @submit=${this.submit}>
          <input type="text" name="name" ${bind('user.name')} />
          <input type="text" ${bind('user.surname')} />
          <select ${bind('user.gender')}>
            <option value="">-</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
          <input type="checkbox" ${bind('agreement')} />
          <app-counter ${bind('counter', counterBindConfig)}></app-counter>
          <hr />
          Phones:
          ${this.form.get('phones').controls.map(
            (c) => html`
              <br /><input type="text" ${c.bind()} />
            `
          )}
          <br />
          <button type="button" @click=${this.addPhone}>add</button>
          <button type="button" @click=${this.removePhone}>remove</button>
          <hr />
          Addresses:
          ${this.form.get('addresses').controls.map(
            (c) => html`
              <br />
              <input placeholder="street" type="text" ${c.bind('street')} />
              <input placeholder="nr" type="text" ${c.bind('nr')} />
            `
          )}
          <br />
          <button type="button" @click=${this.addAddress}>add</button>
          <button type="button" @click=${this.removeAddress}>remove</button>
  
          <hr />
          <button type="button" @click=${() => this.form.reset()}>reset</button>
          <button type="button" @click=${this.patchForm}>patch</button>
          <button
            type="button"
            @click=${() =>
              this.form.get('user').get('name').setUIState('DISABLED')}
          >
            disable name
          </button>
          <button
            type="button"
            @click=${() =>
              this.form.get('user').get('name').setUIState('ENABLED')}
          >
            enable name
          </button>
          <button>submit</button>
        </form>
        ${this.renderDebugForm()}
      `;
  }

  renderDebugForm(form = this.form) {
    return html`
        <hr />
        Value:
        <pre>${JSON.stringify(form.value, null, 2)}</pre>
        Enabled Value:
        <pre>${JSON.stringify(form.enabledValue, null, 2)}</pre>
        Name dirty: ${form.get('user').get('name').isDirty}<br />
        Name touched: ${form.get('user').get('name').isTouched}<br />
        Name blurred: ${form.get('user').get('name').isBlurred}<br />
        Name UI State: ${form.get('user').get('name').uiState}<br />
        Name status: ${form.get('user').get('name').status}<br />
        Name errors: ${JSON.stringify(
          form.get('user').get('name').errors
        )}<br />
        User status: ${form.get('user').status}<br />
        User errors: ${JSON.stringify(form.get('user').errors)}<br />
        Phones status: ${form.get('phones').status}<br />
        Phones errors: ${JSON.stringify(form.get('phones').errors)}<br />
        Form status: ${form.status}<br />
        Form errors: ${JSON.stringify(form.errors)}<br />
      `;
  }

  addPhone() {
    this.form.get('phones').append(this.fb.control(''));
  }

  removePhone() {
    this.form.get('phones').pop();
  }

  addAddress() {
    this.form.get('addresses').append(
      this.fb.group({
        street: this.fb.control('', [V.required]),
        nr: this.fb.control('', [V.required]),
      })
    );
  }

  removeAddress() {
    this.form.get('addresses').pop();
  }

  patchForm() {
    this.form.patch({
      user: {
        name: 'new name',
        surname: 'new surname',
        gender: 'F',
      },
      agreement: true,
      counter: 3,
    });
  }
}

customElements.define('rad-input', RadInput);
