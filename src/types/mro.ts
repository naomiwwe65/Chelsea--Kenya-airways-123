export type Progress = 'CLOSED' | 'WIP' | 'ON PROGRESS' | 'PENDING';
export type Category = 'MAIN' | 'SHOP' | 'LAB' | 'OTHER' | string;

export interface MROItem {
  id: string;
  customer?: string;
  part_number?: string;
  description?: string;
  serial_number?: string;
  date_delivered?: string;
  work_requested?: string;
  progress: Progress;
  location?: string;
  expected_release_date?: string;
  remarks?: string;
  category?: Category;
  subcategory?: string;
  sheet_name?: string;
}

export const CATEGORIES: Category[] = ['MAIN', 'SHOP', 'LAB'];



