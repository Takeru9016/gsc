CREATE TYPE "achievement_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "booking_status" AS ENUM('pending', 'reviewed', 'confirmed', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TYPE "booking_type" AS ENUM('room', 'banquet', 'ground', 'coaching');--> statement-breakpoint
CREATE TYPE "contact_status" AS ENUM('pending', 'reviewed', 'responded', 'closed');--> statement-breakpoint
CREATE TYPE "contact_type" AS ENUM('general', 'membership', 'event', 'partnership', 'media', 'leagues');--> statement-breakpoint
CREATE TYPE "membership_status" AS ENUM('pending', 'reviewed', 'contacted', 'closed');--> statement-breakpoint
CREATE TYPE "partner_status" AS ENUM('pending', 'reviewing', 'negotiating', 'active', 'declined');--> statement-breakpoint
CREATE TABLE "achievement_submissions" (
	"achievement_title" varchar(300) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"email" varchar(300) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"image_url" varchar(500),
	"level" varchar(50) NOT NULL,
	"member_name" varchar(200) NOT NULL,
	"notes" text,
	"phone" varchar(20),
	"sport" varchar(100) NOT NULL,
	"status" "achievement_status" DEFAULT 'pending'::"achievement_status" NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"year" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_inquiries" (
	"booking_type" "booking_type" NOT NULL,
	"check_in" date,
	"check_out" date,
	"coaching_level" varchar(50),
	"coaching_sport" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(300) NOT NULL,
	"event_date" date,
	"event_type" varchar(100),
	"ground_date" date,
	"ground_time" varchar(50),
	"guest_count" integer,
	"guests" integer,
	"hall_preference" varchar(100),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"message" text,
	"name" varchar(200) NOT NULL,
	"notes" text,
	"phone" varchar(20) NOT NULL,
	"room_type" varchar(100),
	"sport" varchar(100),
	"status" "booking_status" DEFAULT 'pending'::"booking_status" NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_inquiries" (
	"contact_type" "contact_type" DEFAULT 'general'::"contact_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(300) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"message" text NOT NULL,
	"name" varchar(200) NOT NULL,
	"notes" text,
	"phone" varchar(20),
	"status" "contact_status" DEFAULT 'pending'::"contact_status" NOT NULL,
	"subject" varchar(300) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership_inquiries" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(300) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"membership_type" varchar(50) NOT NULL,
	"message" text,
	"name" varchar(200) NOT NULL,
	"notes" text,
	"phone" varchar(20) NOT NULL,
	"status" "membership_status" DEFAULT 'pending'::"membership_status" NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_inquiries" (
	"company_name" varchar(300) NOT NULL,
	"contact_name" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(300) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"message" text,
	"notes" text,
	"partnership_type" varchar(100),
	"phone" varchar(20) NOT NULL,
	"status" "partner_status" DEFAULT 'pending'::"partner_status" NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
