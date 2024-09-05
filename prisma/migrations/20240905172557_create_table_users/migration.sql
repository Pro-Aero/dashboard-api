-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "user_principal_name" TEXT NOT NULL,
    "mail" TEXT,
    "job_title" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
