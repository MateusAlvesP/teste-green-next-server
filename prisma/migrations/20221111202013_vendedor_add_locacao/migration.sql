-- AlterTable
ALTER TABLE "locacao" ADD COLUMN     "vendedor_id" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "locacao" ADD CONSTRAINT "locacao_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "vendedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
