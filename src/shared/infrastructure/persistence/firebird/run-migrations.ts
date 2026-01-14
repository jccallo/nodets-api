import fs from 'fs'
import path from 'path'
import { firebirdDb } from './connection'

const MIGRATIONS_DIR = path.join(__dirname, 'migrations')
const LOG_TABLE = 'FB_MIGRATIONS_LOG'

async function runMigrations() {
   const action = process.argv[2] // 'up' or 'down'

   if (!['up', 'down'].includes(action)) {
      console.error('Please specify action: "up" or "down"')
      process.exit(1)
   }

   try {
      // 0. Ensure Log Table Exists
      try {
         await firebirdDb.schema.hasTable(LOG_TABLE).then((exists) => {
            if (!exists) {
               return firebirdDb.schema.createTable(LOG_TABLE, (t) => {
                  t.increments('ID').primary()
                  t.string('NAME', 255).notNullable()
                  t.integer('BATCH').notNullable()
                  t.timestamp('MIGRATION_TIME').defaultTo(firebirdDb.fn.now())
               })
            }
         })
      } catch (e) {
         // Ignorar si ya existe (concurrencia o error de driver)
         // console.log('DEBUG: Table check error', e);
      }

      console.log(`Starting manual migration [${action.toUpperCase()}] for Firebird...`)

      const files = fs
         .readdirSync(MIGRATIONS_DIR)
         .filter((file) => file.endsWith('.ts'))
         .sort()

      // Obtener historial
      const history = await firebirdDb(LOG_TABLE).select('*').orderBy('ID', 'ASC')
      const executedFiles = history.map((h: any) => h.NAME)
      const lastBatch = history.length > 0 ? Math.max(...history.map((h: any) => h.BATCH)) : 0

      if (action === 'up') {
         const currentBatch = lastBatch + 1
         let runCount = 0

         for (const file of files) {
            if (executedFiles.includes(file)) {
               continue // Skip already executed
            }

            console.log(`Running UP: ${file} (Batch ${currentBatch})`)
            const migration = require(path.join(MIGRATIONS_DIR, file))

            // Ejecutar migración
            await migration.up(firebirdDb)

            // Registrar en log con ID manual
            const lastLog = await firebirdDb(LOG_TABLE).max('ID as maxId').first()
            const nextId = (lastLog?.maxId || 0) + 1

            await firebirdDb(LOG_TABLE).insert({
               ID: nextId,
               NAME: file,
               BATCH: currentBatch,
               MIGRATION_TIME: new Date(),
            })

            console.log(`Completed UP: ${file}`)
            runCount++
         }

         if (runCount === 0) {
            console.log('All migrations are already up to date.')
         } else {
            console.log(`Successfully ran ${runCount} migrations.`)
         }
      } else if (action === 'down') {
         if (lastBatch === 0) {
            console.log('No migrations to rollback.')
            return
         }

         // Filtrar migraciones del último lote
         const batchMigrations = history.filter((h: any) => h.BATCH === lastBatch).sort((a: any, b: any) => b.ID - a.ID) // Reverse order for rollback

         console.log(`Rolling back Batch ${lastBatch}...`)

         for (const record of batchMigrations) {
            const file = record.NAME
            // Verificar si el archivo aún existe
            if (fs.existsSync(path.join(MIGRATIONS_DIR, file))) {
               console.log(`Running DOWN: ${file}`)
               const migration = require(path.join(MIGRATIONS_DIR, file))
               await migration.down(firebirdDb)
               console.log(`Completed DOWN: ${file}`)
            } else {
               console.warn(`Migration file not found: ${file}. Skipping code execution but removing from log.`)
            }

            // Eliminar del log
            await firebirdDb(LOG_TABLE).where('ID', record.ID).delete()
         }

         console.log(`Rollback of Batch ${lastBatch} completed.`)
      }
   } catch (error) {
      console.error('Error executing migrations:', error)
   } finally {
      await firebirdDb.destroy()
   }
}

runMigrations()
