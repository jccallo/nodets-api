class BaseValidator {
   constructor() {
      this.rules = []
      this.isOptional = false
      this.isNullable = false
      this.requiredMsg = 'Este campo es obligatorio'
   }

   optional() {
      this.isOptional = true
      return this
   }

   nullable() {
      this.isNullable = true
      return this
   }

   _addRule(fn) {
      this.rules.push(fn)
      return this
   }

   run(value) {
      if (value === null && this.isNullable) return { errors: [], value: null }

      if (value === undefined || value === null || value === '') {
         if (this.isOptional) return { errors: [], value: undefined }
         return { errors: [this.requiredMsg], value }
      }

      const errors = []
      let currentValue = value

      for (const rule of this.rules) {
         const result = rule(currentValue)
         if (!result.valid) {
            errors.push(result.error)
         }
         currentValue = result.value
      }

      return { errors, value: currentValue }
   }
}

module.exports = BaseValidator
