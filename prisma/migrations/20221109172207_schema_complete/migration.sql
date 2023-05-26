/*
  Warnings:

  - You are about to drop the `Vendedor` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('ACAO', 'AVENTURA', 'DRAMA', 'COMEDIA', 'TERROR');

-- DropTable
DROP TABLE "Vendedor";

-- CreateTable
CREATE TABLE "cliente" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "endereco_id" INTEGER NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendedor" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "cpf" CHAR(11) NOT NULL,

    CONSTRAINT "vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" SERIAL NOT NULL,
    "rua" VARCHAR(256) NOT NULL,
    "numero" VARCHAR(10) NOT NULL,
    "cep" CHAR(8) NOT NULL,
    "cidade" VARCHAR(256) NOT NULL,
    "estado" VARCHAR(256) NOT NULL,
    "complemento" VARCHAR(256),

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filme" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "diretor" VARCHAR(45) NOT NULL,
    "genero" "Genero" NOT NULL,
    "copias" INTEGER NOT NULL,

    CONSTRAINT "filme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locacao" (
    "cliente_id" INTEGER NOT NULL,
    "filme_id" INTEGER NOT NULL,
    "vencimento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locacao_pkey" PRIMARY KEY ("cliente_id","filme_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_id_key" ON "cliente"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_cpf_key" ON "cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "vendedor_id_key" ON "vendedor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "vendedor_cpf_key" ON "vendedor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "filme_id_key" ON "filme"("id");

-- CreateIndex
CREATE UNIQUE INDEX "filme_nome_key" ON "filme"("nome");

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locacao" ADD CONSTRAINT "locacao_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locacao" ADD CONSTRAINT "locacao_filme_id_fkey" FOREIGN KEY ("filme_id") REFERENCES "filme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
