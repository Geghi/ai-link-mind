export type UrlStatus = 'Queued' | 'In Progress' | 'Completed' | 'Failed';

export interface UrlEntry {
  id: string;
  task_id: string;
  url: string;
  status: UrlStatus;
  createdAt: string;
  updatedAt: string | null;
}
