-- CreateTable
CREATE TABLE "SEPA" (
    "id" SERIAL NOT NULL,
    "iban" TEXT NOT NULL,
    "bic" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SEPA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SEPA_userId_key" ON "SEPA"("userId");

-- AddForeignKey
ALTER TABLE "SEPA" ADD CONSTRAINT "SEPA_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
