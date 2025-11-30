import { SearchBar } from '../SearchBar';

export default function SearchBarExample() {
  return (
    <div className="max-w-2xl">
      <SearchBar onSearch={(query) => console.log('Search query:', query)} />
    </div>
  );
}
