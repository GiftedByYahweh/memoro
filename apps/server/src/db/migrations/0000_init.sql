CREATE TYPE "public"."media_status" AS ENUM('pending', 'ready', 'failed');
CREATE TYPE "public"."media_type" AS ENUM('image', 'video');
CREATE TYPE "public"."collection_visibility" AS ENUM('public', 'private');
CREATE TYPE "public"."verification_code_type" AS ENUM('registration', 'password_reset');
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"username" varchar(50) NOT NULL,
	"sex" varchar(20),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"user_agent" text,
	"ip_address" varchar(45),
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);

CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"file_key" varchar(512) NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"status" "media_status" NOT NULL,
	"type" "media_type" NOT NULL,
	"capture_time" timestamp with time zone,
	"timezone" varchar(50),
	"latitude" double precision,
	"longitude" double precision,
	"camera_model" varchar(255),
	"width" integer,
	"height" integer,
	"size_bytes" bigint,
	"encryption_algorithm" varchar(16),
	"original_iv" varchar(32),
	"duration" double precision,
	"video_codec" varchar(32),
	"has_thumbnail" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_file_key_unique" UNIQUE("file_key")
);

CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(5000),
	"visibility" "collection_visibility" DEFAULT 'private' NOT NULL,
	"wallpaper_media_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "media_collections" (
	"media_id" uuid NOT NULL,
	"collection_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_collections_media_id_collection_id_pk" PRIMARY KEY("media_id","collection_id")
);

CREATE TABLE "collection_labels" (
	"collection_id" uuid NOT NULL,
	"label_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collection_labels_collection_id_label_id_pk" PRIMARY KEY("collection_id","label_id")
);

CREATE TABLE "verification_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(6) NOT NULL,
	"type" "verification_code_type" NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "media" ADD CONSTRAINT "media_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "collections" ADD CONSTRAINT "collections_wallpaper_media_id_media_id_fk" FOREIGN KEY ("wallpaper_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "labels" ADD CONSTRAINT "labels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "media_collections" ADD CONSTRAINT "media_collections_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "media_collections" ADD CONSTRAINT "media_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "collection_labels" ADD CONSTRAINT "collection_labels_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "collection_labels" ADD CONSTRAINT "collection_labels_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("id") ON DELETE restrict ON UPDATE no action;