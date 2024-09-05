-- CreateTable
CREATE TABLE "planners" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "planners_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "planners" ADD CONSTRAINT "planners_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
