-- DropForeignKey
ALTER TABLE "Imovel" DROP CONSTRAINT "Imovel_locadorId_fkey";

-- AlterTable
ALTER TABLE "Imovel" ALTER COLUMN "locadorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_locadorId_fkey" FOREIGN KEY ("locadorId") REFERENCES "Locador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
