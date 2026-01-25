const BaseValidator = require('./base-validator')

class NumberValidator extends BaseValidator {
   number(msg = 'Debe ser un número válido') {
      return this._addRule((v) => {
         const n = Number(v)
         const isValid = v !== '' && v !== null && !isNaN(n)

         return {
            valid: isValid,
            error: msg,
            value: v, // No transformamos aquí
         }
      })
   }

   convert(digits = 2, mode = 'trunc') {
      return this._addRule((v) => {
         const n = Number(v)
         const power = Math.pow(10, digits)
         let transformedValue

         if (mode === 'trunc') {
            transformedValue = Math.trunc(n * power) / power
         } else {
            transformedValue = Math.round(n * power) / power
         }

         return {
            valid: true,
            error: null,
            value: transformedValue, // Aquí sí aseguramos que sea Number y aplicamos la lógica
         }
      })
   }

   minValue(n, msg = `El valor mínimo es ${n}`) {
      return this._addRule((v) => ({
         valid: Number(v) >= n,
         error: msg,
         value: v,
      }))
   }

   maxValue(n, msg = `El valor máximo es ${n}`) {
      return this._addRule((v) => ({
         valid: Number(v) <= n,
         error: msg,
         value: v,
      }))
   }

   inList(list, msg = 'El valor no está en la lista permitida') {
      return this._addRule((v) => ({
         valid: list.includes(Number(v)),
         error: msg,
         value: v,
      }))
   }
}

module.exports = NumberValidator
