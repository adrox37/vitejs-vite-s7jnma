import { BaseControlAccessor } from './control-accessor';

/**
 * Accessors for any kind of native HTML control.
 */
export class TextAccessor extends BaseControlAccessor {}
export class SelectAccessor extends BaseControlAccessor {}

export class NumberAccessor extends BaseControlAccessor {
  getValue() {
    return +this.el.value;
  }

  setValue(value) {
    this.el.value = '' + value;
  }
}

export class CheckboxAccessor extends BaseControlAccessor {
  getValue() {
    return this.el.checked;
  }

  setValue(value) {
    this.el.checked = !!value;
  }
}

export class SelectMultipleAccessor extends BaseControlAccessor {
  getValue() {
    const options = this.el.selectedOptions;
    let results = [];
    for (let i = 0; i < options.length; i++) {
      results.push(options[i].value);
    }
    return results;
  }

  setValue(value) {
    for (let i = 0; i < this.el.options.length; i++) {
      this.el.options[i].selected = value.includes(this.el.options[i].value);
    }
  }
}
export class RadioAccessor extends BaseControlAccessor {
  getValue() {
    return this.el.checked ? this.el.value : null;
  }

  setValue(value) {
    this.el.checked = value === this.el.value;
  }
}

export const getControlAccessor = (el) => {
  if (el.localName === 'input' && el.getAttribute('type') === 'checkbox') {
    return new CheckboxAccessor(el);
  }
  if (el.localName === 'input' && el.getAttribute('type') === 'number') {
    return new NumberAccessor(el);
  }
  if (el.localName === 'input' && el.getAttribute('type') === 'range') {
    return new NumberAccessor(el);
  }
  if (el.localName === 'input' && el.getAttribute('type') === 'text') {
    return new TextAccessor(el);
  }
  if (el.localName === 'input' && el.getAttribute('type') === 'radio') {
    return new RadioAccessor(el);
  }
  if (el.localName === 'select' && el.hasAttribute('multiple')) {
    return new SelectMultipleAccessor(el);
  }
  if (el.localName === 'select') {
    return new SelectAccessor(el);
  }
  return new BaseControlAccessor(el);
};
