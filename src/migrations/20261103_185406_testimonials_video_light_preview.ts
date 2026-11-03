import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" ADD COLUMN "video_light_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "video_preview_id" integer;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_video_light_id_media_id_fk" FOREIGN KEY ("video_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_video_preview_id_media_id_fk" FOREIGN KEY ("video_preview_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "testimonials_video_light_idx" ON "testimonials" USING btree ("video_light_id");
  CREATE INDEX "testimonials_video_preview_idx" ON "testimonials" USING btree ("video_preview_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_video_light_id_media_id_fk";
  
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_video_preview_id_media_id_fk";
  
  DROP INDEX "testimonials_video_light_idx";
  DROP INDEX "testimonials_video_preview_idx";
  ALTER TABLE "testimonials" DROP COLUMN "video_light_id";
  ALTER TABLE "testimonials" DROP COLUMN "video_preview_id";`)
}
