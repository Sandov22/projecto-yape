/*
  Warnings:

  - You are about to drop the column `childID` on the `OrderOldIntermediate` table. All the data in the column will be lost.
  - You are about to drop the column `parentID` on the `OrderOldIntermediate` table. All the data in the column will be lost.
  - You are about to drop the column `childID` on the `OrderProductsIntermediate` table. All the data in the column will be lost.
  - You are about to drop the column `parentID` on the `OrderProductsIntermediate` table. All the data in the column will be lost.
  - You are about to drop the column `childID` on the `OrderStatusIntermediate` table. All the data in the column will be lost.
  - You are about to drop the column `parentID` on the `OrderStatusIntermediate` table. All the data in the column will be lost.
  - You are about to drop the column `childID` on the `ProductCategoriesIntermediate` table. All the data in the column will be lost.
  - You are about to drop the column `parentID` on the `ProductCategoriesIntermediate` table. All the data in the column will be lost.
  - You are about to drop the column `childID` on the `ProductStatusIntermediate` table. All the data in the column will be lost.
  - You are about to drop the column `parentID` on the `ProductStatusIntermediate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderID]` on the table `OrderOldIntermediate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderID]` on the table `OrderProductsIntermediate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderID]` on the table `OrderStatusIntermediate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productID]` on the table `ProductCategoriesIntermediate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productID]` on the table `ProductStatusIntermediate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `oldID` to the `OrderOldIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderID` to the `OrderOldIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderID` to the `OrderProductsIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productID` to the `OrderProductsIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderID` to the `OrderStatusIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusID` to the `OrderStatusIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryID` to the `ProductCategoriesIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productID` to the `ProductCategoriesIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productID` to the `ProductStatusIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusID` to the `ProductStatusIntermediate` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OrderOldIntermediate_parentID_key";

-- DropIndex
DROP INDEX "OrderProductsIntermediate_parentID_key";

-- DropIndex
DROP INDEX "OrderStatusIntermediate_parentID_key";

-- DropIndex
DROP INDEX "ProductCategoriesIntermediate_parentID_key";

-- DropIndex
DROP INDEX "ProductStatusIntermediate_parentID_key";

-- AlterTable
ALTER TABLE "OrderOldIntermediate" DROP COLUMN "childID",
DROP COLUMN "parentID",
ADD COLUMN     "oldID" TEXT NOT NULL,
ADD COLUMN     "orderID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderProductsIntermediate" DROP COLUMN "childID",
DROP COLUMN "parentID",
ADD COLUMN     "orderID" TEXT NOT NULL,
ADD COLUMN     "productID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderStatusIntermediate" DROP COLUMN "childID",
DROP COLUMN "parentID",
ADD COLUMN     "orderID" TEXT NOT NULL,
ADD COLUMN     "statusID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategoriesIntermediate" DROP COLUMN "childID",
DROP COLUMN "parentID",
ADD COLUMN     "categoryID" TEXT NOT NULL,
ADD COLUMN     "productID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductStatusIntermediate" DROP COLUMN "childID",
DROP COLUMN "parentID",
ADD COLUMN     "productID" TEXT NOT NULL,
ADD COLUMN     "statusID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrderOldIntermediate_orderID_key" ON "OrderOldIntermediate"("orderID");

-- CreateIndex
CREATE UNIQUE INDEX "OrderProductsIntermediate_orderID_key" ON "OrderProductsIntermediate"("orderID");

-- CreateIndex
CREATE UNIQUE INDEX "OrderStatusIntermediate_orderID_key" ON "OrderStatusIntermediate"("orderID");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategoriesIntermediate_productID_key" ON "ProductCategoriesIntermediate"("productID");

-- CreateIndex
CREATE UNIQUE INDEX "ProductStatusIntermediate_productID_key" ON "ProductStatusIntermediate"("productID");
