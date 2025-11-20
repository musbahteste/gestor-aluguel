-- CreateTable
CREATE TABLE "LinkPagamento" (
    "id" SERIAL NOT NULL,
    "preferenceId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "link" TEXT NOT NULL,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkPagamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkPagamento_preferenceId_key" ON "LinkPagamento"("preferenceId");
