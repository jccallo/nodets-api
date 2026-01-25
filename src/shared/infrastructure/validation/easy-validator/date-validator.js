const BaseValidator = require('./base-validator')

class DateValidator extends BaseValidator {
   date(msg = 'Debe ser una fecha válida') {
      return this._addRule((v) => {
         if (typeof v !== 'string') return { valid: false, error: msg, value: v }

         // Normalización: Asegurar formato ISO y forzar UTC para que Date.parse sea consistente
         let normalized = v.replace(' ', 'T')
         if (!normalized.includes('Z') && !/[+-]\d{2}(:?\d{2})?$/.test(normalized)) {
            normalized += 'Z'
         }

         const timestamp = Date.parse(normalized)
         if (isNaN(timestamp)) return { valid: false, error: msg, value: v }

         const d = new Date(timestamp)

         // Validación extra: Asegurar que no sea solo hora (e.g. "12:00")
         const hasDateParts = /[\d]{4}[\-/][\d]{1,2}[\-/][\d]{1,2}|[\d]{1,2}[\-/][\d]{1,2}[\-/][\d]{2,4}/.test(v)
         if (!hasDateParts && !v.includes('T')) return { valid: false, error: msg, value: v }

         // Validación estricta: Evitar que JS convierta "Feb 30" a "March 2"
         const dateMatch = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
         if (dateMatch) {
            const [_, y, m, day] = dateMatch.map(Number)
            // Con el normalized, siempre usamos UTC
            if (d.getUTCFullYear() !== y || d.getUTCMonth() + 1 !== m || d.getUTCDate() !== day) {
               return { valid: false, error: msg, value: v }
            }
         }

         return {
            valid: true,
            error: msg,
            value: v,
         }
      })
   }

   start(minDate, msg = `La fecha debe ser igual o posterior a ${minDate}`) {
      return this._addRule((v) => {
         const current = new Date(v).getTime()
         const min = new Date(minDate).getTime()
         return {
            valid: current >= min,
            error: msg,
            value: v,
         }
      })
   }

   end(maxDate, msg = `La fecha debe ser igual o anterior a ${maxDate}`) {
      return this._addRule((v) => {
         const current = new Date(v).getTime()
         const max = new Date(maxDate).getTime()
         return {
            valid: current <= max,
            error: msg,
            value: v,
         }
      })
   }

   convert(timeZone) {
      return this._addRule((v) => {
         let normalized = v.replace(' ', 'T')
         if (!normalized.includes('Z') && !/[+-]\d{2}(:?\d{2})?$/.test(normalized)) {
            normalized += 'Z'
         }

         const dateObj = new Date(normalized)

         // Usamos Intl para manejar zonas horarias de forma nativa y robusta
         const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone, // Si es undefined, usa la local del sistema
         }

         try {
            const formatter = new Intl.DateTimeFormat('en-CA', options)
            const parts = formatter.formatToParts(dateObj)
            const p = {}
            parts.forEach(({ type, value }) => {
               p[type] = value
            })

            const transformedValue = `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`

            return {
               valid: true,
               error: null,
               value: transformedValue,
            }
         } catch (e) {
            // Si la zona horaria es inválida, mantenemos el valor pero notificamos (o fallamos)
            // Por simplicidad, retornamos el valor original si Intl falla
            return {
               valid: true,
               error: null,
               value: v,
            }
         }
      })
   }
}

module.exports = DateValidator
