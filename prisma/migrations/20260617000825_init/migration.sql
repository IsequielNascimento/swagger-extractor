-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "apiName" TEXT NOT NULL,
    "swaggerJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SnapshotDiff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "snapshotOldId" TEXT NOT NULL,
    "snapshotNewId" TEXT NOT NULL,
    "diffJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SnapshotDiff_snapshotOldId_fkey" FOREIGN KEY ("snapshotOldId") REFERENCES "Snapshot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SnapshotDiff_snapshotNewId_fkey" FOREIGN KEY ("snapshotNewId") REFERENCES "Snapshot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
