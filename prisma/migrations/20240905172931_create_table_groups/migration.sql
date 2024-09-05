-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "mail" TEXT,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);
