-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "mtrActivities" TEXT[],
ADD COLUMN     "mtrStatus" TEXT,
ADD COLUMN     "mtrUrl" TEXT,
ADD COLUMN     "registryAddress" TEXT,
ADD COLUMN     "registryCheckedAt" TIMESTAMP(3),
ADD COLUMN     "registryName" TEXT,
ADD COLUMN     "registryStatus" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedSource" TEXT;

-- CreateIndex
CREATE INDEX "Profile_regCode_idx" ON "Profile"("regCode");

