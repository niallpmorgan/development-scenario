import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import SearchTable from "./components/SearchTable";
import TextField from "@mui/material/TextField";

import type { Company } from "./types/company";
import { apiCompanySearch } from "./api";

export default function App() {
  const [items, setItems] = useState<Company[]>([]);
  const abortRef = useRef<AbortController|null>(null);

  const searchHandler = debounce((q) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    apiCompanySearch(abortRef.current!, q).then((x) => setItems(x));
  }, 100);

  useEffect(() => {
    return () => {
      searchHandler.cancel();
      abortRef.current?.abort();
    };
  }, []);

  return (
    <main>
      <TextField
        label="Search"
        variant="outlined"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          searchHandler(event.target.value);
        }}
      />
      <SearchTable items={items} />
    </main>
  );
}
