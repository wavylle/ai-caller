-- CreateTable
CREATE TABLE "LeadGroups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupName" TEXT NOT NULL,
    "groupDescription" TEXT,
    "createdOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
