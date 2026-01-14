export enum HttpStatus {
  // 2xx – Éxito
  OK = 200, // GET exitoso
  CREATED = 201, // POST exitoso
  NO_CONTENT = 204, // DELETE / PUT sin body

  // 4xx – Errores del cliente
  BAD_REQUEST = 400, // Validación / payload inválido
  UNAUTHORIZED = 401, // No autenticado (token inválido/ausente)
  FORBIDDEN = 403, // Autenticado pero sin permisos
  NOT_FOUND = 404, // Recurso inexistente
  CONFLICT = 409, // Duplicados / estados inválidos
  UNPROCESSABLE_ENTITY = 422, // Validación semántica (muy usada en APIs)

  // 5xx – Errores del servidor
  INTERNAL_SERVER_ERROR = 500, // Error no controlado
  BAD_GATEWAY = 502, // Microservicios / proxy
  SERVICE_UNAVAILABLE = 503, // Down / mantenimiento
}
