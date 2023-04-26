import { LitElement, html } from 'lit';

export class XApp extends LitElement {
  static properties = {
    loading: { type: String, state: true },
    error: { type: String, state: true },
    data: { type: Object, state: true },
  };

  async fetchUsers() {
    this.loading = true;
    try {
      const response = await fetch('https://randomuser.me/api/?results=3');
      const { results: users } = await response.json();
      this.data = users;
      this.error = undefined;
    } catch (err) {
      this.data = undefined;
      this.error = err;
    }
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchUsers();
  }

  render() {
    if (this.loading) {
      return html`<p>Fetching users...</p>`;
    }
    if (this.error) {
      return html`<p>An error occurred while fetching users</p>`;
    }
    if (this.data) {
      return html`
        <ul>
          ${this.data.map(
            (user) => html`
              <li>
                <img src=${user.picture.thumbnail} alt="user" />
                <p>${user.name.first} ${user.name.last}</p>
              </li>
            `
          )}
        </ul>
      `;
    }
  }
}

customElements.define('x-app', XApp);
