-- CreateTable
CREATE TABLE "VerbWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "verbType" TEXT NOT NULL,
    "sentencePattern" TEXT,
    "sortOrder" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "NounWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "numberForm" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "AdjectiveWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "AdverbWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VerbWord_value_key" ON "VerbWord"("value");

-- CreateIndex
CREATE INDEX "VerbWord_verbType_sentencePattern_idx" ON "VerbWord"("verbType", "sentencePattern");

-- CreateIndex
CREATE UNIQUE INDEX "NounWord_value_key" ON "NounWord"("value");

-- CreateIndex
CREATE INDEX "NounWord_numberForm_idx" ON "NounWord"("numberForm");

-- CreateIndex
CREATE UNIQUE INDEX "AdjectiveWord_value_key" ON "AdjectiveWord"("value");

-- CreateIndex
CREATE UNIQUE INDEX "AdverbWord_value_key" ON "AdverbWord"("value");
