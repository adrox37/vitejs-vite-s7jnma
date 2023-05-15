import { LitElement, html } from "lit";

export default class List extends LitElement {
  static get properties() {
    return {
      data: Object
    };
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const { total_count: itemsCount, items } = this.data;

    if (!itemsCount) {
      return html` <div>No results. Try to find something different</div> `;
    }

    return html`
      <div>
        <div>Here are ${itemsCount} public repositories matching this topic...</div>
        <div class="repository-lit">
          ${items.map(
            (item) => html`
              <div class="repository-item">
                <h3 class="repository-item__title"><a href="#">${item.name}</a></h3>
                <div class="repository-item__info">
                  stars: <b>${item.stargazers_count}</b> forks: <b>${item.forks_count}</b>
                </div>
                <div class="repository-item__language">${item.language}</div>
                <div class="repository-item__description">${item.description}</div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}
