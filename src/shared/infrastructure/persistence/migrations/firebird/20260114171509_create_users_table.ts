import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
   try {
      const exists = await knex.schema.hasTable('USERS')

      if (exists) {
         console.log("Table 'USERS' already exists. Skipping creation.")
         return
      }

      await knex.schema.createTable('USERS', (table) => {
         table.integer('ID').primary()
         table.string('EMAIL', 255).unique().notNullable()
         table.string('NAME', 255).notNullable()
         table.string('PASSWORD', 255).notNullable()
         table.timestamp('CREATED_AT').defaultTo(knex.fn.now())
      })

      // Create Generator (Sequence)
      await knex.raw('CREATE SEQUENCE GEN_USERS_ID')

      // Create Trigger for Autoincrement
      await knex.raw(`
         CREATE TRIGGER TRI_USERS_ID FOR USERS
         ACTIVE BEFORE INSERT POSITION 0
         AS
         BEGIN
            IF (NEW.ID IS NULL) THEN
               NEW.ID = GEN_ID(GEN_USERS_ID, 1);
         END
      `)
   } catch (error: any) {
      // 335544351 = unsuccessful metadata update (likely format error or already exists)
      if (
         error.message.includes('already exists') ||
         error.message.includes('already defined') ||
         (error.gdscode && error.gdscode === 335544351)
      ) {
         console.log("Table 'USERS' or artifacts already exist. Skipping.")
      } else {
         throw error
      }
   }
}

export async function down(knex: Knex): Promise<void> {
   try {
      await knex.schema.dropTable('USERS')
      await knex.raw('DROP SEQUENCE GEN_USERS_ID')
   } catch (e: any) {
      // Ignore errors if table/sequence doesn't exist
   }
}
