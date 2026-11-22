import { useEffect, useState } from "react";
import { useDebouncedValue } from "./useDebouncedValue";
import type { CompanySearchItem, CompanySearchResponse } from "./types";

const MIN_CHARS = 2;

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CompanySearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  useEffect(() => {
    if (debouncedQuery.length < MIN_CHARS) {
      setResults([]);
      setError("");
      setSearched(false);
      setLoading(false);
      return;
    }

    // Cancel the previous request if the query changes before it finishes.
    const controller = new AbortController();
    setLoading(true);
    setError("");

    (async () => {
      try {
        const res = await fetch(
          `/api/companies/search?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );
        const data: CompanySearchResponse & { error?: string } = await res.json();
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        setResults(data.items ?? []);
        setSearched(true);
        setLoading(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setResults([]);
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <main>
      <h1>Company search</h1>
      <p className="sub">Start typing a company name to search the Companies House register.</p>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Tesco"
        aria-label="Company name"
        autoFocus
      />

      <p className="status" aria-live="polite">
        {loading && "Searching…"}
        {!loading && query.trim().length > 0 && query.trim().length < MIN_CHARS &&
          `Type at least ${MIN_CHARS} characters.`}
      </p>

      {error && <p className="error">{error}</p>}
      {searched && !loading && !error && results.length === 0 && (
        <p className="sub">No companies found. Try a different name.</p>
      )}

      <ul>
        {results.map((c) => (
          <li key={c.company_number}>
            <strong>{c.title}</strong>
            <span>
              {c.company_number} · {c.company_status ?? "unknown"} · {c.address_snippet ?? "no address"}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
