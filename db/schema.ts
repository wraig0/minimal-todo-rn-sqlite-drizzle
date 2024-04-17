import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const enum Done {
  NOT_DONE = 0,
  DONE = 1,
}

const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").default("").notNull(),
  done: integer("done").default(Done.NOT_DONE).notNull(),
  createdAt: text("createdAt")
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export { todos };
