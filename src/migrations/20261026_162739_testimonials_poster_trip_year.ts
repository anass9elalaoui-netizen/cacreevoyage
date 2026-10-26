import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" ADD COLUMN "video_poster_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "trip_year" numeric;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "testimonials_video_poster_idx" ON "testimonials" USING btree ("video_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_video_poster_id_media_id_fk";
  
  DROP INDEX "testimonials_video_poster_idx";
  ALTER TABLE "testimonials" DROP COLUMN "video_poster_id";
  ALTER TABLE "testimonials" DROP COLUMN "trip_year";`)
}
