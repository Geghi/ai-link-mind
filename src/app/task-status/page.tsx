// app/task-status/page.tsx  (server, NIENTE 'use client')
import TaskStatusClient from './TaskStatusClient';

export default async function TaskStatusPage({
  searchParams,
}: {
  searchParams: { task_id?: string };
}) {
  // Await the searchParams object itself to ensure it's fully resolved
  // before accessing its properties, as suggested by the Next.js error.
  const resolvedSearchParams = await searchParams;
  const taskId = resolvedSearchParams.task_id;
  return <TaskStatusClient taskId={taskId} />;
}
