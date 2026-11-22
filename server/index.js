import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.COMPANIES_HOUSE_API_KEY;
const BASE_URL = "https://api.company-information.service.gov.uk";

if (!API_KEY) {
  console.error("Missing COMPANIES_HOUSE_API_KEY. Copy server/.env.example to server/.env and add your key.");
  process.exit(1);
}

app.use(cors());

// Companies House uses HTTP Basic auth: API key as the username, blank password.
const authHeader = "Basic " + Buffer.from(`${API_KEY}:`).toString("base64");

async function chFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: authHeader },
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

// GET /api/companies/search?q=tesco
app.get("/api/companies/search", async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  if (!q) return res.status(400).json({ error: "Query parameter 'q' is required." });

  try {
    const { status, body } = await chFetch(
      `/search/companies?q=${encodeURIComponent(q)}&items_per_page=20`
    );
    res.status(status).json(body);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Could not reach Companies House." });
  }
});

// GET /api/companies/00445790
app.get("/api/companies/:number", async (req, res) => {
  try {
    const { status, body } = await chFetch(
      `/company/${encodeURIComponent(req.params.number)}`
    );
    res.status(status).json(body);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Could not reach Companies House." });
  }
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
