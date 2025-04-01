ALTER TABLE "users" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "resetToken" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_token_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");