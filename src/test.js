class FormInput extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super();

    this.invalid = false;
    this.pristine = true;
    this.internals = this.attachInternals();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        input {
          display: block;
          padding: 5px;
        }
      </style>
      <input type="text">
    `;
  }

  connectedCallback() {
    this.input = this.shadowRoot.querySelector('input');

    // set the required properties (constraints) on the internal
    // <input>
    [
      'type',
      'value',
      'placeholder',
      'required',
      'min',
      'max',
      'minLength', // <-- camelCase!
      'maxLength', // <-- camelCase!
      'pattern',
    ].forEach((attr) => {
      console.log('attr', attr);
      const attrValue =
        attr === 'required' ? this.hasAttribute(attr) : this.getAttribute(attr);

      console.log(attrValue);
      if (attrValue !== null && attrValue !== undefined) {
        this.input[attr] = attrValue;
        console.log('>>>>', this.input[attr]);
      }
    });

    this.input.addEventListener('change', (e) => {
      if (this.validateOnChange) {
        this.pristine = false;
      }

      // we also want to dispatch a `change` event from
      // our custom element
      const clone = new e.constructor(e.type, e);
      this.dispatchEvent(clone);

      // set the element's validity whenever the value of the
      // <input> changes
      this.validateInput();
    });

    this.addEventListener('invalid', (e) => {
      this.invalid = true;
      this.pristine = false;

      // when a custom error needs to be displayed,
      // prevent the native error from showing
      if (this.customErrorDisplay) {
        e.preventDefault();
      }
    });

    this.addEventListener('focus', () => this.input.focus());

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    // set the initial validity of the component
    this.validateInput();
  }

  get customErrorDisplay() {
    console.log('getcustomErrorDisplay');
    return this.hasAttribute('custom-error-display');
  }

  get validateOnChange() {
    console.log('getvalidateOnChange');
    return this.hasAttribute('validate-on-change');
  }

  get invalid() {
    console.log('getinvalid');
    return this.hasAttribute('invalid');
  }

  set invalid(isInvalid) {
    console.log('set invalid', isInvalid);
    isInvalid && this.customErrorDisplay
      ? this.setAttribute('invalid', '')
      : this.removeAttribute('invalid');
  }

  get value() {
    console.log('getvalue');
    return this.input.value;
  }

  set value(value) {
    console.log('setvalue', value);
    this.input.value = value;
    this.internals.setFormValue(value);
  }

  get form() {
    console.log('getform');
    return this.internals.form;
  }

  get name() {
    console.log('getname');
    return this.getAttribute('name');
  }

  get type() {
    console.log('gettype');
    return this.localName;
  }
  get validity() {
    console.log('getvalidity');
    return this.internals.validity;
  }

  get validationMessage() {
    console.log('getvalidationMessage');
    return this.internals.validationMessage;
  }
  get willValidate() {
    console.log('getwillValidate');
    return this.internals.willValidate;
  }
  checkValidity() {
    console.log('getcheckValidity');
    return this.internals.checkValidity();
  }
  reportValidity() {
    console.log('getreportValidity');
    return this.internals.reportValidity();
  }

  validateInput() {
    console.log('>>>>validateInput');
    // get the validity of the internal <input>
    const validState = this.input.validity;

    // reset this.invalid before validating again
    this.invalid = false;

    // if the input is invalid, show the correct error
    if (!validState.valid) {
      // loop through the error reasons
      for (let state in validState) {
        // get the name of the data attribute that holds the
        //error message
        const attr = `data-${state.toString()}`;
        // if there is an error and corresponding attribute holding
        // the message
        if (validState[state]) {
          this.validationError = state.toString();
          this.invalid = !this.pristine && !validState.valid;

          // get the correct error message
          const errorMessage = this.hasAttribute(attr)
            ? this.getAttribute(attr)
            : this.input.validationMessage;
          // set the validity error reason and the corresponding
          // message
          this.internals.setValidity(
            { [this.validationError]: true },
            errorMessage
          );
          console.log('1');
          // when a custom error needs to be displayed,
          // dispatch the 'invalid' event manually so consuming code
          // can use this as a hook to get the correct error message
          // and display it
          if (this.invalid && this.customErrorDisplay) {
            console.log('?');
            this.dispatchEvent(new Event('invalid'));
            console.log('get?');
          }
          console.log('2');
        }
      }
      console.log('endvalidateInput');
    } else {
      this.internals.setValidity({});
    }
  }
}

customElements.define('form-input', FormInput);

const form = document.querySelector('form');
const input = document.querySelector('form-input');
console.log('in', input);
const errorMessage = document.querySelector('.error-message');

form.addEventListener('submit', (e) => {
  console.log('e', e);
  e.preventDefault();
});

input.addEventListener('invalid', (e) => {
  errorMessage.textContent = input.validationMessage;
});
