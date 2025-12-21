import { SentencePattern, Word } from '../../../domain/models/practice/types';
import { PatternGenerator } from '../../../domain/models/practice/PatternGenerator';

export class GeneratePatternUseCase {
  /**
   * Generates a sentence pattern based on the provided practice state.
   * This use case orchestrates the domain logic for pattern generation.
   * 
   * @param pattern The current sentence pattern configuration.
   * @param nounWords A list of helper noun words (from repository/presentation).
   * @param verbWords A list of helper verb words (from repository/presentation).
   * @returns The generated sentence string.
   */
  execute(pattern: SentencePattern, nounWords: Word[] = [], verbWords: Word[] = []): string {
    // In a fuller implementation, this use case might validate inputs or 
    // fetch data from a repository if `nounWords` weren't passed in.
    // For now, it delegates pure domain logic to the PatternGenerator service.
    return PatternGenerator.generate(pattern, nounWords, verbWords);
  }
}
