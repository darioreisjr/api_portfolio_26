-- AlterTable
ALTER TABLE "categories" ADD COLUMN "slug" TEXT;

-- Backfill slug with name for existing rows (temporary)
UPDATE "categories" SET "slug" = "name" WHERE "slug" IS NULL;

-- Make column NOT NULL
ALTER TABLE "categories" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
