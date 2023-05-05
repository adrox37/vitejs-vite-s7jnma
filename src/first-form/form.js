import { LitElement, html } from 'lit';
import { FieldRenderer } from './field-renderer.js';

import './fieldset.js';

export class TForm extends LitElement {
  static properties = {
    config: { type: Array, attribute: false },
    _value: { type: Object, attribute: false },
    renderer: { type: Object, attribute: false },
  };

  constructor() {
    super();
    this.config = null;
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
    this.errors = {};
    const oldValue = this._value;
    this._value = val;
    this.requestUpdate('value', oldValue);
  }

  render() {
    console.log('4 render...');
    if (this.config) {
      return this._formTemplate(this.config);
    }

    return html``;
  }

  firstUpdated() {
    console.log('firstUpdated');
    try {
      this._initialValue = JSON.parse(JSON.stringify(this.value));
    } catch (e) {
      console.error(e);
    }
  }

  _formTemplate(config) {
    console.log('5 formTemplate');
    // @change="${this.formValueUpdated}"
    // @formchange=${(e:Event)=>console.log(e)}
    // @invalid=${(e:Event)=>console.log(e)}
    // @forminput=${(e:Event)=>console.log(e)}
    return html`
      <form @input=${this._formValueUpdated} @submit="${this._onSubmit}">
        ${config.map(
          (s) => html`
          ${this._renderSections(s.section)}
        `
        )}
      </form>
    `;

    // return html`
    //   <form @input=${this._formValueUpdated} @submit="${this._onSubmit}">
    //    <input type="text" name="test" required>
    //     <button>Submit</button>
    //   </form>
    // `
  }

  _renderSections(section) {
    console.log('6 renderSections', section);
    const hasFieldset = !!(
      section.legend || Object.keys(section.attrs).length > 0
    );
    const hasSlot = !!(section.attrs && section.attrs.type);

    return html`
      ${
        hasFieldset
          ? html`
          <t-fieldset form="aFormName" legend="${section.legend}" name="${
              stringToCamelCase(section?.legend) || 'fieldset'
            }">
            ${
              hasSlot
                ? html`<legend slot="legend-control">${this._renderControlLegend(
                    section.attrs
                  )}</legend>`
                : ''
            }
            ${this._renderFields(section?.fields)}
          </t-fieldset>`
          : this._renderFields(section?.fields)
      }
    `;
  }

  _renderFields(fields) {
    console.log('6a renderFields', fields);
    return fields.map((f) => this._fieldWrapperTemplate(f));
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
  _renderControlLegend(field) {
    console.log('6b renderControlLegend', field);
    return this.renderer.renderControlLegend(
      field,
      this._getPropertyValue(field),
      this._createModelValueSetter(field),
      this.value
    );
  }

  _createModelValueSetter(field) {
    console.log('_createModelValueSetter', field);
    return (fieldInput) => {
      console.log('fieldInput', fieldInput);
      let newValue = fieldInput;
      newValue = this._wrapFieldValue(field, newValue);
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
  _unwrapFieldValue(field, value) {
    console.log('unwrapFieldValue', field, value);
    if (this.renderer.isNumberField(field)) {
      return value;
    }

    if (value === null || this.renderer.isUndefined(value)) {
      return '';
    }
    return value;
  }

  _wrapFieldValue(field, value) {
    console.log('wrap FV', field, value);
    if (this.renderer.isNumberField(field)) {
      if (this.renderer.isUndefined(value)) {
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
    value = this._unwrapFieldValue(field, value);

    // TODO
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
    console.log(this);
    dispatchCustomEvent(this, 'submit', this.value);
  }

  async _formValueUpdated(e) {
    console.log('formValueUpdated', e);
    const input = e.target;
    if (input.id) {
      console.log('form val Updated input', input.id);
      const valid = this._validate(input);
    }
  }

  _validate(el) {
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
      const errorMsg = this._getErrorMessage(validity);
      this.errors[el.id] = errorMsg;
      //el.setCustomValidity('Pattern mismatch!');
    }

    dispatchCustomEvent(this, 'validate', this.value);
    this.requestUpdate();

    return valid;
  }

  _getErrorMessage(validity) {
    console.log('getErrorMessage', validity);
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
