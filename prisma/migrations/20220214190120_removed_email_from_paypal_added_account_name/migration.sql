/*
  Warnings:

  - You are about to drop the column `email` on the `Paypal` table. All the data in the column will be lost.
  - Added the required column `accountName` to the `Paypal` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Paypal_email_key";

-- AlterTable
ALTER TABLE "Paypal" DROP COLUMN "email",
ADD COLUMN     "accountName" TEXT NOT NULL;
