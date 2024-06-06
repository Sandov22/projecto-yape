/*
  Warnings:

  - Added the required column `deletedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `OrderOldIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderOldIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `OrderProductsIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderProductsIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `OrderState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `OrderStatusIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderStatusIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `ProductCategoriesIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductCategoriesIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `ProductState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `ProductStatusIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductStatusIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `StateOrderIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StateOrderIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `StateProductIntermediate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StateProductIntermediate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderOldIntermediate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderProductsIntermediate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderState" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderStatusIntermediate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategoriesIntermediate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductState" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductStatusIntermediate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StateOrderIntermediate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StateProductIntermediate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
