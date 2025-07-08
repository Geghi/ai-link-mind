// app/task-status/page.tsx  (server, NIENTE 'use client')
import TaskStatusClient from './TaskStatusClient';

export default async function TaskStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ task_id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const taskId = resolvedSearchParams.task_id;
  return <TaskStatusClient taskId={taskId} />;
}
