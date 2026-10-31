import { useEffect } from "react";
import useCpuContext from "../hooks/useCpuContext";

// CSS styles
import "../styles/searchBar.css";

import type { CpuType } from "../types/types";

export default function SearchBar() {
  const { uiState, uiDispatch, dataState, dataDispatch } = useCpuContext();

  useEffect(() => {
    if (!uiState.showSearch) {
      uiDispatch({
        type: "SET_SEARCH",
        payload: "",
      });
    }
  }, [uiState.showSearch, uiDispatch]);

  function handleSearch(searchTerm: string) {
    uiDispatch({
      type: "SET_SEARCH",
      payload: searchTerm,
    });

    // Filter the list based on the search term
    dataDispatch({
      type: "SET_FOUND",
      payload: dataState.cpus.filter((cpu: CpuType) => {
        return `${cpu.manufacturer} ${cpu.model}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    })
  }

  return (
    <div id="search-bar-field">
      <button
        id="show-search-button"
        type="button"
        onClick={() => uiDispatch({ type: "TOGGLE_SEARCH" })}
      >
        {uiState.showSearch ? "Cancel" : "Search"}
      </button>
      {uiState.showSearch && (
        <form>
          <input
            type="search"
            id="search-bar-input"
            placeholder="Search"
            value={uiState.searchCpu}
            onChange={(e) => handleSearch(e.target.value.trimStart())}
          />
        </form>
      )}
    </div>
  );
}
