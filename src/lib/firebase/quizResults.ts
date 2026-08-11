import db from '@/lib/firebase/firebase';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { QuizResult } from '@/types/quiz';

/**
 * ユーザーのクイズ成績を取得
 */
export async function getQuizResult(uid: string): Promise<QuizResult | null> {
  try {
    const resultRef = doc(db, 'quizResults', uid);
    const resultSnap = await getDoc(resultRef);

    if (!resultSnap.exists()) {
      return null;
    }

    const data = resultSnap.data();
    return {
      bestStreak: data.bestStreak || 0,
      totalCorrect: data.totalCorrect || 0,
      categoryStats: data.categoryStats || {},
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error('Error getting quiz result:', error);
    return null;
  }
}

/**
 * クイズ結果を保存（1回のプレイ終了時に呼び出す）
 * bestStreakは呼び出し側で計算済みの最新値をそのまま保存し、
 * categoryStats・totalCorrectは既存値に加算する
 */
export async function submitQuizResult(
  uid: string,
  categoryId: string,
  correctCount: number,
  totalCount: number,
  bestStreak: number
): Promise<void> {
  try {
    const resultRef = doc(db, 'quizResults', uid);
    const resultSnap = await getDoc(resultRef);

    if (!resultSnap.exists()) {
      // 初回プレイ：ドット記法はsetDocでは正しく解釈されないため、ネストしたオブジェクトで作成する
      await setDoc(resultRef, {
        bestStreak,
        totalCorrect: 1,
        categoryStats: {
          [categoryId]: {
            correct: correctCount,
            total: totalCount,
          },
        },
        updatedAt: serverTimestamp(),
      });
      return;
    }

    // 2回目以降：ドット記法のフィールドパスが使えるupdateDocで、他カテゴリを上書きせずに加算する
    await updateDoc(resultRef, {
      bestStreak,
      totalCorrect: increment(1),
      [`categoryStats.${categoryId}.correct`]: increment(correctCount),
      [`categoryStats.${categoryId}.total`]: increment(totalCount),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error submitting quiz result:', error);
  }
}
