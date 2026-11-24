import { validateCompanyJSON } from "./types/company";

export async function apiCompanySearch(abort: AbortController, q: string) {
  if (q.length == 0) return [];

  const params = new URLSearchParams();
  params.append("q", q);

  try {
    const response = await fetch(`/api/companies/search?${params}`, {
      signal: abort.signal,
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return validateCompanyJSON(json);
  } catch (error) {
    if (error instanceof Error && error.name == "AbortError") {
      return [];
    }
    throw error;
  }
}
