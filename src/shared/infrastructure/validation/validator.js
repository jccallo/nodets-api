/**
 * Clase que construye el encadenamiento de reglas de validación.
 * Soporta validación obligatoria por defecto, transformaciones, esquemas anidados y reglas avanzadas.
 */
class ValidatorBuilder {
   constructor() {
      this.rules = [] // Cada regla es (value) => { error: string|any|null, value: any }
      this.isOptional = false
      this.isNullable = false
      this.requiredMsg = null
      this.defaultValue = undefined
   }

   /**
    * Marca el campo como opcional. Si el valor es null, undefined o "", se saltan las validaciones.
    */
   optional() {
      this.isOptional = true
      return this
   }

   /**
    * Permite que el valor sea explícitamente null.
    */
   nullable() {
      this.isNullable = true
      return this
   }

   /**
    * Atajo para .optional().nullable()
    */
   nullish() {
      this.isOptional = true
      this.isNullable = true
      return this
   }

   /**
    * Define un valor por defecto si el dato original está vacío o no existe.
    */
   default(value) {
      this.defaultValue = value
      return this
   }

   /**
    * Define un mensaje personalizado para cuando el campo obligatorio falta.
    */
   required(message) {
      this.requiredMsg = message
      return this
   }

   /**
    * Agrega una regla de validación o transformación interna.
    */
   _addRule(fn) {
      this.rules.push(fn)
      return this
   }

   // --- STRINGS ---

   string(message) {
      return this._addRule((v) => ({
         error: typeof v === 'string' ? null : message,
         value: v,
      }))
   }

   object(message) {
      return this._addRule((v) => ({
         error: typeof v === 'object' && v !== null && !Array.isArray(v) ? null : message,
         value: v,
      }))
   }

   array(message) {
      return this._addRule((v) => ({
         error: Array.isArray(v) ? null : message,
         value: v,
      }))
   }

   length(len, message) {
      return this._addRule((v) => ({
         error: v?.length === len ? null : message,
         value: v,
      }))
   }

   min(len, message) {
      return this._addRule((v) => ({
         error: v?.length >= len ? null : message,
         value: v,
      }))
   }

   max(len, message) {
      return this._addRule((v) => ({
         error: v?.length <= len ? null : message,
         value: v,
      }))
   }

   email(message) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return this._addRule((v) => ({
         error: regex.test(String(v)) ? null : message,
         value: v,
      }))
   }

   url(message) {
      return this._addRule((v) => {
         try {
            new URL(v)
            return { error: null, value: v }
         } catch {
            return { error: message, value: v }
         }
      })
   }

   uuid(message) {
      const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      return this._addRule((v) => ({
         error: regex.test(String(v)) ? null : message,
         value: v,
      }))
   }

   /**
    * Valida formato de IP (v4, v6 o cualquiera).
    */
   ip(message, version = 'all') {
      const ipv4 = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/
      const ipv6 =
         /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){4}(?::(?:[a-fA-F\d]{1,4}:){0,1}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){3}(?::(?:[a-fA-F\d]{1,4}:){0,2}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){2}(?::(?:[a-fA-F\d]{1,4}:){0,3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?:[a-fA-F\d]{1,4}:){1}(?::(?:[a-fA-F\d]{1,4}:){0,4}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){1,7}|(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3})|:)))(?:%[0-9a-zA-Z]{1,})?$/
      return this._addRule((v) => {
         let valid = false
         if (version === 'v4') valid = ipv4.test(v)
         else if (version === 'v6') valid = ipv6.test(v)
         else valid = ipv4.test(v) || ipv6.test(v)
         return { error: valid ? null : message, value: v }
      })
   }

   /**
    * Valida contra una expresión regular personalizada.
    */
   matches(regex, message) {
      return this._addRule((v) => ({
         error: regex.test(String(v)) ? null : message,
         value: v,
      }))
   }

   alphanumeric(message) {
      const regex = /^[a-z0-9]+$/i
      return this._addRule((v) => ({
         error: regex.test(String(v)) ? null : message,
         value: v,
      }))
   }

   slug(message) {
      const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      return this._addRule((v) => ({
         error: regex.test(String(v)) ? null : message,
         value: v,
      }))
   }

   hexColor(message) {
      const regex = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
      return this._addRule((v) => ({
         error: regex.test(String(v)) ? null : message,
         value: v,
      }))
   }

   trim() {
      return this._addRule((v) => ({ error: null, value: typeof v === 'string' ? v.trim() : v }))
   }

   toLowerCase() {
      return this._addRule((v) => ({ error: null, value: typeof v === 'string' ? v.toLowerCase() : v }))
   }

   toUpperCase() {
      return this._addRule((v) => ({ error: null, value: typeof v === 'string' ? v.toUpperCase() : v }))
   }

   // --- LOGICAL ---

   or(otherBuilder) {
      return this._addRule((v, data) => {
         const res1 = this.run(v, data)
         if (res1.errors.length === 0) return { error: null, value: res1.value }
         const res2 = otherBuilder.run(v, data)
         if (res2.errors.length === 0) return { error: null, value: res2.value }
         return { error: 'No coincide con ninguna opción', value: v }
      })
   }

   and(otherBuilder) {
      return this._addRule((v, data) => {
         const res1 = this.run(v, data)
         if (res1.errors.length > 0) return { error: res1.errors[0], value: v }
         const res2 = otherBuilder.run(res1.value, data)
         return { error: res2.errors[0] || null, value: res2.value }
      })
   }

   // --- NUMBERS ---

   number(message) {
      return this._addRule((v) => {
         const n = Number(v)
         const isValid = v !== '' && v !== null && !isNaN(n)
         return { error: isValid ? null : message, value: isValid ? n : v }
      })
   }

   integer(message) {
      return this._addRule((v) => {
         const n = Number(v)
         const isValid = v !== '' && v !== null && Number.isInteger(n)
         return { error: isValid ? null : message, value: isValid ? n : v }
      })
   }

   minValue(min, message) {
      return this._addRule((v) => ({ error: Number(v) >= min ? null : message, value: v }))
   }

   maxValue(max, message) {
      return this._addRule((v) => ({ error: Number(v) <= max ? null : message, value: v }))
   }

   positive(message) {
      return this.minValue(1e-10, message)
   }
   negative(message) {
      return this.maxValue(-1e-10, message)
   }

   multipleOf(n, message) {
      return this._addRule((v) => ({ error: Number(v) % n === 0 ? null : message, value: v }))
   }

   safe(message) {
      return this._addRule((v) => ({
         error: Number.isSafeInteger(Number(v)) ? null : message,
         value: v,
      }))
   }

   port(message) {
      return this._addRule((v) => {
         const p = Number(v)
         const ok = Number.isInteger(p) && p >= 0 && p <= 65535
         return { error: ok ? null : message, value: v }
      })
   }

   // --- FILES ---

   file(options = {}, message) {
      const { maxSize, allowedTypes } = options
      return this._addRule((v) => {
         const isFile = v && typeof v === 'object' && (v.size !== undefined || v.mimetype !== undefined)
         if (!isFile) return { error: message, value: v }
         if (maxSize && v.size > maxSize) return { error: `File too large`, value: v }
         if (allowedTypes && !allowedTypes.includes(v.mimetype)) return { error: `Invalid type`, value: v }
         return { error: null, value: v }
      })
   }

   image(message) {
      return this._addRule((v) => {
         const isImg = (typeof v === 'string' && v.startsWith('data:image/')) || v?.mimetype?.startsWith('image/')
         return { error: isImg ? null : message, value: v }
      })
   }

   base64(message) {
      const regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
      return this._addRule((v) => ({
         error: typeof v === 'string' && regex.test(v) ? null : message,
         value: v,
      }))
   }

   // --- COMPLEX ---

   elements(itemBuilder) {
      return this._addRule((v) => {
         if (!Array.isArray(v)) return { error: 'Debe ser una lista', value: v }
         const errors = []
         const values = []
         v.forEach((item, idx) => {
            const res = itemBuilder.run(item)
            if (res.errors.length > 0) errors.push({ index: idx, errors: res.errors })
            values.push(res.value)
         })
         return { error: errors.length > 0 ? errors : null, value: values }
      })
   }

   record(valueBuilder) {
      return this._addRule((v) => {
         if (typeof v !== 'object' || v === null || Array.isArray(v)) return { error: 'Debe ser un objeto', value: v }
         const errors = {}
         const values = {}
         for (const key in v) {
            const res = valueBuilder.run(v[key])
            if (res.errors.length > 0) errors[key] = res.errors
            values[key] = res.value
         }
         return { error: Object.keys(errors).length > 0 ? errors : null, value: values }
      })
   }

   schema(innerSchema) {
      return this._addRule((v) => {
         const res = validate(v, innerSchema)
         return { error: res.success ? null : res.errors, value: res.data }
      })
   }

   // --- SPECIALIZED ---

   date(message) {
      return this._addRule((v) => {
         const d = new Date(v)
         const isValid = !isNaN(d.getTime())
         return { error: isValid ? null : message, value: isValid ? d : v }
      })
   }

   minDate(date, message) {
      return this._addRule((v) => {
         const d = v instanceof Date ? v : new Date(v)
         const limit = date instanceof Date ? date : new Date(date)
         return { error: d >= limit ? null : message, value: v }
      })
   }

   maxDate(date, message) {
      return this._addRule((v) => {
         const d = v instanceof Date ? v : new Date(v)
         const limit = date instanceof Date ? date : new Date(date)
         return { error: d <= limit ? null : message, value: v }
      })
   }

   phone(message) {
      const regex = /^\+?[1-9]\d{1,14}$/
      return this._addRule((v) => ({
         error: regex.test(String(v).replace(/\s/g, '')) ? null : message,
         value: v,
      }))
   }

   oneOf(values, message) {
      return this._addRule((v) => ({
         error: values.includes(v) ? null : message,
         value: v,
      }))
   }

   creditCard(message) {
      return this._addRule((v) => {
         const s = String(v).replace(/\D/g, '')
         let sum = 0
         let shouldDouble = false
         for (let i = s.length - 1; i >= 0; i--) {
            let digit = parseInt(s.charAt(i))
            if (shouldDouble) {
               if ((digit *= 2) > 9) digit -= 9
            }
            sum += digit
            shouldDouble = !shouldDouble
         }
         const valid = sum !== 0 && sum % 10 === 0
         return { error: valid ? null : message, value: v }
      })
   }

   cvv(message) {
      const regex = /^[0-9]{3,4}$/
      return this._addRule((v) => ({
         error: regex.test(String(v)) ? null : message,
         value: v,
      }))
   }

   macAddress(message) {
      const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
      return this._addRule((v) => ({
         error: regex.test(String(v)) ? null : message,
         value: v,
      }))
   }

   json(message) {
      return this._addRule((v) => {
         try {
            const parsed = JSON.parse(v)
            return { error: null, value: parsed }
         } catch {
            return { error: message, value: v }
         }
      })
   }

   truthy(message) {
      return this._addRule((v) => ({ error: !!v ? null : message, value: v }))
   }

   // --- CORE ---

   equalsField(fieldName, message) {
      return this._addRule((v, data) => ({
         error: v === data?.[fieldName] ? null : message,
         value: v,
      }))
   }

   refine(fn, message) {
      return this._addRule((v, data) => ({ error: fn(v, data) ? null : message, value: v }))
   }
   transform(fn) {
      return this._addRule((v) => ({ error: null, value: fn(v) }))
   }

   run(value, data) {
      let currentValue = value === undefined ? this.defaultValue : value
      if (currentValue === null && this.isNullable) return { errors: [], value: null }

      const isEmpty = currentValue === undefined || currentValue === null || currentValue === ''
      if (isEmpty) {
         if (this.isOptional) return { errors: [], value: currentValue }
         return { errors: [this.requiredMsg || 'Requerido'], value: currentValue }
      }

      const errors = []
      for (const rule of this.rules) {
         const result = rule(currentValue, data)
         if (result.error) errors.push(result.error)
         currentValue = result.value
      }
      return { errors, value: currentValue }
   }
}

// --- EXPORTS ---

export const string = (m) => new ValidatorBuilder().string(m)
export const object = (m) => new ValidatorBuilder().object(m)
export const array = (m) => new ValidatorBuilder().array(m)
export const number = (m) => new ValidatorBuilder().number(m)
export const integer = (m) => new ValidatorBuilder().integer(m)
export const boolean = (m) => new ValidatorBuilder().boolean(m)
export const date = (m) => new ValidatorBuilder().date(m)
export const optional = () => new ValidatorBuilder().optional()
export const nullable = () => new ValidatorBuilder().nullable()
export const nullish = () => new ValidatorBuilder().nullish()
export const oneOf = (v, m) => new ValidatorBuilder().oneOf(v, m)
export const uuid = (m) => new ValidatorBuilder().uuid(m)
export const url = (m) => new ValidatorBuilder().url(m)
export const schema = (s) => new ValidatorBuilder().schema(s)
export const elements = (b) => new ValidatorBuilder().elements(b)
export const record = (b) => new ValidatorBuilder().record(b)
export const json = (m) => new ValidatorBuilder().json(m)
export const truthy = (m) => new ValidatorBuilder().truthy(m)
export const slug = (m) => new ValidatorBuilder().slug(m)
export const hexColor = (m) => new ValidatorBuilder().hexColor(m)
export const cvv = (m) => new ValidatorBuilder().cvv(m)
export const port = (m) => new ValidatorBuilder().port(m)
export const macAddress = (m) => new ValidatorBuilder().macAddress(m)
export const matches = (r, m) => new ValidatorBuilder().matches(r, m)
export const phone = (m) => new ValidatorBuilder().phone(m)
export const equalsField = (f, m) => new ValidatorBuilder().equalsField(f, m)
export const base64 = (m) => new ValidatorBuilder().base64(m)
export const file = (opt, m) => new ValidatorBuilder().file(opt, m)
export const image = (m) => new ValidatorBuilder().image(m)

/**
 * Motor de validación.
 */
export const validate = (data, validationSchema, options = {}) => {
   const errors = {}
   const validatedData = {}

   for (const field in validationSchema) {
      if (validationSchema[field] instanceof ValidatorBuilder) {
         const result = validationSchema[field].run(data[field], data)
         if (result.errors.length > 0) errors[field] = result.errors
         else validatedData[field] = result.value
      }
   }

   if (options.strict) {
      const schemaKeys = Object.keys(validationSchema)
      for (const key in data) {
         if (!schemaKeys.includes(key)) {
            errors[key] = ['Campo no permitido (Strict Mode)']
         }
      }
   }

   const isValid = Object.keys(errors).length === 0
   return {
      success: isValid,
      errors: isValid ? null : errors,
      data: isValid ? validatedData : null,
   }
}
