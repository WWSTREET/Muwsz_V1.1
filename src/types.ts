export type InstitutionStatus = 'trial' | 'official' | 'expired' | 'closed';

export interface Institution {
  id: number;
  name: string;
  region: string;
  category: string; // e.g. "一类", "二类", "三类"
  type: string; // e.g. "网信部门", "宣传部", "网安部门", "电力", "职校高校"
  salesName: string;
  salesPhone: string;
  status: InstitutionStatus;
  isActive: boolean;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysRemaining: number;
  statisticalUnit?: string;
}

export interface FilterState {
  name: string;
  region: string;
  category: string;
  type: string;
  validity: string;
  statisticalUnit: string;
}
