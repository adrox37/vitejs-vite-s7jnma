import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './t-input.js';
import './button.js';

export class FieldRenderer {
  isGenericModel(model) {
    const gm = model;
    return this.isFunction(gm.get) && this.isFunction(gm.set);
  }

  isFunction(fn) {
    return fn && {}.toString.call(fn) === '[object Function]';
  }

  isNumberField(field) {
    const numberTypes = ['decimal', 'double', 'integer', 'long'];
    return numberTypes.includes(field.type);
  }

  isDateField(field) {
    const dateTypes = ['date', 'timestamp'];
    return dateTypes.includes(field.type);
  }

  isUndefined(value) {
    return typeof value === 'undefined';
  }

  renderField(field, value, set, errorMsg = null, model) {
    const fieldTemplate = this.getFieldTemplate(field, value, set, model);
    console.log(field);
    return html`
      <div>
       ${fieldTemplate}
        ${this._errorMessageTemplate(errorMsg)}
      </div>
    `;
  }

  renderControlLegend(field, value, set) {
    return this.getFieldTemplate(field, value, set);
  }

  _errorMessageTemplate(errorMsg) {
    if (errorMsg) {
      return html`
        <div>
          <span class="text-danger">
            ${errorMsg}
          </span>
        </div>
      `;
    }
    return nothing;
  }

  getFieldTemplate(field, value, set, model) {
    let renderFn = null;

    switch (field.control) {
      case 'button':
        renderFn = this.renderButton;
        break;

      case 'checkbox':
        renderFn = this.renderCheckbox;
        break;

      case 'input':
        renderFn = this.renderInput;
        break;

      case 'select':
        renderFn = this.renderSelect;
        break;

      default:
        renderFn = this.renderInput;
        break;
    }

    return renderFn.bind(this)(field, value, set);
  }

  renderButton(field) {
    return html`
      <t-button
        id="${field.key}"
        type="${field.attrs.type}"
        style="${field.attrs.style}"
        disabled="${ifDefined(field.attrs.disabled)}"
      >
        ${field.attrs.label}
      </t-button>
    `;
  }

  renderCheckbox(field, value, set) {
    return html`
      <t-checkbox
        id="${field.key}"
        label="${field.attrs.label}"
        @change="${(e) => set(e.target.checked)}"
        ?checked="${value}"
        required="${ifDefined(field.messaging?.validation?.required?.value)}"
        disabled="${ifDefined(field.attrs.disabled)}"
      >
      </t-checkbox>
    `;
  }

  renderInput(field, value, set) {
    return html`
      <t-input
        id="${field.key}"
        name="${field.key}"
        label="${field.attrs.label}"
        type="${field.attrs.type}"
        .value="${value}"
        ?required="${ifDefined(field.messaging?.validation?.required?.value)}"
        @input="${(e) => set(e.target.value)}"
        disabled="${ifDefined(field.attrs.disabled)}"
        readonly="${ifDefined(field.attrs.readonly)}"
      >
      </t-input>
    `;
  }

  renderSelect(field, value, set) {
    return html`
      <t-select
        label = "${field.attrs.label}"
        id = "${field.key}"
        .options = "${field.attrs.options}"
        placeholder = "${ifDefined(field.attrs.placeholder)}"
        initValue = "${value}"
        required = "${ifDefined(field.messaging?.validation?.required?.value)}"
      >
      </t-select>
      `;
  }

  getMessageTemplate(field, value, set) {
    let renderFn = null;
    console.log('field', field);
    console.log(field.messaging);

    // return renderFn.bind(this)(field, value, set)
  }
}
