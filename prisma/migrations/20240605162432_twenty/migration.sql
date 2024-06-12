/*
  Warnings:

  - You are about to drop the column `oldStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `statusID` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `statusID` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_statusID_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_statusID_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToProduct" DROP CONSTRAINT "_OrderToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToProduct" DROP CONSTRAINT "_OrderToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "oldStatus",
DROP COLUMN "statusID";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "statusID";

-- DropTable
DROP TABLE "_CategoryToProduct";

-- DropTable
DROP TABLE "_OrderToProduct";

-- CreateTable
CREATE TABLE "ProductStatusIntermediate" (
    "parentID" TEXT NOT NULL,
    "childID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "OrderStatusIntermediate" (
    "parentID" TEXT NOT NULL,
    "childID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "OrderOldIntermediate" (
    "parentID" TEXT NOT NULL,
    "childID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "OrderProductsIntermediate" (
    "parentID" TEXT NOT NULL,
    "childID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductCategoriesIntermediate" (
    "parentID" TEXT NOT NULL,
    "childID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StateProductIntermediate" (
    "parentID" TEXT NOT NULL,
    "childID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StateOrderIntermediate" (
    "parentID" TEXT NOT NULL,
    "childID" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductStatusIntermediate_parentID_key" ON "ProductStatusIntermediate"("parentID");

-- CreateIndex
CREATE UNIQUE INDEX "OrderStatusIntermediate_parentID_key" ON "OrderStatusIntermediate"("parentID");

-- CreateIndex
CREATE UNIQUE INDEX "OrderOldIntermediate_parentID_key" ON "OrderOldIntermediate"("parentID");

-- CreateIndex
CREATE UNIQUE INDEX "OrderProductsIntermediate_parentID_key" ON "OrderProductsIntermediate"("parentID");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategoriesIntermediate_parentID_key" ON "ProductCategoriesIntermediate"("parentID");

-- CreateIndex
CREATE UNIQUE INDEX "StateProductIntermediate_parentID_key" ON "StateProductIntermediate"("parentID");

-- CreateIndex
CREATE UNIQUE INDEX "StateOrderIntermediate_parentID_key" ON "StateOrderIntermediate"("parentID");
