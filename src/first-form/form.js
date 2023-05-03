import { LitElement, html } from 'lit';
import { FieldRenderer } from './field-renderer.js';

import './t-input.js';

export class TForm extends LitElement {
  static properties = {
    contract: { type: Array, attribute: false },
    _value: { type: Object, attribute: false },
    renderer: { type: Object, attribute: false },
  };

  constructor() {
    super();
    this.contract = null;
    this.renderer = new FieldRenderer();
    this.errors = {};
    this._initialValue = {};
    this._value = {};
  }

  get value() {
    console.log('2 get val', this._value);
    return this._value;
  }

  set value(val) {
    console.log('1 set val', val);
    //reset errors on model change
    this.errors = {};
    const oldValue = this._value;
    this._value = val;
    this.requestUpdate('value', oldValue);
  }

  // createRenderRoot() {
  //   console.log('createRenderRoot');
  //   return this; //no shadow root
  // }

  render() {
    console.log('4 render...');
    if (this.contract) {
      return this._formTemplate(this.contract);
    }

    return html``;
  }

  firstUpdated() {
    console.log('first updated...');
    try {
      this._initialValue = JSON.parse(JSON.stringify(this.value));
    } catch (e) {
      console.warn('Failed to serialize form value');
    }
  }

  _formTemplate(c) {
    console.log('5 formTemplate');
    return html`
      <form @input=${this.formValueUpdated} @submit="${this._onSubmit}">
        ${this._fieldsetTemplate(c)}
        <button>Submit</button>
      </form>
    `;
  }

  _fieldsetTemplate(c) {
    console.log('6 fieldSetTemplate');
    return html`
      <div class="fieldset">
        ${(c || []).map((field) => this._fieldWrapperTemplate(field))}
      </div>
    `;
  }

  _fieldWrapperTemplate(field) {
    console.log('7 _fieldWrapperTemplate', field);
    const propValue = this._getPropertyValue(field);
    const set = this._createModelValueSetter(field);
    const errorMsg = this.errors[field.key];
    console.log('errorMsg', errorMsg);
    return this.renderer.renderField(
      field,
      propValue,
      set,
      errorMsg,
      this.value
    );
  }

  /**
   * Writes value back to model
   * @param field
   */
  _createModelValueSetter(field) {
    console.log('_createModelValueSetter', field);
    return (fieldInput) => {
      console.log('fieldInput:', fieldInput);
      let newValue = fieldInput;

      // if (field.valueDecorator && typeof field.valueDecorator.wrap === 'function') {
      //   newValue = field.valueDecorator.wrap(newValue)
      // }
      newValue = this.wrapFieldValue(field, newValue);
      console.log('newValue', newValue);
      if (this._getModelValue(field.key) !== newValue) {
        console.log(
          `Setting value ${newValue} (old value ${this._getModelValue(
            field.key
          )})`
        );
        this._setModelValue(field.key, newValue);

        this.requestUpdate();
      }
    };
  }

  _getModelValue(name) {
    console.log('9 _getModelValue', name);
    if (this.renderer.isGenericModel(this.value)) {
      console.log('get isGenericModel', this.value.get(name));
      return this.value.get(name);
    } else {
      console.log('get else', this.value[name]);
      return this.value[name];
    }
  }

  _setModelValue(name, value) {
    console.log('_setModelValue', name, value);
    if (this.renderer.isGenericModel(this.value)) {
      console.log('set isGenericModel', this.value.set(name, value));
      return this.value.set(name, value);
    } else {
      console.log('set else', value);
      return (this.value[name] = value);
    }
  }

  /**
   * Return value to show on UI
   * @param field
   * @param value
   * @returns
   */
  unwrapFieldValue(field, value) {
    console.log('unwrapFieldValue', field, value);
    if (this.renderer.isNumberField(field)) {
      return value;
    }

    if (value === null || this.renderer.isUndefined(value)) {
      return '';
    }
    return value;
  }

  /**
   * Return value to write on model
   * @param field
   * @param value
   * @returns
   */
  wrapFieldValue(field, value) {
    console.log('wrap FV', field, value);
    if (this.renderer.isNumberField(field)) {
      if (isUndefined(value)) {
        return null;
      }
      //from empty <input type="number"> field
      if (value === null) {
        return null;
      }
      if (value === '') {
        //from empty option <option></option>
        return null;
      }
      return Number(value);
    }
    return value;
  }

  _getPropertyValue(field) {
    console.log('8 get prop', field);
    let value = this._getModelValue(field.key);

    value = this.unwrapFieldValue(field, value);

    //TODO
    // if (value && field.valueDecorator && typeof field.valueDecorator.unwrap === 'function') {
    //   value = field.valueDecorator.unwrap(value)
    // }

    return value;
  }

  /**
   * Reset to initial value
   */
  async reset() {
    console.log('reset');
    this.value = this._initialValue;
    await this.requestUpdate();
  }

  submit() {
    console.log('submit');
    this.dispatchEvent(
      new CustomEvent('submit', {
        detail: {
          value: this.value,
        },
      })
    );
  }

  async formValueUpdated(e) {
    console.log('formValueUpdated', e);
    const input = e.target;
    if (input.id) {
      console.log('form val Updated input', input.id);
      const valid = this.validate(input);
    }
  }

  validate(el) {
    console.log('validate', el);
    const validity = el.validity;
    console.log('validity', validity);
    const valid = validity.valid;
    console.log('valid', valid);
    if (valid) {
      //clear previous error (if any)
      if (this.errors[el.id]) {
        delete this.errors[el.id];
      }
    } else {
      console.log(`Field ${el.id} invalid`, validity);
      const errorMsg = this.getErrorMessage(validity);
      this.errors[el.id] = errorMsg;
      //el.setCustomValidity('Pattern mismatch!');
    }

    this.dispatchEvent(
      new CustomEvent('formvalidation', {
        detail: { errors: this.errors },
        bubbles: true,
        composed: true,
      })
    );
    this.requestUpdate();

    return valid;
  }

  getErrorMessage(validity) {
    console.log('getErrorMsg', validity);
    if (validity.patternMismatch) {
      return 'Pattern mismatch!';
    } else if (validity.valueMissing) {
      return 'Value missing!';
    } else if (validity.badInput) {
      return 'Bad input!';
    } else if (validity.rangeOverflow) {
      return 'Range overflow!';
    } else if (validity.rangeUnderflow) {
      return 'Range underflow!';
    } else if (validity.stepMismatch) {
      return 'Step mismatch!';
    } else if (validity.tooLong) {
      return 'Too long!';
    } else if (validity.tooShort) {
      return 'Too short!';
    } else if (validity.typeMismatch) {
      return 'Type mismatch!';
    } else {
      return 'Validation error!';
    }
  }

  isValid() {
    console.log('isValid');
    return Object.keys(this.errors).length == 0;
  }

  _onSubmit(e) {
    console.log('_onSubmit');
    this.submit();
    e.preventDefault();
    return false;
  }
}

customElements.define('t-form', TForm);
