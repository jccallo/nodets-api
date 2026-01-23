/**
 * Clase que construye el encadenamiento de reglas de validación.
 * Soporta validación obligatoria por defecto, transformaciones y reglas avanzadas.
 */
class ValidatorBuilder {
   constructor() {
      this.rules = [] // Cada regla es (value) => { error: string|null, value: any }
      this.isOptional = false
      this.isNullable = false
      this.requiredMsg = null
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

   /**
    * Valida que el dato sea de tipo STRING.
    */
   string(message) {
      return this._addRule((v) => ({
         error: typeof v === 'string' ? null : message,
         value: v,
      }))
   }

   /**
    * Valida la LONGITUD EXACTA de un string o array.
    */
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

   datetime(message) {
      const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/
      return this._addRule((v) => ({
         error: regex.test(String(v)) ? null : message,
         value: v,
      }))
   }

   startsWith(prefix, message) {
      return this._addRule((v) => ({
         error: String(v).startsWith(prefix) ? null : message,
         value: v,
      }))
   }

   endsWith(suffix, message) {
      return this._addRule((v) => ({
         error: String(v).endsWith(suffix) ? null : message,
         value: v,
      }))
   }

   trim() {
      return this._addRule((v) => ({
         error: null,
         value: typeof v === 'string' ? v.trim() : v,
      }))
   }

   toLowerCase() {
      return this._addRule((v) => ({
         error: null,
         value: typeof v === 'string' ? v.toLowerCase() : v,
      }))
   }

   toUpperCase() {
      return this._addRule((v) => ({
         error: null,
         value: typeof v === 'string' ? v.toUpperCase() : v,
      }))
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
      return this._addRule((v) => ({
         error: Number(v) >= min ? null : message,
         value: v,
      }))
   }

   maxValue(max, message) {
      return this._addRule((v) => ({
         error: Number(v) <= max ? null : message,
         value: v,
      }))
   }

   positive(message) {
      return this.minValue(0.0000000001, message)
   }

   negative(message) {
      return this.maxValue(-0.0000000001, message)
   }

   nonpositive(message) {
      return this.maxValue(0, message)
   }

   nonnegative(message) {
      return this.minValue(0, message)
   }

   multipleOf(n, message) {
      return this._addRule((v) => ({
         error: Number(v) % n === 0 ? null : message,
         value: v,
      }))
   }

   finite(message) {
      return this._addRule((v) => ({
         error: Number.isFinite(Number(v)) ? null : message,
         value: v,
      }))
   }

   // --- OTHERS ---

   boolean(message) {
      return this._addRule((v) => {
         if (typeof v === 'boolean') return { error: null, value: v }
         if (v === 'true' || v === '1' || v === 1) return { error: null, value: true }
         if (v === 'false' || v === '0' || v === 0) return { error: null, value: false }
         return { error: message, value: v }
      })
   }

   date(message) {
      return this._addRule((v) => {
         const d = new Date(v)
         const isValid = !isNaN(d.getTime())
         return { error: isValid ? null : message, value: isValid ? d : v }
      })
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

   oneOf(values, message) {
      return this._addRule((v) => ({
         error: values.includes(v) ? null : message,
         value: v,
      }))
   }

   regex(pattern, message) {
      return this._addRule((v) => ({
         error: pattern.test(String(v)) ? null : message,
         value: v,
      }))
   }

   // --- LOGIC ---

   /**
    * Permite agregar una función personalizada de validación.
    */
   refine(fn, message) {
      return this._addRule((v) => ({
         error: fn(v) ? null : message,
         value: v,
      }))
   }

   /**
    * Permite transformar el dato libremente.
    */
   transform(fn) {
      return this._addRule((v) => ({
         error: null,
         value: fn(v),
      }))
   }

   /**
    * Ejecuta el pipeline de reglas y colecta errores.
    */
   /**
    * Valida que el dato sea una cadena BASE64 válida.
    */
   base64(message) {
      const regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
      return this._addRule((v) => ({
         error: typeof v === 'string' && regex.test(v) ? null : message,
         value: v,
      }))
   }

   /**
    * Valida un ARCHIVO (ya sea objeto File del navegador o estructura de Multer/Node).
    * Permite validar tamaño máximo (en bytes) y tipos permitidos.
    */
   file(options = {}, message) {
      const { maxSize, allowedTypes } = options
      return this._addRule((v) => {
         // Verificación básica de estructura de archivo
         const isFile = v && typeof v === 'object' && (v.size !== undefined || v.mimetype !== undefined)
         if (!isFile) return { error: message, value: v }

         if (maxSize && v.size > maxSize) return { error: `File too large (max ${maxSize} bytes)`, value: v }
         if (allowedTypes && !allowedTypes.includes(v.mimetype))
            return { error: `Invalid file type: ${v.mimetype}`, value: v }

         return { error: null, value: v }
      })
   }

   /**
    * Valida que sea una IMAGEN (soporta Base64 con cabecera data:image/... o objeto File).
    */
   image(message) {
      return this._addRule((v) => {
         // Caso 1: String Base64 con cabecera
         if (typeof v === 'string' && v.startsWith('data:image/')) return { error: null, value: v }

         // Caso 2: Objeto File/Multer
         if (v && typeof v === 'object' && v.mimetype?.startsWith('image/')) return { error: null, value: v }

         return { error: message, value: v }
      })
   }

   /**
    * Valida que el dato cumpla con un ESQUEMA ANIDADO.
    */
   schema(innerSchema) {
      this.object('Debe ser un objeto')
      return this._addRule((v) => {
         const result = validate(v, innerSchema)
         return {
            error: result.success ? null : result.errors,
            value: result.data,
         }
      })
   }

   run(value) {
      // Manejo de nulos y opcionales
      if (value === null && this.isNullable) return { errors: [], value: null }

      const isEmpty = value === undefined || value === null || value === ''
      if (isEmpty) {
         if (this.isOptional) return { errors: [], value }
         const firstRule = this.rules[0]
         const fallback = firstRule ? firstRule('').error : 'Required'
         return { errors: [this.requiredMsg || fallback], value }
      }

      let currentValue = value
      const errors = []

      for (const rule of this.rules) {
         const result = rule(currentValue)
         if (result.error) {
            errors.push(result.error)
         }
         currentValue = result.value // Las transformaciones se mantienen para la siguiente regla
      }

      return { errors, value: currentValue }
   }
}

// --- EXPORTS ---

export const string = (m) => new ValidatorBuilder().string(m)
export const number = (m) => new ValidatorBuilder().number(m)
export const integer = (m) => new ValidatorBuilder().integer(m)
export const boolean = (m) => new ValidatorBuilder().boolean(m)
export const date = (m) => new ValidatorBuilder().date(m)
export const object = (m) => new ValidatorBuilder().object(m)
export const array = (m) => new ValidatorBuilder().array(m)
export const optional = () => new ValidatorBuilder().optional()
export const nullable = () => new ValidatorBuilder().nullable()
export const oneOf = (v, m) => new ValidatorBuilder().oneOf(v, m)
export const uuid = (m) => new ValidatorBuilder().uuid(m)
export const url = (m) => new ValidatorBuilder().url(m)
export const schema = (s) => new ValidatorBuilder().schema(s)
export const base64 = (m) => new ValidatorBuilder().base64(m)
export const file = (opt, m) => new ValidatorBuilder().file(opt, m)
export const image = (m) => new ValidatorBuilder().image(m)

/**
 * Motor principal de validación.
 * Retorna { success, data, errors }.
 * La data devuelta contiene las transformaciones aplicadas.
 */
export const validate = (data, schema) => {
   const errors = {}
   const validatedData = { ...data }

   for (const field in schema) {
      const result = schema[field].run(data[field])
      if (result.errors.length > 0) {
         errors[field] = result.errors
      } else {
         validatedData[field] = result.value
      }
   }

   const isValid = Object.keys(errors).length === 0

   return {
      success: isValid,
      errors: isValid ? null : errors,
      data: isValid ? validatedData : null,
   }
}
