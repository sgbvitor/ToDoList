/*
  Warnings:

  - Made the column `status` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Task" ("created_at", "id", "status", "title") SELECT "created_at", "id", "status", "title" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_key_check("Task");
PRAGMA foreign_keys=ON;
