-- DropForeignKey
ALTER TABLE "Paypal" DROP CONSTRAINT "Paypal_userId_fkey";

-- DropIndex
DROP INDEX "Paypal_userId_key";

-- AlterTable
ALTER TABLE "Paypal" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Paypal" ADD CONSTRAINT "Paypal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
