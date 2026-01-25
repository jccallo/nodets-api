const BaseValidator = require('./base-validator')

class StringValidator extends BaseValidator {
   string(msg = 'Debe ser una cadena de texto') {
      return this._addRule((v) => ({
         valid: typeof v === 'string',
         error: msg,
         value: v,
      }))
   }

   min(n, msg = `Debe tener al menos ${n} caracteres`) {
      return this._addRule((v) => ({
         valid: String(v).length >= n,
         error: msg,
         value: v,
      }))
   }

   max(n, msg = `Debe tener máximo ${n} caracteres`) {
      return this._addRule((v) => ({
         valid: String(v).length <= n,
         error: msg,
         value: v,
      }))
   }

   inList(list, msg = 'El valor no está en la lista permitida') {
      const lowerList = list.map((item) => String(item).toLowerCase())
      return this._addRule((v) => ({
         valid: lowerList.includes(String(v).toLowerCase()),
         error: msg,
         value: v,
      }))
   }

   includes(sub, msg = `Debe contener el valor: ${sub}`) {
      const lowerSub = String(sub).toLowerCase()
      return this._addRule((v) => ({
         valid: String(v).toLowerCase().includes(lowerSub),
         error: msg,
         value: v,
      }))
   }
}

module.exports = StringValidator
