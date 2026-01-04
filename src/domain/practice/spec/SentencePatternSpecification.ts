import { SentencePattern } from '../vo/SentencePattern';

export class SentencePatternSpecification {
  /**
   * Checks if the given sentence pattern is valid according to business rules.
   */
  public isSatisfiedBy(pattern: SentencePattern): boolean {
    // Rule: Be verb cannot have SVO, SVOO, or SVOC patterns
    if (pattern.verbType === 'be') {
      const invalidBePatterns = ['SVO', 'SVOO', 'SVOC'];
      if (invalidBePatterns.includes(pattern.fiveSentencePattern)) {
        return false;
      }
    }

    // Add more rules here as needed

    return true;
  }
}
