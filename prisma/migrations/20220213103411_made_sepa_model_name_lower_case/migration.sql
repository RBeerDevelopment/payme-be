/*
  Warnings:

  - You are about to drop the `SEPA` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SEPA" DROP CONSTRAINT "SEPA_userId_fkey";

-- DropTable
DROP TABLE "SEPA";

-- CreateTable
CREATE TABLE "Sepa" (
    "id" SERIAL NOT NULL,
    "iban" TEXT NOT NULL,
    "bic" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Sepa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sepa_userId_key" ON "Sepa"("userId");

-- AddForeignKey
ALTER TABLE "Sepa" ADD CONSTRAINT "Sepa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
