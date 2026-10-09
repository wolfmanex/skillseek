-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "nameFi" TEXT NOT NULL DEFAULT '';

-- Finnish trade names (kept in sync with TRADES in src/lib/constants.ts)
UPDATE "Trade" SET "nameFi" = 'Yleisrakentaminen' WHERE "slug" = 'general-construction';
UPDATE "Trade" SET "nameFi" = 'Betonityöt' WHERE "slug" = 'concrete';
UPDATE "Trade" SET "nameFi" = 'Muuraustyöt' WHERE "slug" = 'masonry';
UPDATE "Trade" SET "nameFi" = 'Kirvesmiestyöt' WHERE "slug" = 'carpentry';
UPDATE "Trade" SET "nameFi" = 'Kattotyöt' WHERE "slug" = 'roofing';
UPDATE "Trade" SET "nameFi" = 'Julkisivutyöt' WHERE "slug" = 'facade';
UPDATE "Trade" SET "nameFi" = 'Sähkötyöt' WHERE "slug" = 'electrical';
UPDATE "Trade" SET "nameFi" = 'Putkityöt' WHERE "slug" = 'plumbing';
UPDATE "Trade" SET "nameFi" = 'LVI / ilmanvaihto' WHERE "slug" = 'hvac';
UPDATE "Trade" SET "nameFi" = 'Kipsilevytyöt' WHERE "slug" = 'drywall';
UPDATE "Trade" SET "nameFi" = 'Maalaus- ja pintatyöt' WHERE "slug" = 'painting';
UPDATE "Trade" SET "nameFi" = 'Laatoitus' WHERE "slug" = 'tiling';
UPDATE "Trade" SET "nameFi" = 'Lattiatyöt' WHERE "slug" = 'flooring';
UPDATE "Trade" SET "nameFi" = 'Eristystyöt' WHERE "slug" = 'insulation';
UPDATE "Trade" SET "nameFi" = 'Hitsaus- ja teräsrakennetyöt' WHERE "slug" = 'welding';
UPDATE "Trade" SET "nameFi" = 'Maanrakennustyöt' WHERE "slug" = 'earthworks';
UPDATE "Trade" SET "nameFi" = 'Purkutyöt' WHERE "slug" = 'demolition';
UPDATE "Trade" SET "nameFi" = 'Viherrakentaminen' WHERE "slug" = 'landscaping';
UPDATE "Trade" SET "nameFi" = 'Ikkuna- ja oviasennukset' WHERE "slug" = 'windows-doors';
UPDATE "Trade" SET "nameFi" = 'Telinetyöt' WHERE "slug" = 'scaffolding';
