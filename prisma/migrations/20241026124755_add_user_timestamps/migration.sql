-- AlterTable
ALTER TABLE "User" 
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP; -- Set default value for updatedAt

-- Optional: Update existing rows with a timestamp
UPDATE "User" SET "updatedAt" = CURRENT_TIMESTAMP; -- Set current time for existing rows
