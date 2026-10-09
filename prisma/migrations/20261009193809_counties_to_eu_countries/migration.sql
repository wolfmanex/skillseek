-- Locations switch from Estonian counties to EU countries (ISO 3166-1 alpha-2 codes).
-- All existing data was Estonian, so every county becomes "EE".

ALTER TABLE "Profile" RENAME COLUMN "county" TO "country";
ALTER TABLE "Profile" RENAME COLUMN "serviceCounties" TO "serviceCountries";
ALTER TABLE "Posting" RENAME COLUMN "county" TO "country";
ALTER INDEX "Posting_status_county_idx" RENAME TO "Posting_status_country_idx";

UPDATE "Profile" SET "country" = 'EE' WHERE "country" IS NOT NULL;
UPDATE "Profile" SET "serviceCountries" = ARRAY['EE'] WHERE cardinality("serviceCountries") > 0;
UPDATE "Posting" SET "country" = 'EE';
