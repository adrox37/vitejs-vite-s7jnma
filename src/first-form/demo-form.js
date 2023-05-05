import { LitElement, html } from 'lit'

import { config, fieldset } from './meta-data.js'
import { model } from './model-data.js'

import './form.js'

class DemoForm extends LitElement {


  render() {
    return html`
      <t-form .config="${config}" .value="${model}">
      </t-form>
    `
  }
  
}

customElements.define('demo-form', DemoForm)