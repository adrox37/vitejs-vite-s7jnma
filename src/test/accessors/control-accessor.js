export class BaseControlAccessor {
  onChange = () => {};
  onTouch = () => {};
  onBlur = () => {};

  constructor(el) {
    this.el = el;
  }

  getValue() {
    if ('value' in this.el) return this.el.value;
  }

  setValue(value) {
    if ('value' in this.el) this.el.value = value;
  }

  setUIState(uiState) {
    switch (uiState) {
      case 'DISABLED': {
        if ('disabled' in this.el) {
          this.el.disabled = true;
        }
        if ('readOnly' in this.el) {
          this.el.readOnly = false;
        }
        break;
      }
      case 'READONLY': {
        if ('disabled' in this.el) {
          this.el.disabled = false;
        }
        if ('readOnly' in this.el) {
          this.el.readOnly = true;
        }
        break;
      }
      default: {
        if ('disabled' in this.el) {
          this.el.disabled = false;
        }
        if ('readOnly' in this.el) {
          this.el.readOnly = false;
        }
        break;
      }
    }
  }

  setValidity(status) {
    switch (status) {
      case 'VALID':
        this.el.setAttribute('valid', '');
        this.el.removeAttribute('invalid');
        this.el.removeAttribute('pending');
        break;
      case 'INVALID':
        this.el.setAttribute('invalid', '');
        this.el.removeAttribute('valid');
        this.el.removeAttribute('pending');
        break;
      case 'PENDING':
        this.el.setAttribute('pending', '');
        this.el.removeAttribute('valid');
        this.el.removeAttribute('invalid');
        break;
      default:
        this.el.removeAttribute('pending');
        this.el.removeAttribute('valid');
        this.el.removeAttribute('invalid');
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
    this.el.addEventListener('input', this.onChange);
  }

  registerOnTouch(fn) {
    this.onTouch = fn;
    this.el.addEventListener('focus', this.onTouch);
  }

  registerOnBlur(fn) {
    this.onBlur = fn;
    this.el.addEventListener('blur', this.onBlur);
  }

  onDisconnect() {
    this.el.removeEventListener('input', this.onChange);
    this.el.removeEventListener('focus', this.onTouch);
    this.el.removeEventListener('blur', this.onBlur);
  }
}
