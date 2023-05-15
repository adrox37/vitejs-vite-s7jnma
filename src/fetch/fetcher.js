import { html, css, LitElement } from 'lit-element';

export default class FetchLit extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 5px;
      }
    `;
  }

  static get properties() {
    return {
      users: { type: Array },
    };
  }

  constructor() {
    super();
    this.users = [
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@somewhere.com',
      },
    ];
  }

  // Don't use connectedCallback() since it can't be async
  async firstUpdated() {
    await fetch(`https://demo.vaadin.com/demo-data/1.0/people?count=10`)
      .then((r) => r.json())
      .then(async (data) => {
        this.users = data.result;
      });
  }

  render() {
    return html`
      <ul>
        ${this.users.map(
          (u) =>
            html`
              <li>${u.lastName}, ${u.firstName} - ${u.email}</li>
            `
        )}
      </ul>
    `;
  }
}

window.customElements.define('fetch-lit', FetchLit);
