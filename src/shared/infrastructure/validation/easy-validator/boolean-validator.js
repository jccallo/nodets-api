const BaseValidator = require('./base-validator')

class BooleanValidator extends BaseValidator {
   boolean(msg = 'Debe ser un valor booleano') {
      const allowed = [true, false, 'true', 'false', 1, 0, '1', '0']
      return this._addRule((v) => ({
         valid: allowed.includes(v),
         error: msg,
         value: v,
      }))
   }

   convert() {
      return this._addRule((v) => {
         let transformedValue = v

         if (v === true || v === 'true') transformedValue = true
         else if (v === false || v === 'false') transformedValue = false
         else if (v === 1 || v === '1') transformedValue = 1
         else if (v === 0 || v === '0') transformedValue = 0

         return {
            valid: true,
            error: null,
            value: transformedValue,
         }
      })
   }
}

module.exports = BooleanValidator
