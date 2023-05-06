import { nothing } from 'lit';
import {
  merge,
  ReplaySubject,
  from,
  of,
  combineLatest,
  BehaviorSubject,
  map,
  switchMap,
  tap,
  catchError,
  distinctUntilChanged,
} from 'rxjs';
import { FormControl } from './form-control';

export class FormGroup {
  structureChanged$ = new ReplaySubject(1);
  runningAsyncValidatorsCount = 0;
  errorsSync$ = new BehaviorSubject([]);
  errorsAsync$ = new BehaviorSubject([]);
  errorsFixed$ = new BehaviorSubject([]);

  get value() {
    let value = {};
    Object.keys(this.controls).forEach((key) => {
      value[key] = this.controls[key].value;
    });
    return value;
  }

  /**
   * Strips disabled FormControl's
   */
  get enabledValue() {
    let value = {};
    Object.keys(this.controls).forEach((key) => {
      const control = this.controls[key];
      if (control instanceof FormControl && control.uiState === 'DISABLED') {
        return;
      }
      if (control instanceof FormGroup) {
        value[key] = control.enabledValue;
        return;
      }
      value[key] = control.value;
    });
    return value;
  }

  get errors() {
    return Array.from(
      new Set([
        ...this.errorsSync$.getValue(),
        ...this.errorsAsync$.getValue(),
        ...this.errorsFixed$.getValue(),
      ])
    );
  }

  get status() {
    if (
      this.errorsSync$.getValue().length > 0 ||
      this.errorsAsync$.getValue().length > 0 ||
      this.errorsFixed$.getValue().length > 0
    )
      return 'INVALID';
    const invalid = Object.values(this.controls).find(
      (c) => c.status === 'INVALID'
    );
    if (invalid) {
      return 'INVALID';
    }
    const pending = Object.values(this.controls).find(
      (c) => c.status === 'PENDING'
    );
    if (pending) {
      return 'PENDING';
    }
    if (this.runningAsyncValidatorsCount > 0) return 'PENDING';
    return 'VALID';
  }

  constructor(host, controls, config) {
    this.host = host;
    this.controls = controls;
    this.host.addController(this);
    this.config = {
      validators: config?.validators ?? [],
      asyncValidators: config?.asyncValidators ?? [],
    };
    this.structureChanged$.next();
    this.reset();
  }

  hostConnected() {
    this.rerunValidators();
    this.rerunAsyncValidators();
  }

  hostDisconnected() {
    this.validatorsSub?.unsubscribe();
    this.asyncValidatorsSub?.unsubscribe();
  }

  /**
   * Bind to every nested control (only FormControl's).
   */
  bind = (field, config) => {
    const control = this.get(field);

    if (control instanceof FormControl) {
      return control.bind(config ?? {});
    }
    const splitted = ('' + field).split('.');
    const [firstKey, ...nested] = splitted;
    const x = this.get(firstKey);

    if (x instanceof FormGroup) {
      return x.bind(nested.join('.'), config ?? {});
    }
    return nothing;
  };

  /**
   * Curried utility for using the same configuration on multiple fields.
   */
  bindWith = (config) => (field) => {
    return this.bind(field, config);
  };

  /**
   * Retrieves a direct child by key.
   */
  get(key) {
    return this.controls[key];
  }

  /**
   * Calls `reset` on every child.
   * @param clearStates - Clears the states of every child.
   */
  reset(clearStates = true) {
    Object.keys(this.controls).forEach((key) => {
      this.get(key).reset(clearStates);
    });
  }

  /**
   * Tries to set a value for this group. Use this to make sure you specify all properties.
   * @param value - The complete value of the group.
   */
  set(value) {
    this.patch(value);
  }

  /**
   * Tries to set a value for this group.
   * @param value - A partial value of the group.
   */
  patch(value) {
    Object.keys(value).forEach((key) => {
      this.controls[key]?.set(value[key]);
    });
  }

  /**
   * true if at least one child is dirty.
   */
  get isDirty() {
    return Object.keys(this.controls).some((key) => this.controls[key].isDirty);
  }

  /**
   * true if at least one child is touched.
   */
  get isTouched() {
    return Object.keys(this.controls).some(
      (key) => this.controls[key].isTouched
    );
  }

  /**
   * true if at least one child is blurred.
   */
  get isBlurred() {
    return Object.keys(this.controls).some(
      (key) => this.controls[key].isBlurred
    );
  }

  /**
   * Returns true if the group has a specific error.
   */
  hasError(error) {
    return this.errors.includes(error);
  }

  /**
   * Observable of the value of the group, including the initial value.
   */
  valueChanges() {
    return this.structureChanged$.pipe(
      switchMap(() => {
        if (Object.keys(this.controls).length === 0) return of(this.value);
        const observables = Object.keys(this.controls).map((key) =>
          this.get(key).valueChanges()
        );
        return merge(...observables).pipe(map(() => this.value));
      })
    );
  }

  /**
   * Observable of the validation status of the group, including the initial status.
   */
  statusChanges() {
    return merge(this.errorsSync$, this.errorsAsync$, this.errorsFixed$).pipe(
      map(() => this.status),
      distinctUntilChanged()
    );
  }

  /**
   * Sets custom errors on the group. These errors won't be touched by validators.
   * You can later remove them by calling it again with new errors.
   */
  setFixedErrors(errors) {
    this.errorsFixed$.next(errors);
    this.host.requestUpdate();
  }

  /**
   * Replaces all validators.
   */
  setValidators(validators) {
    this.config.validators = validators;
    this.rerunValidators();
    this.host.requestUpdate();
  }

  /**
   * Replaces all asynchronous validators.
   */
  setAsyncValidators(asyncValidators) {
    this.config.asyncValidators = asyncValidators;
    this.rerunAsyncValidators();
    this.host.requestUpdate();
  }

  rerunValidators() {
    this.validatorsSub?.unsubscribe();

    this.validatorsSub = merge(
      this.structureChanged$,
      this.valueChanges()
    ).subscribe(() => {
      let errors = [];

      this.config.validators.forEach((validator) => {
        const error = validator(this);
        if (error && !errors.includes(error)) {
          errors.push(error);
        }
      });
      this.errorsSync$.next(errors);
      this.host.requestUpdate();
    });
  }

  rerunAsyncValidators() {
    this.asyncValidatorsSub?.unsubscribe();

    this.asyncValidatorsSub = merge(this.structureChanged$, this.valueChanges())
      .pipe(
        switchMap(() => {
          this.runningAsyncValidatorsCount = 0;
          const observables = this.config.asyncValidators.map((v) => {
            this.runningAsyncValidatorsCount++;
            this.host.requestUpdate();
            return from(v(this)).pipe(
              tap(() => {
                this.runningAsyncValidatorsCount--;
                this.host.requestUpdate();
              }),
              catchError(() => {
                this.runningAsyncValidatorsCount--;
                this.host.requestUpdate();
                return of(null);
              })
            );
          });

          if (observables.length < 1) {
            return of([]);
          }

          return combineLatest(observables).pipe(
            map((values) => values.filter((v) => v !== null))
          );
        })
      )
      .subscribe((e) => {
        this.errorsAsync$.next(e);
        this.host.requestUpdate();
      });
  }

  /**
   * Experimental: the Group must be typed accordingly! The base type wont' include the new control
   */
  addControl(name, control) {
    if (name in this.controls) {
      throw new Error(`There's already a control named ${name}.`);
    }
    this.controls[name] = control;
    this.structureChanged$.next();
    this.host.requestUpdate();
  }

  /**
   * Experimental: the Group must be typed accordingly! The base type will have the old control type
   */
  setControl(name, control) {
    if (!(name in this.controls)) {
      throw new Error(`There's no control named ${name}.`);
    }
    this.controls[name] = control;
    this.structureChanged$.next();
    this.host.requestUpdate();
  }

  /**
   * Experimental: the Group must be typed accordingly! The base type will include the removed control
   */
  removeControl(name) {
    if (!(name in this.controls)) {
      throw new Error(`There's no control named ${name}.`);
    }
    delete this.controls[name];
    this.structureChanged$.next();
    this.host.requestUpdate();
  }
}
