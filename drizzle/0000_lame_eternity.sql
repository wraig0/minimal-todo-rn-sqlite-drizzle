CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text DEFAULT '' NOT NULL,
	`done` integer DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL
);
