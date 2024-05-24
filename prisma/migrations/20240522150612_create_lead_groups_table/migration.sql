/*
  Warnings:

  - You are about to drop the `LeadGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LeadGroups";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "leadgroups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupName" TEXT NOT NULL,
    "groupDescription" TEXT,
    "createdOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
