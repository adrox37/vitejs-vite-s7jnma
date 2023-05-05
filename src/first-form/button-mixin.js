export const TButtonMixin = (superClass) =>
  /**
   * @mixin
   */
  class extends superClass {
    static get properties() {
      return {
        toggle: {
          type: Boolean,
          reflect: true,
        },
        active: {
          type: Boolean,
          reflect: true,
        },
        disabled: {
          type: Boolean,
          reflect: true,
        },
        dropdownToggle: {
          type: Boolean,
          reflect: true,
          attribute: 'dropdown-toggle',
        },
      };
    }

    /**
     * @param  {...any} args
     */
    constructor(...args) {
      super(...args);
      this.active = false;
      this.toggle = false;
      this.disabled = false;
      this.dropdownToggle = false;
      this._addAriaRole();
    }

    /**
     * @param {Map} _updatedProperties
     */
    firstUpdated(_updatedProperties) {
      const buttonElement = this.shadowRoot.querySelector('.btn');

      buttonElement.addEventListener('click', (event) =>
        this._handleButtonClick(event)
      );
      buttonElement.addEventListener('focusout', (_) => this._handleFocusOut());
    }

    /**
     * @param {Map} _changedProperties
     */
    updated(_changedProperties) {
      if (_changedProperties.has('active')) {
        this._toggleAriaPressedState();
      }

      if (_changedProperties.has('disabled')) {
        this._toggleAriaDisabledState();
      }
    }

    async activate() {
      this.active = true;
      await this.updateComplete;
    }

    async deactivate() {
      this.active = false;
      await this.updateComplete;
    }

    async disable() {
      this.disabled = true;
      await this.updateComplete;
    }

    async enable() {
      this.disabled = false;
      await this.updateComplete;
    }

    _addAriaRole() {
      this.setAttribute('role', 'button');
    }

    _toggleAriaDisabledState() {
      if (this.disabled) {
        this.setAttribute('tabindex', '-1');
        this.setAttribute('aria-disabled', 'true');
      } else {
        this.removeAttribute('tabindex');
        this.removeAttribute('aria-disabled');
      }
    }

    _toggleAriaPressedState() {
      if (this.active) {
        this.setAttribute('aria-pressed', 'true');
      } else {
        this.removeAttribute('aria-pressed');
      }
    }

    async _handleFocusOut() {
      if (this.disabled) {
        return;
      }

      if (this.active && this.dropdownToggle) {
        this.active = !this.active;
        await this.updateComplete;
      }

      this._fireFocusOutEvent();
    }

    /**
     * @param {MouseEvent} event
     */
    async _handleButtonClick(event) {
      if (this.disabled) {
        return;
      }

      const buttonElement = this.shadowRoot.querySelector('.btn');
      buttonElement.focus();

      if (this.toggle || this.dropdownToggle) {
        this.active = !this.active;
        await this.updateComplete;
      }

      this._fireButtonClickEvent();
    }

    _fireFocusOutEvent() {
      const btnFocusOutEvent = new CustomEvent('t-button-focusout', {
        bubbles: true,
        composed: true,
      });

      this.dispatchEvent(btnFocusOutEvent);
    }

    _fireButtonClickEvent() {
      console.log('clicked');
      const btnClickedEvent = new CustomEvent('t-button-click', {
        bubbles: true,
        composed: true,
        detail: {
          active: this.active,
          toggle: this.toggle,
          dropdown: this.dropdownToggle,
        },
      });

      this.dispatchEvent(btnClickedEvent);
    }
  };
