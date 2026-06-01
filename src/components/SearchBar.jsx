export default function SearchBar({
  searchText,
  onSearchChange,
}) {
  return (
    <input
      className="search-input"
      type="text"
      placeholder="Search recipes..."
      value={searchText}
      onChange={(e) =>
        onSearchChange(e.target.value)
      }
    />
  );
}