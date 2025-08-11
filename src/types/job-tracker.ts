export type JobStatus = 'Pending' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';

export interface JobTrackerItem {
  id: string;
  customer: string;
  description: string;
  part_number: string;
  serial_number: string;
  lpo_date: string | null;
  lpo_number: string | null;
  ro_number: string | null;
  kq_repair_order_date: string | null;
  job_card_no: string;
  job_card_date: string | null;
  kq_works_order_wo_no: string | null;
  kq_works_order_date: string | null;
  job_status: JobStatus;
  job_status_date: string | null;
  job_card_shared_with_finance: 'Yes' | 'No';
  created_at?: string;
}




