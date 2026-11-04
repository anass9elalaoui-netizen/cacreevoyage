import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero_gallery_panels" ADD COLUMN "background_video_mobile_id" integer;
  ALTER TABLE "hero_gallery_panels" ADD CONSTRAINT "hero_gallery_panels_background_video_mobile_id_media_id_fk" FOREIGN KEY ("background_video_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "hero_gallery_panels_background_video_mobile_idx" ON "hero_gallery_panels" USING btree ("background_video_mobile_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hero_gallery_panels" DROP CONSTRAINT "hero_gallery_panels_background_video_mobile_id_media_id_fk";
  
  DROP INDEX "hero_gallery_panels_background_video_mobile_idx";
  ALTER TABLE "hero_gallery_panels" DROP COLUMN "background_video_mobile_id";`)
}
