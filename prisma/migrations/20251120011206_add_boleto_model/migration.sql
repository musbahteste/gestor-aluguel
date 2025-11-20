-- CreateTable
CREATE TABLE "Boleto" (
    "id" SERIAL NOT NULL,
    "mpPaymentId" TEXT NOT NULL,
    "vencimento" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "payerFirstName" TEXT NOT NULL,
    "payerLastName" TEXT NOT NULL,
    "barcode" TEXT,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boleto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Boleto_mpPaymentId_key" ON "Boleto"("mpPaymentId");
