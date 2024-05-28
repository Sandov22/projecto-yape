/*
  Warnings:

  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - The `oldStatus` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `statusID` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "statusID" INTEGER NOT NULL,
DROP COLUMN "oldStatus",
ADD COLUMN     "oldStatus" INTEGER[];

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_statusID_fkey" FOREIGN KEY ("statusID") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
