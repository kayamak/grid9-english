import { SentenceDrill } from './SentenceDrill';

export type QuestStatus = 'playing' | 'result' | 'failed' | 'all-cleared';
export type AnswerResult = 'correct' | 'wrong' | null;

export class QuestSession {
  private constructor(
    private readonly _level: number,
    private readonly _drills: SentenceDrill[],
    private readonly _results: AnswerResult[],
    private readonly _currentIndex: number,
    private readonly _status: QuestStatus
  ) {}

  static start(level: number, drills: SentenceDrill[]): QuestSession {
    return new QuestSession(
      level,
      drills,
      new Array(drills.length).fill(null),
      0,
      'playing'
    );
  }

  get level(): number {
    return this._level;
  }
  get drills(): SentenceDrill[] {
    return this._drills;
  }
  get results(): AnswerResult[] {
    return this._results;
  }
  get currentIndex(): number {
    return this._currentIndex;
  }
  get status(): QuestStatus {
    return this._status;
  }

  get currentDrill(): SentenceDrill | undefined {
    return this._drills[this._currentIndex];
  }

  get correctCount(): number {
    return this._results.filter((r) => r === 'correct').length;
  }

  get isLastDrill(): boolean {
    return this._currentIndex === this._drills.length - 1;
  }

  getTimeLimit(): number {
    if (this._level === 10) return 10;
    if (this._level < 4) return 30;
    return Math.max(5, 30 - this._level * 2);
  }

  withResults(results: AnswerResult[]): QuestSession {
    return new QuestSession(
      this._level,
      this._drills,
      results,
      this._currentIndex,
      this._status
    );
  }

  submitAnswer(isCorrect: boolean): QuestSession {
    if (this._status !== 'playing') return this;

    const newResults = [...this._results];
    newResults[this._currentIndex] = isCorrect ? 'correct' : 'wrong';

    return new QuestSession(
      this._level,
      this._drills,
      newResults,
      this._currentIndex,
      this._status
    );
  }

  nextDrill(): QuestSession {
    if (this._status !== 'playing') return this;

    if (this.isLastDrill) {
      const correctCount = this.correctCount;
      let nextStatus: QuestStatus = 'failed';

      if (correctCount >= 8) {
        nextStatus = this._level === 10 ? 'all-cleared' : 'result';
      }

      return new QuestSession(
        this._level,
        this._drills,
        this._results,
        this._currentIndex,
        nextStatus
      );
    }

    return new QuestSession(
      this._level,
      this._drills,
      this._results,
      this._currentIndex + 1,
      'playing'
    );
  }

  isCorrect(generatedText: string): boolean {
    if (!this.currentDrill) return false;
    return QuestSession.checkAnswer(generatedText, this.currentDrill.english);
  }

  static checkAnswer(generatedText: string, targetEnglish: string): boolean {
    const normalize = (text: string) =>
      text
        .toLowerCase()
        .replace(/[.,?!]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    return normalize(generatedText) === normalize(targetEnglish);
  }
}
