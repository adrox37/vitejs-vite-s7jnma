import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { FieldRenderer } from './FieldRenderer.js';

function isGenericModel(model) {
  const gm = model;
  return isFunction(gm.get) && isFunction(gm.set);
}

function isFunction(fn) {
  return fn && {}.toString.call(fn) === '[object Function]';
}

export function isNumberField(field) {
  const numberTypes = ['decimal', 'double', 'integer', 'long'];
  //@ts-ignore
  return numberTypes.includes(field.templateOptions.type);
}

export function isDateField(field) {
  const dateTypes = ['date', 'timestamp'];
  //@ts-ignore
  return dateTypes.includes(field.templateOptions.type);
}

function isUndefined(value) {
  return typeof value === 'undefined';
}

export class LitFormlyForm extends LitElement {
  // static styles = css`
  //     :host {
  //       input:invalid {
  //         border-color: red;
  //       }
  //     }
  //     input:invalid {
  //       border-color: red;
  //     }
  //     `;

  @property({ type: Array, attribute: false })
  contract = null;

  @property({ type: Object, attribute: false })
  _value = {};

  get value() {
    return this._value;
  }

  set value(val) {
    //reset errors on model change
    this.errors = {};
    const oldValue = this._value;
    this._value = val;
    this.requestUpdate('value', oldValue);
  }

  @property({ type: Object, attribute: false })
  renderer = new FieldRenderer();

  /** error object for all fields indexed by their id */
  errors = {};

  _initialValue = {};

  createRenderRoot() {
    return this; //no shadow root
  }

  render() {
    if (this.contract) {
      return this._formTemplate(this.contract);
    }

    return html``;
  }

  firstUpdated() {
    try {
      this._initialValue = JSON.parse(JSON.stringify(this.value));
    } catch (e) {
      console.warn('Failed to serialize form value');
    }
  }

  _formTemplate(c) {
    //@change="${this.formValueUpdated}"
    //@formchange=${(e:Event)=>console.log(e)}
    //@invalid=${(e:Event)=>console.log(e)}
    //@forminput=${(e:Event)=>console.log(e)}
    return html`
      <form @input=${this.formValueUpdated} @submit="${this._onSubmit}">
        ${this._fieldsetTemplate(c)}
      </form>
    `;
  }

  _fieldsetTemplate(c) {
    console.log('Rendering', c);
    return html`
      <div class="fieldset">
        ${(c || []).map((field) => this._fieldWrapperTemplate(field))}
      </div>
    `;
  }

  _fieldWrapperTemplate(field) {
    const propValue = this._getPropertyValue(field);
    const set = this._createModelValueSetter(field);
    const errorMsg = this.errors[field.key];
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
    return (fieldInput) => {
      let newValue = fieldInput;

      // if (field.valueDecorator && typeof field.valueDecorator.wrap === 'function') {
      //   newValue = field.valueDecorator.wrap(newValue)
      // }
      newValue = this.wrapFieldValue(field, newValue);

      if (this._getModelValue(field.key) !== newValue) {
        console.log(
          `Setting value ${newValue} (old value ${this._getModelValue(
            field.key
          )})`
        );
        this._setModelValue(field.key, newValue);
        //this.validate(this.querySelector(`#${field.key}`) as HTMLInputElement);

        this.requestUpdate();
      }
    };
  }

  _getModelValue(name) {
    if (isGenericModel(this.value)) {
      return this.value.get(name);
    } else {
      return this.value[name];
    }
  }

  _setModelValue(name, value) {
    if (isGenericModel(this.value)) {
      this.value.set(name, value);
    } else {
      this.value[name] = value;
    }
  }

  /**
   * Return value to show on UI
   * @param field
   * @param value
   * @returns
   */
  unwrapFieldValue(field, value) {
    if (isNumberField(field)) {
      return value;
    }

    if (value === null || isUndefined(value)) {
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
    if (isNumberField(field)) {
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
    this.value = this._initialValue;
    await this.requestUpdate();
  }

  submit() {
    this.dispatchEvent(
      new CustomEvent('submit', {
        detail: {
          value: this.value,
        },
      })
    );
  }

  async formValueUpdated(e) {
    const input = e.target;
    if (input.id) {
      console.log('Updated input', input.id);
      const valid = this.validate(input);
    }
  }

  validate(el) {
    const validity = el.validity;
    const valid = validity.valid;
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
    return Object.keys(this.errors).length == 0;
  }

  _onSubmit(e) {
    this.submit();
    e.preventDefault();
    return false;
  }
}
