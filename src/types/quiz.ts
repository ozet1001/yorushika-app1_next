import { Song } from './songs';

export interface QuizChoice {
  songId: string;
  songName: string;
}

export interface QuizQuestion {
  clue: string;
  correctSongId: string;
  correctSongName: string;
  choices: QuizChoice[];
}

export type QuizQuestionCount = 5 | 10 | 'all';

// クイズの1種類（タイアップ編、聖地編…）を表す設定
export interface QuizTypeConfig {
  id: string;
  label: string; // 種類選択プルダウンに表示する名前（例: "タイアップ編"）
  promptLabel: string; // 問題文の上に表示する説明（例: "このタイアップの曲は？"）
  getClue: (song: Song) => string | null; // 曲から手がかりを取り出す。対象外の曲ならnull
}

// クイズ種類ごとの累計正解数・出題数（quizResults.categoryStatsの値）
export interface QuizCategoryStat {
  correct: number;
  total: number;
}

// quizResults/{uid} ドキュメントの型
export interface QuizResult {
  bestStreak: number; // 全クイズ種類を横断した連続正解数。不正解で0にリセットされる
  totalCorrect: number; // クイズをプレイした回数（画面には表示しない）
  categoryStats: Record<string, QuizCategoryStat>; // クイズ種類のid（例: "tieup"）をキーとした累計成績
  updatedAt: unknown; // Firestore Timestamp
}
