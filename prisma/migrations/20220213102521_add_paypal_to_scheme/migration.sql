-- CreateTable
CREATE TABLE "Paypal" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Paypal_pkey" PRIMARY KEY ("username")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paypal_email_key" ON "Paypal"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paypal_userId_key" ON "Paypal"("userId");

-- AddForeignKey
ALTER TABLE "Paypal" ADD CONSTRAINT "Paypal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
