/*
  Warnings:

  - You are about to drop the `VerbWord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VerbWord";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BeVerbWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DoVerbWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sentencePattern" TEXT,
    "pastForm" TEXT,
    "thirdPersonForm" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "adverb" TEXT
);

-- CreateTable
CREATE TABLE "SentenceDrill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sentencePattern" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "japanese" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BeVerbWord_value_key" ON "BeVerbWord"("value");

-- CreateIndex
CREATE UNIQUE INDEX "DoVerbWord_value_key" ON "DoVerbWord"("value");

-- CreateIndex
CREATE INDEX "DoVerbWord_sentencePattern_idx" ON "DoVerbWord"("sentencePattern");
