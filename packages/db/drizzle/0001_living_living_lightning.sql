PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_execution` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'RUNNING' NOT NULL,
	`reply` text,
	`created_at` integer DEFAULT '"2026-08-08T12:11:14.941Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-08-08T12:11:14.941Z"' NOT NULL,
	`job_id` text NOT NULL,
	`run_id` text,
	FOREIGN KEY (`job_id`) REFERENCES `job`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`run_id`) REFERENCES `run`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_execution`("id", "status", "reply", "created_at", "updated_at", "job_id", "run_id") SELECT "id", "status", "reply", "created_at", "updated_at", "job_id", "run_id" FROM `execution`;--> statement-breakpoint
DROP TABLE `execution`;--> statement-breakpoint
ALTER TABLE `__new_execution` RENAME TO `execution`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `execution_id_unique` ON `execution` (`id`);--> statement-breakpoint
CREATE TABLE `__new_queue` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`callback_url` text NOT NULL,
	`retry_count` integer DEFAULT 3 NOT NULL,
	`response_wait_time_ms` text DEFAULT 'undefined' NOT NULL,
	`created_at` integer DEFAULT '"2026-08-08T12:11:14.941Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-08-08T12:11:14.941Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_queue`("id", "name", "callback_url", "retry_count", "response_wait_time_ms", "created_at", "updated_at") SELECT "id", "name", "callback_url", "retry_count", "response_wait_time_ms", "created_at", "updated_at" FROM `queue`;--> statement-breakpoint
DROP TABLE `queue`;--> statement-breakpoint
ALTER TABLE `__new_queue` RENAME TO `queue`;--> statement-breakpoint
CREATE UNIQUE INDEX `queue_id_unique` ON `queue` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `queue_name_unique` ON `queue` (`name`);--> statement-breakpoint
CREATE TABLE `__new_job` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`type` text DEFAULT 'SINGLE' NOT NULL,
	`status` text DEFAULT 'IDLE' NOT NULL,
	`next_execution` integer,
	`last_execution` integer,
	`cron_expression` text,
	`current_retry_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT '"2026-08-08T12:11:14.941Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-08-08T12:11:14.941Z"' NOT NULL,
	`queue_id` text NOT NULL,
	FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_job`("id", "payload", "type", "status", "next_execution", "last_execution", "cron_expression", "current_retry_count", "created_at", "updated_at", "queue_id") SELECT "id", "payload", "type", "status", "next_execution", "last_execution", "cron_expression", "current_retry_count", "created_at", "updated_at", "queue_id" FROM `job`;--> statement-breakpoint
DROP TABLE `job`;--> statement-breakpoint
ALTER TABLE `__new_job` RENAME TO `job`;--> statement-breakpoint
CREATE UNIQUE INDEX `job_id_unique` ON `job` (`id`);--> statement-breakpoint
CREATE TABLE `__new_run` (
	`id` text PRIMARY KEY NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`run_time_start` integer NOT NULL,
	`run_time_end` integer,
	`created_at` integer DEFAULT '"2026-08-08T12:11:14.941Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-08-08T12:11:14.941Z"' NOT NULL,
	`execution_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_run`("id", "is_active", "run_time_start", "run_time_end", "created_at", "updated_at", "execution_id") SELECT "id", "is_active", "run_time_start", "run_time_end", "created_at", "updated_at", "execution_id" FROM `run`;--> statement-breakpoint
DROP TABLE `run`;--> statement-breakpoint
ALTER TABLE `__new_run` RENAME TO `run`;--> statement-breakpoint
CREATE UNIQUE INDEX `run_id_unique` ON `run` (`id`);