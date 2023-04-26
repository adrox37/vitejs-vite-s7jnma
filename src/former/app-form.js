import { LitElement, html } from 'lit';

class FormElement extends LitElement {
  static styles = css`
    input.invalid {
      border: 1px solid red;
    }
  `;

  submit(e) {
    console.log(this.form.value);
  }

  form = new FormGroupController(this, {
    name: new FormController('foo', [Validators.required]),
    count: new FormController(1),
    terms: new FormController(true),
  });

  updateName() {
    this.form.controls.name.setValue('bar');
  }

  render() {
    return html`
      ${JSON.stringify(this.form.value)}

      <p>Invalid: ${this.form.invalid}</p>

      <form ${onSubmit((e) => this.submit(e))}>
        <input ${this.form.registerControl('name')} />
        <input ${this.form.registerControl('terms')} type="checkbox" /> Terms
        <input ${this.form.registerControl('count')} type="number" />

        <button type="submit">Submit</button>
        <button type="button" @click=${this.updateName}>Update name</button>
      </form>
    `;
  }
}

customElements.define('app-form', FormElement);
