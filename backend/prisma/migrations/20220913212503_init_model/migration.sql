-- CreateTable
CREATE TABLE "url_map" (
    "id" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "short_url" TEXT NOT NULL,

    CONSTRAINT "url_map_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "url_map_original_url_key" ON "url_map"("original_url");

-- CreateIndex
CREATE UNIQUE INDEX "url_map_short_url_key" ON "url_map"("short_url");
