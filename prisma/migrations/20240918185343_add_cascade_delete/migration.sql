-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_task_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "buckets" DROP CONSTRAINT "buckets_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "planners" DROP CONSTRAINT "planners_group_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_bucket_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_planner_id_fkey";

-- AddForeignKey
ALTER TABLE "planners" ADD CONSTRAINT "planners_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "buckets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buckets" ADD CONSTRAINT "buckets_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "planners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
