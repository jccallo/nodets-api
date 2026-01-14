# Guía Rápida de Migraciones (Knex)

Para que no lo olvidemos: estas son las reglas de oro que acordamos para manejar objetos que ya existen en la base de datos.

## 1. Tablas y Columnas (Seguridad de Datos)

Para objetos que contienen datos, **lanzar un error** si ya existen para evitar sobrescribir información accidentalmente.

```typescript
// En el método up()
const exists = await knex.schema.hasTable('table_name')
if (exists) {
   throw new Error("Table 'table_name' already exists.")
}
```

## 2. Procedimientos Almacenados (SPs) y Vistas

Como no guardan datos de forma persistente, lo mejor es **Borrar y Recrear**.

```typescript
// En el método up()
await knex.raw('DROP PROCEDURE IF EXISTS mi_procedimiento')
return knex.raw(`CREATE PROCEDURE mi_procedimiento ...`)
```

## 3. Índices (SQL Nativo)

Usar la cláusula nativa del motor para mayor simplicidad.

```typescript
// En el método up()
return knex.raw('CREATE INDEX IF NOT EXISTS nombre_idx ON tabla (columna)')
```

## 4. Estrategia de IDs

-  **Autoincrementable (INT/BIGINT)**: Mejor rendimiento, menor espacio. Recomendado para la mayoría de casos.
-  **UUID**: Mejor seguridad (IDOR) y escalabilidad distribuida. Ocupa más espacio.

---

_Nota: Una vez que una migración toca producción, no se edita el archivo original. Se crea una nueva migración que use `table.alter()`._
