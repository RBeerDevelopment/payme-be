/*
  Warnings:

  - You are about to drop the column `bank` on the `Sepa` table. All the data in the column will be lost.
  - Added the required column `accountName` to the `Sepa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `Sepa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sepa" DROP CONSTRAINT "Sepa_userId_fkey";

-- DropIndex
DROP INDEX "Sepa_userId_key";

-- AlterTable
ALTER TABLE "Sepa" DROP COLUMN "bank",
ADD COLUMN     "accountName" TEXT NOT NULL,
ADD COLUMN     "bankName" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Sepa" ADD CONSTRAINT "Sepa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
