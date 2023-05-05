import { LitElement, html } from 'lit';

export class TFieldset extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean, reflect: true },
      form: { type: String },
      legend: { type: String },
      name: { type: String },
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this.form = '';
    this.legend = '';
    this.name = '';
  }

  render() {
    const legendClasses = {
      required: this.required,
    };

    const fieldSetClasses = {
      required: this.required,
    };

    return html`
      <fieldset
        class="${classMap(fieldSetClasses)}"
        form="${this.form}" 
        name="${this.name}"
        ?disabled="${this.disabled}"
      >
        ${
          this.legend
            ? html`<legend class="${classMap(legendClasses)}" part="legend">${
                this.legend
              }</legend>`
            : ''
        }
        <slot name="legend-control"></slot>
        <slot></slot>
      </fieldset>
    `;
  }
}

customElements.define('t-fieldset', TFieldset);
