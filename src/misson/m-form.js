import { LitElement, html } from 'lit-element';

export class MForm extends LitElement {
  constructor() {
    super();
    this.errors = [];
  }

  static get properties() {
    return {
      errors: Array,
    };
  }

  render() {
    const hasError = (name) => (this.errors.indexOf(name) >= 0 ? 'error' : '');
    return html`
      <style>
        .error {
          border: 1px solid red;
        }
      </style>
      <form @submit="${(e) => this.submit(e)}" 
      @change="${(e) => this.formValueUpdated(e)}">
        <div>
          <label>Name: </label>\
          <input class="${hasError('name')}" 
                 type="input" 
                 name="name"/>
        </div>
        <div>
          <label>Description: </label>
          <textarea class="${hasError('description')}" 
                    name="description"></textarea>
        </div>
        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    `;
  }

  submit(e) {
    e.preventDefault();
    let form = e.target;
    this.errors = this.checkForErrors(form);
    if (!this.errors.length) {
      let mission = {
        name: form.name.value,
        description: form.description.value,
      };

      form.reset();
    }
  }

  checkForErrors(form) {
    let errors = [];

    if (!form.name.value) {
      errors.push('name');
    }
    if (!form.description.value) {
      errors.push('description');
    }
    return errors;
  }

  formValueUpdated(e) {
    let errorList = [...this.errors];
    if (!e.target.value) {
      errorList.push(e.target.name);
    } else {
      let indexOfError = errorList.indexOf(e.target.name);
      if (indexOfError >= 0) {
        errorList.splice(indexOfError, 1);
      }
    }
    this.errors = [...errorList];
  }
}
customElements.define('m-form', MForm);
