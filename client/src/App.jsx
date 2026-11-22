import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setResults(data.items || []);
      setSearched(true);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Company search</h1>
      <p className="sub">Search the Companies House register by company name.</p>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Tesco"
          aria-label="Company name"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {searched && !loading && !error && results.length === 0 && (
        <p className="sub">No companies found. Try a different name.</p>
      )}

      <ul>
        {results.map((c) => (
          <li key={c.company_number}>
            <strong>{c.title}</strong>
            <span>
              {c.company_number} · {c.company_status} · {c.address_snippet}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
