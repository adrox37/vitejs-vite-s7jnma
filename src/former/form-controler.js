export class FormController {
  invalid = false;
  #modelChanged = [];

  constructor(value, validators) {
    this.value = value;
    this.validators = validators;
  }

  setValue(value, { emitModelChange = true } = {}) {
    this.value = value;
    emitModelChange && this.#modelChanged.forEach((cb) => cb(this.value));
  }

  getValue() {
    return this.value;
  }

  applyValidators() {
    if (!this.validators?.length) return;

    this.invalid = this.validators.some((validator) => validator(this.value));
  }

  onModelChange(cb) {
    this.#modelChanged.push(cb);

    return () => {
      this.#modelChanged = this.#modelChanged.filter((c) => c !== cb);
    };
  }
}
