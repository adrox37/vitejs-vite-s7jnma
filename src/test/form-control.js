import { bindFactory } from "./directives/bind.directive"
import {
  from,
  combineLatest,
  of,
  BehaviorSubject,
  merge,
  ReplaySubject,
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
  tap
} from "rxjs"
import { getControlAccessor } from "./accessors/accessors"

export class FormControl {
  bind = bindFactory(this)
  _isDirty = false
  _isTouched = false
  _isBlurred = false
  uiState$ = new BehaviorSubject("ENABLED")
  errorsSync$ = new BehaviorSubject([])
  errorsAsync$ = new BehaviorSubject([])
  errorsFixed$ = new BehaviorSubject([])
  runningAsyncValidatorsCount = 0
  validatorsChanged$ = new ReplaySubject(1)

  get value() {
    return this.value$.getValue()
  }

  get errors() {
    return Array.from(
      new Set([
        ...this.errorsSync$.getValue(),
        ...this.errorsAsync$.getValue(),
        ...this.errorsFixed$.getValue()
      ])
    )
  }

  get status() {
    if (this.errorsSync$.getValue().length > 0) return "INVALID"
    if (this.errorsFixed$.getValue().length > 0) return "INVALID"
    if (this.runningAsyncValidatorsCount > 0) return "PENDING"
    return this.errorsAsync$.getValue().length < 1 ? "VALID" : "INVALID"
  }

  constructor(host, config) {
    this.host = host
    this.config = {
      defaultValue: config.defaultValue,
      validators: config.validators ?? [],
      asyncValidators: config.asyncValidators ?? [],
      accessorFactory: config.accessorFactory ?? getControlAccessor,
      updateOn: config.updateOn ?? "input"
    }
    this.value$ = new BehaviorSubject(config.defaultValue)
    this.host.addController(this)
  }

  hostConnected() {
    this.validatorsChanged$.next()
    this.rerunValidators()
    this.rerunAsyncValidators()
  }

  hostDisconnected() {
    this.validatorsChanged$.next()
    this.validatorsSub?.unsubscribe()
    this.asyncValidatorsSub?.unsubscribe()
  }

  reset(clearStates = true) {
    this.value$.next(this.config.defaultValue)
    if (clearStates) {
      this._isDirty = false
      this._isTouched = false
      this._isBlurred = false
    }
    this.host.requestUpdate()
  }

  set(value) {
    this.value$.next(value)
    this.host.requestUpdate()
  }

  /**
   * Returns true if the control has ever changed value.
   */
  get isDirty() {
    return this._isDirty
  }

  /**
   * Returns true if the control has ever been touched.
   */
  get isTouched() {
    return this._isTouched
  }

  /**
   * Returns true if the control has ever been blurred.
   */
  get isBlurred() {
    return this._isBlurred
  }

  /**
   * The UI State of this control.
   * It's either `ENABLED`, `DISABLED` or `READONLY`.
   */
  get uiState() {
    return this.uiState$.getValue()
  }

  setDirty(isDirty = true) {
    this._isDirty = isDirty
    this.host.requestUpdate()
  }

  setTouched(isTouched = true) {
    this._isTouched = isTouched
    this.host.requestUpdate()
  }

  setBlurred(isBlurred = true) {
    this._isBlurred = isBlurred
    this.host.requestUpdate()
  }

  setUIState(state) {
    this.uiState$.next(state)
    this.host.requestUpdate()
  }

  /**
   * Returns true if the control has a specific error.
   */
  hasError(error) {
    return this.errors.includes(error)
  }

  /**
   * Observable of the UI State of the control, including the initial state.
   */
  uiStateChanges() {
    return this.uiState$.pipe(distinctUntilChanged())
  }

  /**
   * Observable of the value of the control, including the initial value.
   */
  valueChanges() {
    return this.value$.asObservable()
  }

  /**
   * Observable of the validation status of the control, including the initial status.
   */
  statusChanges() {
    return merge(this.errorsSync$, this.errorsAsync$, this.errorsFixed$).pipe(
      map(() => this.status),
      distinctUntilChanged()
    )
  }

  /**
   * Sets custom errors on the control. These errors won't be touched by validators.
   * You can later remove them by calling it again with new errors.
   */
  setFixedErrors(errors) {
    this.errorsFixed$.next(errors)
    this.host.requestUpdate()
  }

  /**
   * Replaces all validators.
   */
  setValidators(validators) {
    this.config.validators = validators
    this.validatorsChanged$.next()
    this.rerunValidators()
    this.host.requestUpdate()
  }

  /**
   * Replaces all asynchronous validators.
   */
  setAsyncValidators(asyncValidators) {
    this.config.asyncValidators = asyncValidators
    this.validatorsChanged$.next()
    this.rerunAsyncValidators()
    this.host.requestUpdate()
  }

  rerunValidators() {
    this.validatorsSub?.unsubscribe()

    this.validatorsSub = this.valueChanges().subscribe(() => {
      let errors = []
      this.config.validators.forEach(validator => {
        const error = validator(this)
        if (error && !errors.includes(error)) {
          errors.push(error)
        }
      })
      this.errorsSync$.next(errors)
      this.host.requestUpdate()
    })
  }

  rerunAsyncValidators() {
    this.asyncValidatorsSub?.unsubscribe()

    this.asyncValidatorsSub = this.valueChanges()
      .pipe(
        switchMap(() => {
          this.runningAsyncValidatorsCount = 0
          const observables = this.config.asyncValidators.map(v => {
            this.runningAsyncValidatorsCount++
            this.host.requestUpdate()
            return from(v(this)).pipe(
              tap(() => {
                this.runningAsyncValidatorsCount--
                this.host.requestUpdate()
              }),
              catchError(() => {
                this.runningAsyncValidatorsCount--
                this.host.requestUpdate()
                return of(null)
              })
            )
          })
          if (observables.length < 1) {
            return of([])
          }
          return combineLatest(observables).pipe(
            map(values => values.filter(v => v !== null))
          )
        })
      )
      .subscribe(e => {
        this.errorsAsync$.next(e)
        this.host.requestUpdate()
      })
  }
}
