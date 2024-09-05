-- CreateTable
CREATE TABLE "buckets" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "buckets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buckets" ADD CONSTRAINT "buckets_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "planners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
