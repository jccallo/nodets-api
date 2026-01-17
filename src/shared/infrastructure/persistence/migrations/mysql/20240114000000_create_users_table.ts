import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
   const exists = await knex.schema.hasTable('users')

   if (exists) {
      throw new Error("Table 'users' already exists in the database.")
   }

   return knex.schema.createTable('users', (table) => {
      table.bigIncrements('id').primary()
      table.string('email').unique().notNullable()
      table.string('name').notNullable()
      table.string('password').notNullable()
      table.timestamp('createdAt').defaultTo(knex.fn.now())
   })
}

export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTable('users')
}
