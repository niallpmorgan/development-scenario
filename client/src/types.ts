export interface CompanySearchItem {
  company_number: string;
  title: string;
  company_status?: string;
  address_snippet?: string;
}

export interface CompanySearchResponse {
  items?: CompanySearchItem[];
  total_results?: number;
}
