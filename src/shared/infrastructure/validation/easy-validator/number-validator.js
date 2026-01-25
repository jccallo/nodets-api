const BaseValidator = require('./base-validator')

class NumberValidator extends BaseValidator {
   number(msg = 'Debe ser un número válido') {
      return this._addRule((v) => {
         const n = Number(v)
         const isValid = v !== '' && v !== null && !isNaN(n)

         if (!isValid) return { valid: false, error: msg, value: v }

         // Transformación según presencia de punto decimal
         let transformedValue = n
         const stringVal = String(v)

         if (stringVal.includes('.')) {
            // Si tiene punto, tomamos solo los primeros 2 decimales (truncado, no redondeado)
            const [intPart, decPart] = stringVal.split('.')
            transformedValue = Number(`${intPart}.${decPart.substring(0, 2)}`)
         } else {
            // Si no tiene punto, lo tratamos como entero
            transformedValue = Math.round(n)
         }
         // console.log(`Debug: v=${v}, n=${n}, transformed=${transformedValue}`);

         return {
            valid: true,
            error: null,
            value: transformedValue,
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
