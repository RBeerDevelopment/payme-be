/*
  Warnings:

  - The primary key for the `Paypal` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Paypal" DROP CONSTRAINT "Paypal_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Paypal_pkey" PRIMARY KEY ("id");
