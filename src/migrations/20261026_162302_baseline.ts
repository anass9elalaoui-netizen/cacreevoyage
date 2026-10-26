import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Production and the dev branch were created with dev-mode push before migrations
  // existed; their schema already matches this baseline exactly (verified: 424/424
  // columns). Only a fresh, empty database runs the statements below.
  const existing = await db.execute(sql`SELECT to_regclass('public.users') AS t`)
  if (existing.rows?.[0]?.t) {
    payload.logger.info({ msg: 'baseline: schema already present, recording as applied' })
    return
  }

  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_destinations_scope" AS ENUM('national', 'international');
  CREATE TYPE "public"."enum_destinations_theme" AS ENUM('ocean', 'desert', 'mountain', 'culture', 'forest_nature');
  CREATE TYPE "public"."enum_tours_seasons" AS ENUM('spring', 'summer', 'autumn', 'winter');
  CREATE TYPE "public"."enum_tours_logistics_languages" AS ENUM('Français', 'English', 'العربية', 'Español');
  CREATE TYPE "public"."enum_tours_departure_dates_status" AS ENUM('Available', 'Limited', 'Full', 'On Request');
  CREATE TYPE "public"."enum_tours_tour_status" AS ENUM('available', 'coming_soon', 'sold_out');
  CREATE TYPE "public"."enum_tours_theme" AS ENUM('ocean', 'desert', 'mountain', 'culture', 'forest_nature');
  CREATE TYPE "public"."enum_tours_scope" AS ENUM('national', 'international');
  CREATE TYPE "public"."enum_tours_pricing_currency" AS ENUM('EUR', 'MAD', 'USD');
  CREATE TYPE "public"."enum_tours_logistics_difficulty" AS ENUM('Facile', 'Modéré', 'Exigeant', 'Difficile');
  CREATE TYPE "public"."enum_testimonials_platform" AS ENUM('Google', 'TripAdvisor', 'Facebook', 'Direct');
  CREATE TYPE "public"."enum_inquiries_travel_type" AS ENUM('Sur-Mesure', 'Groupe', 'Voyage de Noces', 'Family', 'Corporate');
  CREATE TYPE "public"."enum_inquiries_budget" AS ENUM('under-1k', '1k-2.5k', '2.5k-5k', '5k-10k', 'over-10k');
  CREATE TYPE "public"."enum_inquiries_source" AS ENUM('sur-mesure-form', 'tour-page', 'contact-page', 'whatsapp');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'in-progress', 'converted', 'lost');
  CREATE TYPE "public"."enum_articles_category" AS ENUM('guide', 'conseils', 'recits', 'actualites');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending_virement', 'virement_received', 'confirmed', 'cancelled');
  CREATE TYPE "public"."enum_site_settings_brand_identity_logo_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_hero_gallery_panels_link_type" AS ENUM('destination', 'tour');
  CREATE TYPE "public"."enum_partners_config_column_count" AS ENUM('3', '4');
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "destinations_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "destinations_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "destinations_highlights_locales" (
  	"highlight" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "destinations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"import_j_s_o_n" jsonb,
  	"slug" varchar NOT NULL,
  	"scope" "enum_destinations_scope" NOT NULL,
  	"theme" "enum_destinations_theme",
  	"header_media_id" integer,
  	"hero_video_id" integer,
  	"program_p_d_f_id" integer,
  	"is_featured" boolean DEFAULT false,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "destinations_locales" (
  	"title" varchar NOT NULL,
  	"tagline" varchar,
  	"description" varchar,
  	"best_time_to_visit" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tours_seasons" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_tours_seasons",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "tours_pricing_price_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_pricing_price_includes_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_pricing_price_excludes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_pricing_price_excludes_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_logistics_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_tours_logistics_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_departure_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"spots_left" numeric,
  	"status" "enum_tours_departure_dates_status" DEFAULT 'Available'
  );
  
  CREATE TABLE "tours_itinerary_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_image_id" integer
  );
  
  CREATE TABLE "tours_itinerary_blocks_locales" (
  	"day_title" varchar,
  	"day_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_story_days_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_story_days_activities_locales" (
  	"activity" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours_story_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_number" numeric NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "tours_story_days_locales" (
  	"title" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"import_j_s_o_n" jsonb,
  	"slug" varchar,
  	"departure_date" timestamp(3) with time zone,
  	"return_date" timestamp(3) with time zone,
  	"tour_status" "enum_tours_tour_status" DEFAULT 'available',
  	"theme" "enum_tours_theme",
  	"scope" "enum_tours_scope" NOT NULL,
  	"destination_id" integer,
  	"thumbnail_id" integer,
  	"hero_video_id" integer,
  	"program_p_d_f_id" integer,
  	"pricing_base_price" numeric,
  	"pricing_currency" "enum_tours_pricing_currency" DEFAULT 'EUR',
  	"pricing_deposit_percentage" numeric DEFAULT 30,
  	"logistics_duration_days" numeric,
  	"logistics_duration_nights" numeric,
  	"logistics_min_group_size" numeric DEFAULT 1,
  	"logistics_max_group_size" numeric DEFAULT 12,
  	"logistics_difficulty" "enum_tours_logistics_difficulty",
  	"seo_og_image_id" integer,
  	"is_available" boolean DEFAULT true,
  	"is_featured" boolean DEFAULT false,
  	"featured_order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tours_locales" (
  	"title" varchar NOT NULL,
  	"short_description" varchar,
  	"duration" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"logistics_departure_city" varchar DEFAULT 'Casablanca',
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"traveler_photo_id" integer,
  	"rating" numeric DEFAULT 5,
  	"tour_id" integer,
  	"destination_id" integer,
  	"media_id" integer,
  	"date" timestamp(3) with time zone,
  	"is_highlighted" boolean DEFAULT false,
  	"platform" "enum_testimonials_platform",
  	"video_reel_id" integer,
  	"client_name" varchar,
  	"tour_reference" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials_locales" (
  	"traveler_name" varchar,
  	"traveler_origin" varchar,
  	"testimonial_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"nationality" varchar,
  	"travel_type" "enum_inquiries_travel_type",
  	"budget" "enum_inquiries_budget",
  	"travelers_count" numeric,
  	"preferred_dates" varchar,
  	"flexible_dates" boolean DEFAULT false,
  	"message" varchar,
  	"source" "enum_inquiries_source",
  	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"internal_notes" varchar,
  	"destination_wish" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer,
  	"destinations_id" integer
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"cover_image_id" integer,
  	"category" "enum_articles_category",
  	"read_time_minutes" numeric,
  	"published_at" timestamp(3) with time zone,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destinations_id" integer,
  	"tours_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tour_id_id" integer NOT NULL,
  	"client_name" varchar NOT NULL,
  	"client_phone" varchar NOT NULL,
  	"client_email" varchar,
  	"passengers" numeric DEFAULT 1 NOT NULL,
  	"travel_date" timestamp(3) with time zone,
  	"special_requests" varchar,
  	"status" "enum_orders_status" DEFAULT 'pending_virement' NOT NULL,
  	"total_amount" numeric,
  	"payment_proof_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"destinations_id" integer,
  	"tours_id" integer,
  	"testimonials_id" integer,
  	"inquiries_id" integer,
  	"articles_id" integer,
  	"media_id" integer,
  	"orders_id" integer,
  	"faq_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_identity_logo_image_id" integer,
  	"brand_identity_logo_height" numeric DEFAULT 28,
  	"brand_identity_logo_position" "enum_site_settings_brand_identity_logo_position" DEFAULT 'left',
  	"brand_identity_favicon_image_id" integer,
  	"contact_phone" varchar DEFAULT '+212661373347',
  	"whatsapp_number" varchar DEFAULT '+212661373347' NOT NULL,
  	"contact_email" varchar DEFAULT 'contact@cacreevoyage.com',
  	"instagram_url" varchar,
  	"facebook_url" varchar,
  	"tiktok_url" varchar,
  	"youtube_url" varchar,
  	"seo_defaults_default_og_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"review_badges_google_reviews_enabled" boolean DEFAULT true,
  	"review_badges_google_reviews_rating" varchar DEFAULT '4.9',
  	"review_badges_google_reviews_review_count" varchar DEFAULT '120+',
  	"review_badges_google_reviews_profile_url" varchar DEFAULT 'https://g.co/kgs/cacreevoyage',
  	"review_badges_trustpilot_enabled" boolean DEFAULT true,
  	"review_badges_trustpilot_rating" varchar DEFAULT '4.8',
  	"review_badges_trustpilot_review_count" varchar DEFAULT '85+',
  	"review_badges_trustpilot_profile_url" varchar DEFAULT 'https://trustpilot.com/review/cacreevoyage.com',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"brand_identity_logo_text" varchar DEFAULT 'Ça Crée Voyage',
  	"address" varchar,
  	"homepage_hero_headline" varchar DEFAULT 'Voyages d''Exception, Créés Pour Vous',
  	"homepage_hero_subheadline" varchar DEFAULT 'Laissez-vous guider par nos experts pour vivre des expériences uniques et sur-mesure, aux quatre coins du monde.',
  	"homepage_hero_cta_label" varchar DEFAULT 'Créer Mon Voyage',
  	"seo_defaults_default_title" varchar DEFAULT 'Ça Crée Voyage — Voyages de Luxe Sur-Mesure',
  	"seo_defaults_default_description" varchar DEFAULT 'Circuits et voyages sur mesure. Laissez-vous inspirer par nos destinations d''exception.',
  	"review_badges_google_reviews_quote" varchar DEFAULT 'Une expérience inoubliable !',
  	"review_badges_trustpilot_quote" varchar DEFAULT 'Service exceptionnel, voyage parfait',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payment_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"bank_name" varchar DEFAULT 'Attijariwafa Bank' NOT NULL,
  	"account_holder" varchar DEFAULT 'Ça Crée Voyage SARL' NOT NULL,
  	"rib_number" varchar NOT NULL,
  	"iban" varchar,
  	"qr_code_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payment_settings_locales" (
  	"payment_instructions" jsonb DEFAULT '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Veuillez effectuer un virement sur le compte indiqué ci-dessus. Envoyez-nous la preuve de paiement via WhatsApp pour confirmation rapide.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'::jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "hero_gallery_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_hero_gallery_panels_link_type" DEFAULT 'destination' NOT NULL,
  	"destination_id" integer,
  	"tour_id" integer,
  	"poster_image_id" integer NOT NULL,
  	"background_video_id" integer NOT NULL
  );
  
  CREATE TABLE "hero_gallery_panels_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "hero_gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "hero_portal_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"asset_base_url" varchar DEFAULT '/hero-frames',
  	"frame_count" numeric DEFAULT 142,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "hero_portal_config_locales" (
  	"text_phase1_title" varchar DEFAULT 'L''art du voyage sur-mesure.',
  	"text_phase1_sub" varchar DEFAULT 'Chaque grand voyage commence par une porte fermée.',
  	"text_phase2_title" varchar DEFAULT 'Éveillez vos sens.',
  	"text_phase2_sub" varchar DEFAULT 'Un monde d''exceptions s''ouvre à vous.',
  	"text_phase3_title" varchar DEFAULT 'Prenez votre envol.',
  	"cta_label" varchar DEFAULT 'Créer Mon Voyage',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "subpage_heroes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"destinations_hero_background_media_id" integer,
  	"destinations_hero_cta_href" varchar DEFAULT '/destinations/international',
  	"destinations_hero_badge_stat1_number" varchar DEFAULT '45+',
  	"destinations_hero_badge_stat2_number" varchar DEFAULT '500+',
  	"tours_hero_background_media_id" integer,
  	"tours_hero_cta_href" varchar DEFAULT '/sur-mesure',
  	"tours_hero_badge_stat1_number" varchar DEFAULT '8',
  	"tours_hero_badge_stat2_number" varchar DEFAULT '98%',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "subpage_heroes_locales" (
  	"destinations_hero_title" varchar DEFAULT 'Explorez nos Destinations',
  	"destinations_hero_subtitle" varchar DEFAULT 'Du Maroc aux quatre coins du monde',
  	"destinations_hero_description" varchar DEFAULT 'Des expériences uniques, méticuleusement conçues pour vous.',
  	"destinations_hero_cta_label" varchar DEFAULT 'Explorer',
  	"destinations_hero_badge_stat1_label" varchar DEFAULT 'Destinations',
  	"destinations_hero_badge_stat2_label" varchar DEFAULT 'Voyageurs',
  	"tours_hero_title" varchar DEFAULT 'Nos Circuits',
  	"tours_hero_subtitle" varchar DEFAULT 'Collection Privée',
  	"tours_hero_description" varchar DEFAULT 'Découvrez notre collection de circuits et voyages d''exception.',
  	"tours_hero_cta_label" varchar DEFAULT 'Créer Mon Voyage',
  	"tours_hero_badge_stat1_label" varchar DEFAULT 'Années',
  	"tours_hero_badge_stat2_label" varchar DEFAULT 'Satisfaits',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "hero_switcher_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"subtitle" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"background_video_id" integer NOT NULL
  );
  
  CREATE TABLE "hero_switcher" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "partners_config_partners_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL
  );
  
  CREATE TABLE "partners_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"column_count" "enum_partners_config_column_count" DEFAULT '3' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "partners_config_locales" (
  	"title" varchar DEFAULT 'Nos Partenaires d''Excellence' NOT NULL,
  	"description" varchar DEFAULT 'Nous collaborons avec les leaders mondiaux de l''aviation, de l''hôtellerie et de l''assurance pour vous garantir un voyage en toute sérénité.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "activities_config_activities_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "activities_config_activities_list_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "activities_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "activities_config_locales" (
  	"section_title" varchar DEFAULT 'Activités & Aventures' NOT NULL,
  	"section_subtitle" varchar DEFAULT 'Vivez l''extraordinaire' NOT NULL,
  	"section_description" varchar DEFAULT 'Explorez nos activités d''aventure soigneusement sélectionnées à travers le Maroc et au-delà. Du quad dans les dunes de Merzouga au rafting dans les gorges de l''Atlas, chaque expérience est conçue pour créer des souvenirs inoubliables.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "destinations_gallery" ADD CONSTRAINT "destinations_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_gallery" ADD CONSTRAINT "destinations_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_highlights" ADD CONSTRAINT "destinations_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_highlights_locales" ADD CONSTRAINT "destinations_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_header_media_id_media_id_fk" FOREIGN KEY ("header_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_program_p_d_f_id_media_id_fk" FOREIGN KEY ("program_p_d_f_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_locales" ADD CONSTRAINT "destinations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_seasons" ADD CONSTRAINT "tours_seasons_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_gallery" ADD CONSTRAINT "tours_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_gallery" ADD CONSTRAINT "tours_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_pricing_price_includes" ADD CONSTRAINT "tours_pricing_price_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_pricing_price_includes_locales" ADD CONSTRAINT "tours_pricing_price_includes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_pricing_price_includes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_pricing_price_excludes" ADD CONSTRAINT "tours_pricing_price_excludes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_pricing_price_excludes_locales" ADD CONSTRAINT "tours_pricing_price_excludes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_pricing_price_excludes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_logistics_languages" ADD CONSTRAINT "tours_logistics_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_departure_dates" ADD CONSTRAINT "tours_departure_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_itinerary_blocks" ADD CONSTRAINT "tours_itinerary_blocks_day_image_id_media_id_fk" FOREIGN KEY ("day_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_itinerary_blocks" ADD CONSTRAINT "tours_itinerary_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_itinerary_blocks_locales" ADD CONSTRAINT "tours_itinerary_blocks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_itinerary_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_story_days_activities" ADD CONSTRAINT "tours_story_days_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_story_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_story_days_activities_locales" ADD CONSTRAINT "tours_story_days_activities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_story_days_activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_story_days" ADD CONSTRAINT "tours_story_days_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_story_days" ADD CONSTRAINT "tours_story_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_story_days_locales" ADD CONSTRAINT "tours_story_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours_story_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_program_p_d_f_id_media_id_fk" FOREIGN KEY ("program_p_d_f_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_locales" ADD CONSTRAINT "tours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_traveler_photo_id_media_id_fk" FOREIGN KEY ("traveler_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_video_reel_id_media_id_fk" FOREIGN KEY ("video_reel_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_tour_id_id_tours_id_fk" FOREIGN KEY ("tour_id_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_proof_id_media_id_fk" FOREIGN KEY ("payment_proof_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_locales" ADD CONSTRAINT "faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_brand_identity_logo_image_id_media_id_fk" FOREIGN KEY ("brand_identity_logo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_brand_identity_favicon_image_id_media_id_fk" FOREIGN KEY ("brand_identity_favicon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_defaults_default_og_image_id_media_id_fk" FOREIGN KEY ("seo_defaults_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payment_settings" ADD CONSTRAINT "payment_settings_qr_code_image_id_media_id_fk" FOREIGN KEY ("qr_code_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payment_settings_locales" ADD CONSTRAINT "payment_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payment_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_gallery_panels" ADD CONSTRAINT "hero_gallery_panels_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_gallery_panels" ADD CONSTRAINT "hero_gallery_panels_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_gallery_panels" ADD CONSTRAINT "hero_gallery_panels_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_gallery_panels" ADD CONSTRAINT "hero_gallery_panels_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_gallery_panels" ADD CONSTRAINT "hero_gallery_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_gallery_panels_locales" ADD CONSTRAINT "hero_gallery_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_gallery_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_portal_config_locales" ADD CONSTRAINT "hero_portal_config_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_portal_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subpage_heroes" ADD CONSTRAINT "subpage_heroes_destinations_hero_background_media_id_media_id_fk" FOREIGN KEY ("destinations_hero_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subpage_heroes" ADD CONSTRAINT "subpage_heroes_tours_hero_background_media_id_media_id_fk" FOREIGN KEY ("tours_hero_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subpage_heroes_locales" ADD CONSTRAINT "subpage_heroes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subpage_heroes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_switcher_slides" ADD CONSTRAINT "hero_switcher_slides_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_switcher_slides" ADD CONSTRAINT "hero_switcher_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_switcher"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_config_partners_list" ADD CONSTRAINT "partners_config_partners_list_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_config_partners_list" ADD CONSTRAINT "partners_config_partners_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_config_locales" ADD CONSTRAINT "partners_config_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_config_activities_list" ADD CONSTRAINT "activities_config_activities_list_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities_config_activities_list" ADD CONSTRAINT "activities_config_activities_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_config_activities_list_locales" ADD CONSTRAINT "activities_config_activities_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities_config_activities_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities_config_locales" ADD CONSTRAINT "activities_config_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activities_config"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "destinations_gallery_order_idx" ON "destinations_gallery" USING btree ("_order");
  CREATE INDEX "destinations_gallery_parent_id_idx" ON "destinations_gallery" USING btree ("_parent_id");
  CREATE INDEX "destinations_gallery_image_idx" ON "destinations_gallery" USING btree ("image_id");
  CREATE INDEX "destinations_highlights_order_idx" ON "destinations_highlights" USING btree ("_order");
  CREATE INDEX "destinations_highlights_parent_id_idx" ON "destinations_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "destinations_highlights_locales_locale_parent_id_unique" ON "destinations_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations" USING btree ("slug");
  CREATE INDEX "destinations_header_media_idx" ON "destinations" USING btree ("header_media_id");
  CREATE INDEX "destinations_hero_video_idx" ON "destinations" USING btree ("hero_video_id");
  CREATE INDEX "destinations_program_p_d_f_idx" ON "destinations" USING btree ("program_p_d_f_id");
  CREATE INDEX "destinations_seo_seo_og_image_idx" ON "destinations" USING btree ("seo_og_image_id");
  CREATE INDEX "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
  CREATE INDEX "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
  CREATE UNIQUE INDEX "destinations_locales_locale_parent_id_unique" ON "destinations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_seasons_order_idx" ON "tours_seasons" USING btree ("order");
  CREATE INDEX "tours_seasons_parent_idx" ON "tours_seasons" USING btree ("parent_id");
  CREATE INDEX "tours_gallery_order_idx" ON "tours_gallery" USING btree ("_order");
  CREATE INDEX "tours_gallery_parent_id_idx" ON "tours_gallery" USING btree ("_parent_id");
  CREATE INDEX "tours_gallery_image_idx" ON "tours_gallery" USING btree ("image_id");
  CREATE INDEX "tours_pricing_price_includes_order_idx" ON "tours_pricing_price_includes" USING btree ("_order");
  CREATE INDEX "tours_pricing_price_includes_parent_id_idx" ON "tours_pricing_price_includes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_pricing_price_includes_locales_locale_parent_id_unique" ON "tours_pricing_price_includes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_pricing_price_excludes_order_idx" ON "tours_pricing_price_excludes" USING btree ("_order");
  CREATE INDEX "tours_pricing_price_excludes_parent_id_idx" ON "tours_pricing_price_excludes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_pricing_price_excludes_locales_locale_parent_id_unique" ON "tours_pricing_price_excludes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_logistics_languages_order_idx" ON "tours_logistics_languages" USING btree ("order");
  CREATE INDEX "tours_logistics_languages_parent_idx" ON "tours_logistics_languages" USING btree ("parent_id");
  CREATE INDEX "tours_departure_dates_order_idx" ON "tours_departure_dates" USING btree ("_order");
  CREATE INDEX "tours_departure_dates_parent_id_idx" ON "tours_departure_dates" USING btree ("_parent_id");
  CREATE INDEX "tours_itinerary_blocks_order_idx" ON "tours_itinerary_blocks" USING btree ("_order");
  CREATE INDEX "tours_itinerary_blocks_parent_id_idx" ON "tours_itinerary_blocks" USING btree ("_parent_id");
  CREATE INDEX "tours_itinerary_blocks_day_image_idx" ON "tours_itinerary_blocks" USING btree ("day_image_id");
  CREATE UNIQUE INDEX "tours_itinerary_blocks_locales_locale_parent_id_unique" ON "tours_itinerary_blocks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_story_days_activities_order_idx" ON "tours_story_days_activities" USING btree ("_order");
  CREATE INDEX "tours_story_days_activities_parent_id_idx" ON "tours_story_days_activities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tours_story_days_activities_locales_locale_parent_id_unique" ON "tours_story_days_activities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_story_days_order_idx" ON "tours_story_days" USING btree ("_order");
  CREATE INDEX "tours_story_days_parent_id_idx" ON "tours_story_days" USING btree ("_parent_id");
  CREATE INDEX "tours_story_days_media_idx" ON "tours_story_days" USING btree ("media_id");
  CREATE UNIQUE INDEX "tours_story_days_locales_locale_parent_id_unique" ON "tours_story_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_destination_idx" ON "tours" USING btree ("destination_id");
  CREATE INDEX "tours_thumbnail_idx" ON "tours" USING btree ("thumbnail_id");
  CREATE INDEX "tours_hero_video_idx" ON "tours" USING btree ("hero_video_id");
  CREATE INDEX "tours_program_p_d_f_idx" ON "tours" USING btree ("program_p_d_f_id");
  CREATE INDEX "tours_seo_seo_og_image_idx" ON "tours" USING btree ("seo_og_image_id");
  CREATE INDEX "tours_updated_at_idx" ON "tours" USING btree ("updated_at");
  CREATE INDEX "tours_created_at_idx" ON "tours" USING btree ("created_at");
  CREATE UNIQUE INDEX "tours_locales_locale_parent_id_unique" ON "tours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "testimonials_traveler_photo_idx" ON "testimonials" USING btree ("traveler_photo_id");
  CREATE INDEX "testimonials_tour_idx" ON "testimonials" USING btree ("tour_id");
  CREATE INDEX "testimonials_destination_idx" ON "testimonials" USING btree ("destination_id");
  CREATE INDEX "testimonials_media_idx" ON "testimonials" USING btree ("media_id");
  CREATE INDEX "testimonials_video_reel_idx" ON "testimonials" USING btree ("video_reel_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "inquiries_rels_order_idx" ON "inquiries_rels" USING btree ("order");
  CREATE INDEX "inquiries_rels_parent_idx" ON "inquiries_rels" USING btree ("parent_id");
  CREATE INDEX "inquiries_rels_path_idx" ON "inquiries_rels" USING btree ("path");
  CREATE INDEX "inquiries_rels_tours_id_idx" ON "inquiries_rels" USING btree ("tours_id");
  CREATE INDEX "inquiries_rels_destinations_id_idx" ON "inquiries_rels" USING btree ("destinations_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_cover_image_idx" ON "articles" USING btree ("cover_image_id");
  CREATE INDEX "articles_seo_seo_og_image_idx" ON "articles" USING btree ("seo_og_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_destinations_id_idx" ON "articles_rels" USING btree ("destinations_id");
  CREATE INDEX "articles_rels_tours_id_idx" ON "articles_rels" USING btree ("tours_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "orders_tour_id_idx" ON "orders" USING btree ("tour_id_id");
  CREATE INDEX "orders_payment_proof_idx" ON "orders" USING btree ("payment_proof_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE UNIQUE INDEX "faq_locales_locale_parent_id_unique" ON "faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_destinations_id_idx" ON "payload_locked_documents_rels" USING btree ("destinations_id");
  CREATE INDEX "payload_locked_documents_rels_tours_id_idx" ON "payload_locked_documents_rels" USING btree ("tours_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_brand_identity_brand_identity_logo_image_idx" ON "site_settings" USING btree ("brand_identity_logo_image_id");
  CREATE INDEX "site_settings_brand_identity_brand_identity_favicon_image_idx" ON "site_settings" USING btree ("brand_identity_favicon_image_id");
  CREATE INDEX "site_settings_seo_defaults_seo_defaults_default_og_image_idx" ON "site_settings" USING btree ("seo_defaults_default_og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "payment_settings_qr_code_image_idx" ON "payment_settings" USING btree ("qr_code_image_id");
  CREATE UNIQUE INDEX "payment_settings_locales_locale_parent_id_unique" ON "payment_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hero_gallery_panels_order_idx" ON "hero_gallery_panels" USING btree ("_order");
  CREATE INDEX "hero_gallery_panels_parent_id_idx" ON "hero_gallery_panels" USING btree ("_parent_id");
  CREATE INDEX "hero_gallery_panels_destination_idx" ON "hero_gallery_panels" USING btree ("destination_id");
  CREATE INDEX "hero_gallery_panels_tour_idx" ON "hero_gallery_panels" USING btree ("tour_id");
  CREATE INDEX "hero_gallery_panels_poster_image_idx" ON "hero_gallery_panels" USING btree ("poster_image_id");
  CREATE INDEX "hero_gallery_panels_background_video_idx" ON "hero_gallery_panels" USING btree ("background_video_id");
  CREATE UNIQUE INDEX "hero_gallery_panels_locales_locale_parent_id_unique" ON "hero_gallery_panels_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "hero_portal_config_locales_locale_parent_id_unique" ON "hero_portal_config_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "subpage_heroes_destinations_hero_destinations_hero_background_media_idx" ON "subpage_heroes" USING btree ("destinations_hero_background_media_id");
  CREATE INDEX "subpage_heroes_tours_hero_tours_hero_background_media_idx" ON "subpage_heroes" USING btree ("tours_hero_background_media_id");
  CREATE UNIQUE INDEX "subpage_heroes_locales_locale_parent_id_unique" ON "subpage_heroes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hero_switcher_slides_order_idx" ON "hero_switcher_slides" USING btree ("_order");
  CREATE INDEX "hero_switcher_slides_parent_id_idx" ON "hero_switcher_slides" USING btree ("_parent_id");
  CREATE INDEX "hero_switcher_slides_background_video_idx" ON "hero_switcher_slides" USING btree ("background_video_id");
  CREATE INDEX "partners_config_partners_list_order_idx" ON "partners_config_partners_list" USING btree ("_order");
  CREATE INDEX "partners_config_partners_list_parent_id_idx" ON "partners_config_partners_list" USING btree ("_parent_id");
  CREATE INDEX "partners_config_partners_list_logo_idx" ON "partners_config_partners_list" USING btree ("logo_id");
  CREATE UNIQUE INDEX "partners_config_locales_locale_parent_id_unique" ON "partners_config_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "activities_config_activities_list_order_idx" ON "activities_config_activities_list" USING btree ("_order");
  CREATE INDEX "activities_config_activities_list_parent_id_idx" ON "activities_config_activities_list" USING btree ("_parent_id");
  CREATE INDEX "activities_config_activities_list_image_idx" ON "activities_config_activities_list" USING btree ("image_id");
  CREATE UNIQUE INDEX "activities_config_activities_list_locales_locale_parent_id_unique" ON "activities_config_activities_list_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "activities_config_locales_locale_parent_id_unique" ON "activities_config_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users" CASCADE;
  DROP TABLE "destinations_gallery" CASCADE;
  DROP TABLE "destinations_highlights" CASCADE;
  DROP TABLE "destinations_highlights_locales" CASCADE;
  DROP TABLE "destinations" CASCADE;
  DROP TABLE "destinations_locales" CASCADE;
  DROP TABLE "tours_seasons" CASCADE;
  DROP TABLE "tours_gallery" CASCADE;
  DROP TABLE "tours_pricing_price_includes" CASCADE;
  DROP TABLE "tours_pricing_price_includes_locales" CASCADE;
  DROP TABLE "tours_pricing_price_excludes" CASCADE;
  DROP TABLE "tours_pricing_price_excludes_locales" CASCADE;
  DROP TABLE "tours_logistics_languages" CASCADE;
  DROP TABLE "tours_departure_dates" CASCADE;
  DROP TABLE "tours_itinerary_blocks" CASCADE;
  DROP TABLE "tours_itinerary_blocks_locales" CASCADE;
  DROP TABLE "tours_story_days_activities" CASCADE;
  DROP TABLE "tours_story_days_activities_locales" CASCADE;
  DROP TABLE "tours_story_days" CASCADE;
  DROP TABLE "tours_story_days_locales" CASCADE;
  DROP TABLE "tours" CASCADE;
  DROP TABLE "tours_locales" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "inquiries_rels" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "faq_locales" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "payment_settings" CASCADE;
  DROP TABLE "payment_settings_locales" CASCADE;
  DROP TABLE "hero_gallery_panels" CASCADE;
  DROP TABLE "hero_gallery_panels_locales" CASCADE;
  DROP TABLE "hero_gallery" CASCADE;
  DROP TABLE "hero_portal_config" CASCADE;
  DROP TABLE "hero_portal_config_locales" CASCADE;
  DROP TABLE "subpage_heroes" CASCADE;
  DROP TABLE "subpage_heroes_locales" CASCADE;
  DROP TABLE "hero_switcher_slides" CASCADE;
  DROP TABLE "hero_switcher" CASCADE;
  DROP TABLE "partners_config_partners_list" CASCADE;
  DROP TABLE "partners_config" CASCADE;
  DROP TABLE "partners_config_locales" CASCADE;
  DROP TABLE "activities_config_activities_list" CASCADE;
  DROP TABLE "activities_config_activities_list_locales" CASCADE;
  DROP TABLE "activities_config" CASCADE;
  DROP TABLE "activities_config_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_destinations_scope";
  DROP TYPE "public"."enum_destinations_theme";
  DROP TYPE "public"."enum_tours_seasons";
  DROP TYPE "public"."enum_tours_logistics_languages";
  DROP TYPE "public"."enum_tours_departure_dates_status";
  DROP TYPE "public"."enum_tours_tour_status";
  DROP TYPE "public"."enum_tours_theme";
  DROP TYPE "public"."enum_tours_scope";
  DROP TYPE "public"."enum_tours_pricing_currency";
  DROP TYPE "public"."enum_tours_logistics_difficulty";
  DROP TYPE "public"."enum_testimonials_platform";
  DROP TYPE "public"."enum_inquiries_travel_type";
  DROP TYPE "public"."enum_inquiries_budget";
  DROP TYPE "public"."enum_inquiries_source";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_articles_category";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_site_settings_brand_identity_logo_position";
  DROP TYPE "public"."enum_hero_gallery_panels_link_type";
  DROP TYPE "public"."enum_partners_config_column_count";`)
}
