const DEFAULT_VALUE = "—";
const DEFAULT_DATE_VALUE = "Invalid Date";

export type Company = {
  name: string;
  number: string;
  status: string;
  type: string;
  create_at: string;
  address: string;
};

function is_blank(x: any) {
  return !x || `${x}`.trim().length == 0;
}

function fmt_string(x: any) {
  if (is_blank(x)) return DEFAULT_VALUE;
  return `${x}`;
}

function fmt_date(x: any) {
  const str = fmt_string(x);
  const res = /[0-9]+-[0-9]+-[0-9]+/.exec(x);
  if (!res) return DEFAULT_DATE_VALUE;
  return str;
}

export function validateCompanyJSON(json: any) {
  if (!json || !json.items) return [];

  return json.items
    .map((x:any) => {
      if (!x) return null;
      return {
        name: x.title,
        number: fmt_string(x.company_number),
        status: fmt_string(x.company_status),
        type: fmt_string(x.company_type),
        create_at: fmt_date(x.date_of_creation),
        address: fmt_string(x.address_snippet),
      };
    })
    .filter((x:Company|null) => x);
}
