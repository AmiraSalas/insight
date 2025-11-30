import { EmptyState } from '../EmptyState';

export default function EmptyStateExample() {
  return <EmptyState onClearFilters={() => console.log('Clear filters clicked')} />;
}
