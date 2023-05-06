import { FormArray } from './form-array.js';
import { FormControl } from './form-control.js';
import { FormGroup } from './form-group.js';

export class FormBuilder {
  constructor(host, config) {
    this.host = host;
    this.config = config;
    this.host.addController(this);
  }

  control(defaultValue, validators = [], asyncValidators = []) {
    return new FormControl(this.host, {
      defaultValue,
      validators,
      asyncValidators,
      accessorFactory: this.config?.accessorFactory,
      updateOn: this.config?.updateOn,
    });
  }

  group(shape, config) {
    return new FormGroup(this.host, shape, {
      validators: config?.validators || [],
      asyncValidators: config?.asyncValidators || [],
    });
  }

  array(initialItems = [], validators = [], asyncValidators = []) {
    return new FormArray(this.host, {
      initialItems,
      validators,
      asyncValidators,
    });
  }

  hostConnected() {}

  hostDisconnected() {}
}
