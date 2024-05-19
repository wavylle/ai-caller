-- CreateTable
CREATE TABLE "Campaigns" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "campaignName" TEXT NOT NULL,
    "campaignDescription" TEXT,
    "createdOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
