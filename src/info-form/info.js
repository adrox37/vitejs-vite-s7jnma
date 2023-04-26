import { LitElement, html, css } from 'lit';

import './form.js';

const countries = [
  { name: 'Italy', value: '1' },
  { name: 'Germany', value: '2' },
  { name: 'Czech Republic', value: '0' },
  { name: 'Austria', value: '3' },
  { name: 'Switzerland', value: '4' },
  { name: 'France', value: '5' },
  { name: 'Spain', value: '6' },
  { name: 'Italy', value: '1' },
  { name: 'Germany', value: '2' },
  { name: 'Czech Republic', value: '0' },
  { name: 'Austria', value: '3' },
  { name: 'Switzerland', value: '4' },
  { name: 'France', value: '5' },
  { name: 'Spain', value: '6' },
  { name: 'Italy', value: '1' },
  { name: 'Germany', value: '2' },
  { name: 'Czech Republic', value: '0' },
  { name: 'Austria', value: '3' },
  { name: 'Switzerland', value: '4' },
  { name: 'France', value: '5' },
  { name: 'Spain', value: '6' },
];

const config = [
  {
    id: '1',
    key: 'NAME',
    type: 'input',
    templateOptions: {
      type: 'string',
      label: 'Name',
      required: true,
    },
  },
  {
    id: '2',
    key: 'country',
    type: 'select',
    templateOptions: {
      type: 'string',
      label: 'Country',
      options: countries,
      required: false,
    },
  },
  {
    id: '2',
    key: 'birthdate',
    type: 'date',
    templateOptions: {
      type: 'timestamp',
      label: 'Birthdate',
      required: false,
    },
  },
  {
    id: 'notes_id',
    key: 'notes',
    type: 'input',
    templateOptions: {
      type: 'string',
      label: 'Notes',
      required: false,
      minLength: 3,
      maxLength: 5,
      pattern: '[a-z]*',
      placeholder: 'Insert some lowercase notes here (3-5 characters)',
    },
  },
  {
    id: 'checkbox_unchecked',
    key: 'checkbox',
    type: 'checkbox',
    templateOptions: {
      type: 'string',
      label: 'Check me',
      required: false,
    },
  },
  {
    id: 'checkbox_checked',
    key: 'checkbox_checked',
    type: 'checkbox',
    templateOptions: {
      type: 'string',
      label: 'Checked',
      required: false,
    },
  },
  {
    id: 'age',
    key: 'age',
    type: 'input',
    templateOptions: {
      type: 'integer',
      label: 'Age <= 45',
      required: false,
      max: 45,
    },
  },
  {
    id: 'disabled',
    key: 'disabled',
    type: 'input',
    templateOptions: {
      label: 'Disabled',
      disabled: true,
      placeholder: 'This field is disabled',
    },
  },
  {
    id: 'readonly',
    key: 'readonly',
    type: 'input',
    templateOptions: {
      label: 'Readonly',
      readonly: true,
      placeholder: 'This field is readonly',
    },
  },
];

const value = {
  NAME: 'Kafka',
  country: '0',
  birthdate: '1883-07-03',
  checkbox_checked: true,
  age: 41,
};

class TInfo extends LitElement {
  static get properties() {
    return {
      name: { type: String },
    };
  }

  constructor() {
    super();
    this.name = 'MemberInfo';
    this.count = '';
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    super.firstUpdated();
    console.log(!this.count)
  }

  _handleSubmit() {
    console.log(this.getNodeElement());
  }

  _renderView() {}

  _renderEdit() {
    return html`
    <t-form .contract="${config}" .value="${value}">
    </t-form>
  `;
  }

  render() {
    return html`
    ${this._renderEdit()}
  `;
  }
}

customElements.define('t-info', TInfo);
