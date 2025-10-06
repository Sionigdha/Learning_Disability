/*
  Warnings:

  - You are about to drop the column `level1Score` on the `EyeTest` table. All the data in the column will be lost.
  - You are about to drop the column `level2Score` on the `EyeTest` table. All the data in the column will be lost.
  - You are about to drop the column `level3Score` on the `EyeTest` table. All the data in the column will be lost.
  - You are about to drop the column `level4Score` on the `EyeTest` table. All the data in the column will be lost.
  - You are about to drop the column `totalScore` on the `EyeTest` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `EyeTest` table. All the data in the column will be lost.
  - You are about to alter the column `accuracy` on the `EyeTest` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - Added the required column `score` to the `EyeTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `EyeTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EyeTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userEmail" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_EyeTest" ("accuracy", "createdAt", "id") SELECT "accuracy", "createdAt", "id" FROM "EyeTest";
DROP TABLE "EyeTest";
ALTER TABLE "new_EyeTest" RENAME TO "EyeTest";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id") SELECT "createdAt", "email", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
