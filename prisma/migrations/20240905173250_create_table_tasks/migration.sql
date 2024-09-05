-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "planner_id" TEXT NOT NULL,
    "bucket_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "percent_complete" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "start_date_time" TIMESTAMP(3),
    "due_date_time" TIMESTAMP(3),
    "completed_date_time" TIMESTAMP(3),
    "hours" DOUBLE PRECISION,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
