// React
import { useState, useEffect } from "react";

// CSS styles
import "../styles/searchBar.css";

// Component
export default function SearchBar({ searchTerm, setSearchTerm }) {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!showSearch) {
      setSearchTerm("");
    }
  }, [showSearch, setSearchTerm]);

  return (
    <div id="search-bar-field">
      <button
        id="show-search-button"
        type="button"
        onClick={() => setShowSearch(!showSearch)}
      >
        {showSearch ? "Cancel" : "Search"}
      </button>
      {showSearch && (
        <form>
          <input
            type="text"
            id="search-bar-input"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trimStart())}
          />
        </form>
      )}
    </div>
  );
}
