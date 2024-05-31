/*
  Warnings:

  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_statusID_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_statusID_fkey";

-- DropTable
DROP TABLE "State";

-- CreateTable
CREATE TABLE "OrderState" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "OrderState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductState" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "ProductState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderState_state_key" ON "OrderState"("state");

-- CreateIndex
CREATE UNIQUE INDEX "ProductState_state_key" ON "ProductState"("state");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_statusID_fkey" FOREIGN KEY ("statusID") REFERENCES "ProductState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_statusID_fkey" FOREIGN KEY ("statusID") REFERENCES "OrderState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
