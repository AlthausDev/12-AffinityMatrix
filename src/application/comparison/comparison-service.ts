import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';
import { ComparisonSubject, ProfileComparisonResult } from '../../domain/comparison/comparison';
import { ProfileComparator } from '../../domain/comparison/profile-comparator';

export class ComparisonService {
  constructor(private readonly comparator = new ProfileComparator()) {}

  compare(
    snapshot: CatalogueSnapshot,
    left: ComparisonSubject,
    right: ComparisonSubject,
  ): ProfileComparisonResult {
    return this.comparator.compare(snapshot, left, right);
  }
}
