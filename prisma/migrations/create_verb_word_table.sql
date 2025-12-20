-- CreateTable for VerbWord
CREATE TABLE IF NOT EXISTS "VerbWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "verbType" TEXT NOT NULL,
    "sentencePattern" TEXT,
    "sortOrder" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VerbWord_value_key" ON "VerbWord"("value");
CREATE INDEX "VerbWord_verbType_sentencePattern_idx" ON "VerbWord"("verbType", "sentencePattern");
