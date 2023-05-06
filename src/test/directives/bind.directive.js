import { nothing } from "lit"
import { PartType } from "lit/directive.js"
import { AsyncDirective, directive } from "lit/async-directive.js"
import { Subscription, map, startWith } from "rxjs"

export const bindFactory = control => {
  return directive(
    class Bind extends AsyncDirective {
      isSetup = false
      validators = []

      inputListener = () => {
        control.setDirty()
        if (this.config.updateOn === "input") {
          this.setModel()
        }
      }

      focusListener = () => {
        control.setTouched()
      }

      blurListener = () => {
        control.setBlurred()
        if (this.config.updateOn === "blur") {
          this.setModel()
        }
      }

      constructor(partInfo) {
        super(partInfo)
        if (partInfo.type !== PartType.ELEMENT) {
          throw new Error('Use as "<element {bind()}"')
        }
      }

      update(part, [config]) {
        this.element = part.element
        if (config?.accessor && config?.accessor !== this.config?.accessor) {
          this.accessor = new config.accessor(this.element)
        }
        this.config = {
          ...config,
          updateOn: config?.updateOn ?? control.config.updateOn
        }
        if (!this.isSetup) {
          /**
           * TODO: this code has been put here to avoid performance issues.
           * However, if the element's attributes change (eg. type) the accessor stays the same.
           * What can be done here?
           */
          if (this.config.accessor) {
            this.accessor = new this.config.accessor(this.element)
          } else {
            this.accessor = control.config.accessorFactory(this.element)
          }
          this.reconnected()
          this.isSetup = true
        }
        return this.render(config ?? {})
      }

      render(_config) {
        return nothing
      }

      disconnected() {
        this.sub?.unsubscribe()
        // Remove all validator attributes
        this.validators.forEach(_v => {
          const v = _v
          v.disconnected?.(this.element, control)
        })
        this.validators = []
        this.accessor.setValidity?.(null)
        this.accessor.onDisconnect?.()
      }

      reconnected() {
        // View to Model
        this.accessor.registerOnChange(this.inputListener)
        this.accessor.registerOnTouch?.(this.focusListener)
        this.accessor.registerOnBlur?.(this.blurListener)
        // Model to View
        this.sub = new Subscription()

        // Update the DOM when the value changes
        this.sub.add(
          control
            .valueChanges()
            .pipe(startWith(null))
            .subscribe(() => {
              this.setView()
            })
        )

        // Update the DOM when the UI State changes (disabled, readonly)
        this.sub.add(
          control.uiStateChanges().subscribe(uiState => {
            this.accessor.setUIState?.(uiState)
          })
        )

        // Update the DOM when the validation status changes (valid, invalid, pending)
        this.sub.add(
          control.statusChanges().subscribe(status => {
            this.accessor.setValidity?.(status)
          })
        )

        // Update the DOM when validators change (they could add attributes)
        this.sub.add(
          control.validatorsChanged$
            .pipe(
              map(() => [
                ...control.config.validators,
                ...control.config.asyncValidators
              ])
            )
            .subscribe(newValidators => {
              this.validators.forEach(v => {
                v.disconnected?.(this.element, control)
              })

              newValidators.forEach(v => {
                v.connected?.(this.element, control)
              })

              this.validators = newValidators
            })
        )
      }

      setView() {
        const domValue = this.accessor.getValue()
        if (control.value != domValue) {
          this.accessor.setValue(control.value ?? null)
        }
      }

      setModel() {
        const domValue = this.accessor.getValue()
        if (control.value != domValue) {
          control.set(domValue)
        }
      }
    }
  )
}
