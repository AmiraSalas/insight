import { FilterPanel } from '../FilterPanel';

export default function FilterPanelExample() {
  return (
    <div className="w-72 p-4 bg-card rounded-lg">
      <FilterPanel onFilterChange={(filters) => console.log('Filters changed:', filters)} />
    </div>
  );
}
