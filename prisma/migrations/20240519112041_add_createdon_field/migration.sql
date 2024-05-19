/*
  Warnings:

  - The primary key for the `Campaigns` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignName" TEXT NOT NULL,
    "campaignDescription" TEXT,
    "createdOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Campaigns" ("campaignDescription", "campaignName", "createdOn", "id") SELECT "campaignDescription", "campaignName", "createdOn", "id" FROM "Campaigns";
DROP TABLE "Campaigns";
ALTER TABLE "new_Campaigns" RENAME TO "Campaigns";
PRAGMA foreign_key_check("Campaigns");
PRAGMA foreign_keys=ON;
