CREATE TABLE `execution` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'RUNNING' NOT NULL,
	`reply` text,
	`created_at` integer DEFAULT '"2026-08-08T12:08:01.356Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-08-08T12:08:01.356Z"' NOT NULL,
	`job_id` text NOT NULL,
	`run_id` text,
	FOREIGN KEY (`job_id`) REFERENCES `job`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`run_id`) REFERENCES `run`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `execution_id_unique` ON `execution` (`id`);--> statement-breakpoint
CREATE TABLE `queue` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`callback_url` text NOT NULL,
	`retry_count` integer DEFAULT 3 NOT NULL,
	`response_wait_time_ms` text DEFAULT 'undefined' NOT NULL,
	`created_at` integer DEFAULT '"2026-08-08T12:08:01.356Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-08-08T12:08:01.356Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `queue_id_unique` ON `queue` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `queue_name_unique` ON `queue` (`name`);--> statement-breakpoint
CREATE TABLE `job` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`type` text DEFAULT 'SINGLE' NOT NULL,
	`status` text DEFAULT 'IDLE' NOT NULL,
	`next_execution` integer,
	`last_execution` integer,
	`cron_expression` text,
	`current_retry_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT '"2026-08-08T12:08:01.356Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-08-08T12:08:01.356Z"' NOT NULL,
	`queue_id` text NOT NULL,
	FOREIGN KEY (`queue_id`) REFERENCES `queue`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `job_id_unique` ON `job` (`id`);--> statement-breakpoint
CREATE TABLE `run` (
	`id` text PRIMARY KEY NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`run_time_start` integer NOT NULL,
	`run_time_end` integer,
	`created_at` integer DEFAULT '"2026-08-08T12:08:01.356Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-08-08T12:08:01.356Z"' NOT NULL,
	`execution_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `run_id_unique` ON `run` (`id`);