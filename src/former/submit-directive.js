class SubmitDirective extends AsyncDirective {
  constructor(part) {
    super(part);
    this.part = part;
  }

  get host() {
    return this.part.element;
  }

  render(onSubmit) {
    if (!this.#cb) {
      this.#cb = (e) => {
        e.preventDefault();
        onSubmit(e);
      };

      this.host.addEventListener('submit', this.#cb);
    }

    return noChange;
  }

  disconnected() {
    this.host.removeEventListener('submit', this.#cb);
  }
}

export const onSubmit = directive(SubmitDirective);
