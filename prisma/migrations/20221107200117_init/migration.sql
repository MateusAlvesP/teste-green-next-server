-- CreateTable
CREATE TABLE "Vendedor" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(45) NOT NULL,
    "cpf" VARCHAR(45) NOT NULL,

    CONSTRAINT "Vendedor_pkey" PRIMARY KEY ("id")
);
