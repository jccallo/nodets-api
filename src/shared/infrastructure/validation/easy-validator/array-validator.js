const BaseValidator = require('./base-validator')

class ArrayValidator extends BaseValidator {
   array(msg = 'Debe ser un array') {
      return this._addRule((v) => ({
         valid: Array.isArray(v),
         error: msg,
         value: v,
      }))
   }

   minLength(n, msg = `Debe tener al menos ${n} elementos`) {
      return this._addRule((v) => ({
         valid: Array.isArray(v) && v.length >= n,
         error: msg,
         value: v,
      }))
   }

   maxLength(n, msg = `Debe tener máximo ${n} elementos`) {
      return this._addRule((v) => ({
         valid: Array.isArray(v) && v.length <= n,
         error: msg,
         value: v,
      }))
   }

   includes(sub, msg = `Debe contener el valor: ${sub}`) {
      const lowerSub = String(sub).toLowerCase()
      return this._addRule((v) => ({
         valid: Array.isArray(v) && v.some((item) => String(item).toLowerCase() === lowerSub),
         error: msg,
         value: v,
      }))
   }
}

module.exports = ArrayValidator
