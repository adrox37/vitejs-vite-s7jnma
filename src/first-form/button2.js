import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { TButtonMixin } from './button-mixin.js';

export class TButton extends TButtonMixin(LitElement) {
  // static get properties() {
  //   return {
  //     disabled: { type: Boolean, reflect: true },
  //     id: { type: String },
  //     loading: { type: Boolean, reflect: true },
  //     name: { type: String },
  //     reverse: { type: Boolean, reflect: true },
  //     transparent: { type: Boolean, reflect: true },
  //     style: { type: String },
  //     title: { type: String, reflect: true },
  //     type: { type: String },
  //     value: { type: String },
  //   };
  // }

  // constructor() {
  //   super();

  //   this.disabled = false;
  //   this.loading = false;
  //   this.name = '';
  //   this.reverse = false;
  //   this.transparent = false;
  //   this.style = 'primary';
  //   this.type = '';
  //   this.types = ['button', 'submit', 'reset'];
  //   this.value = '';
  // }

  static get properties() {
    return {
      ...super.properties,
      type: {
        type: String,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.type = 'button';
    this.types = ['button', 'submit', 'reset'];
  }

  // connectedCallback() {
  //   super.connectedCallback();
  // }

  // firstUpdated() {
  //   super.firstUpdated();
  // }

  render() {
    const btnClasses = {
      btn: true,
      danger: this.style === 'danger',
      dark: this.style === 'dark',
      info: this.style === 'info',
      light: this.style === 'light',
      primary: this.style === 'primary',
      secondary: this.style === 'secondary',
      success: this.style === 'success',
      tertiary: this.style === 'tertiary',
      warning: this.style === 'warning',
    };

    return html`
      <button
        ?disabled="${this.disabled}"
        class=${classMap(btnClasses)}
        id="${this.id}"
        name="${this.name}"
        ?reverse="${this.reverse}"
        ?transparent="${this.transparent}"
        title="${this.title}"
        type="${this._buttonType(this.type)}"
        value="${this.value}"
        aria-busy="${this.loading}"
        @click="${() => {}}"
      >
        <slot></slot>
      </button>`;
  }

  _buttonType(type) {
    if (this.types.includes(type)) {
      return type;
    }
    return 'button';
  }
}

customElements.define('t-button', TButton);
