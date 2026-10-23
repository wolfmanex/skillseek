-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "regCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'EE',
    "name" TEXT NOT NULL,
    "legalForm" TEXT,
    "status" TEXT NOT NULL,
    "address" TEXT,
    "county" TEXT,
    "city" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "emtakCodes" TEXT[],
    "mainEmtak" TEXT,
    "tradeSlugs" TEXT[],
    "foundedAt" TIMESTAMP(3),
    "source" TEXT NOT NULL DEFAULT 'ariregister',
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "claimTokenHash" TEXT,
    "claimTokenExpiresAt" TIMESTAMP(3),
    "claimVerifies" BOOLEAN NOT NULL DEFAULT false,
    "invitedAt" TIMESTAMP(3),
    "invitedEmail" TEXT,
    "claimedAt" TIMESTAMP(3),
    "claimedById" TEXT,
    "optedOutAt" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_regCode_key" ON "Company"("regCode");

-- CreateIndex
CREATE UNIQUE INDEX "Company_claimTokenHash_key" ON "Company"("claimTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Company_claimedById_key" ON "Company"("claimedById");

-- CreateIndex
CREATE INDEX "Company_country_claimedAt_idx" ON "Company"("country", "claimedAt");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
