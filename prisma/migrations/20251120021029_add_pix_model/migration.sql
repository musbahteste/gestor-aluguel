-- CreateTable
CREATE TABLE "Pix" (
    "id" SERIAL NOT NULL,
    "mpPaymentId" TEXT NOT NULL,
    "qrCodeBase64" TEXT,
    "qrCodeText" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "payerFirstName" TEXT NOT NULL,
    "payerLastName" TEXT NOT NULL,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pix_mpPaymentId_key" ON "Pix"("mpPaymentId");
