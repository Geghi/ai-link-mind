export type UrlStatus = 'Queued' | 'In Progress' | 'Completed' | 'Failed';

export interface UrlEntry {
  id: string;
  task_id: string;
  url: string;
  status: UrlStatus;
  created_at: string;
  updated_at: string | null;
}
