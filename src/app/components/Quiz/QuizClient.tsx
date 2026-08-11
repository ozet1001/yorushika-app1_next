'use client';

import { useEffect, useState } from 'react';
import { Song } from '@/types/songs';
import { QuizQuestion, QuizQuestionCount, QuizResult, QuizTypeConfig } from '@/types/quiz';
import { generateQuizSet, getSongsWithClue } from '@/lib/quiz';
import { QUIZ_TYPES } from '@/lib/quizTypes';
import { getQuizResult, submitQuizResult } from '@/lib/firebase/quizResults';
import { useAuth } from '@/contexts/AuthContext';
import XShareButton from '@/app/components/XShareButton';

interface QuizClientProps {
  songsData: Song[];
}

type Stage = 'select' | 'playing' | 'finished';

const QUESTION_COUNT_OPTIONS: { value: QuizQuestionCount; label: string }[] = [
  { value: 5, label: '5問' },
  { value: 10, label: '10問' },
  { value: 'all', label: '全問' },
];

export default function QuizClient({ songsData }: QuizClientProps) {
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>('select');
  const [selectedCount, setSelectedCount] = useState<QuizQuestionCount>(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [activeQuizType, setActiveQuizType] = useState<QuizTypeConfig | null>(null);
  // 全クイズ種類を横断した連続正解数。不正解で0にリセットされる
  const [streak, setStreak] = useState(0);
  const [savedResult, setSavedResult] = useState<QuizResult | null>(null);

  // 匿名ログインが完了したら、これまでのクイズ成績を取得しておく
  useEffect(() => {
    if (!user) return;
    getQuizResult(user.uid).then(setSavedResult);
  }, [user]);

  // 出題可能な曲が1曲以上あるクイズ種類のみを選択肢にする
  const quizTypeOptions = QUIZ_TYPES.map((type) => ({
    ...type,
    eligibleCount: getSongsWithClue(songsData, type).length,
  })).filter((type) => type.eligibleCount > 0);

  const [selectedQuizTypeId, setSelectedQuizTypeId] = useState<string>(
    () => quizTypeOptions[0]?.id ?? ''
  );
  const selectedQuizType = quizTypeOptions.find((type) => type.id === selectedQuizTypeId);

  const currentQuestion = questions[currentIndex] ?? null;
  const isAnswered = selectedSongId !== null;
  const isCorrect = isAnswered && selectedSongId === currentQuestion?.correctSongId;

  const handleStart = () => {
    if (!selectedQuizType) return;

    setQuestions(generateQuizSet(songsData, selectedQuizType, selectedCount));
    setActiveQuizType(selectedQuizType);
    setCurrentIndex(0);
    setScore(0);
    setStreak(savedResult?.bestStreak ?? 0);
    setSelectedSongId(null);
    setStage('playing');
  };

  const handleSelect = (songId: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedSongId(songId);
    if (songId === currentQuestion.correctSongId) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedSongId(null);
    } else {
      finishQuiz();
    }
  };

  // クイズ終了時にFirestoreへ成績を保存する（失敗しても結果画面は表示する）
  const finishQuiz = () => {
    setStage('finished');

    if (!user || !activeQuizType) return;

    const categoryId = activeQuizType.id;
    const finalScore = score;
    const finalTotal = questions.length;
    const finalStreak = streak;

    submitQuizResult(user.uid, categoryId, finalScore, finalTotal, finalStreak);
    setSavedResult((prev) => ({
      bestStreak: finalStreak,
      totalCorrect: (prev?.totalCorrect ?? 0) + 1,
      categoryStats: {
        ...prev?.categoryStats,
        [categoryId]: {
          correct: (prev?.categoryStats?.[categoryId]?.correct ?? 0) + finalScore,
          total: (prev?.categoryStats?.[categoryId]?.total ?? 0) + finalTotal,
        },
      },
      updatedAt: prev?.updatedAt,
    }));
  };

  const handleRestart = () => {
    setStage('select');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedSongId(null);
  };

  const getChoiceStyle = (songId: string): string => {
    const base =
      'w-full text-left px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200';

    if (!isAnswered) {
      return `${base} bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50`;
    }
    if (songId === currentQuestion?.correctSongId) {
      return `${base} bg-green-50 border-green-500 text-green-700`;
    }
    if (songId === selectedSongId) {
      return `${base} bg-red-50 border-red-500 text-red-700`;
    }
    return `${base} bg-white border-gray-200 text-gray-400`;
  };

  // 遊べるクイズが1つもない
  if (quizTypeOptions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">🎵 ヨルシカクイズ</h1>
        <p className="text-gray-500">
          出題できるクイズがまだありません。曲データが充実するとクイズが遊べるようになります。
        </p>
      </div>
    );
  }

  // クイズ種類・出題数選択画面
  if (stage === 'select') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🎵 ヨルシカクイズ</h1>
          <p className="text-sm sm:text-base text-gray-600">
            クイズの種類と出題数を選んで開始してください。
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <label htmlFor="quiz-type" className="block text-sm font-medium text-gray-700 mb-2">
            クイズの種類を選んでください
          </label>
          <select
            id="quiz-type"
            value={selectedQuizTypeId}
            onChange={(e) => setSelectedQuizTypeId(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:border-blue-400"
          >
            {quizTypeOptions.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}（全：{type.eligibleCount}問）
              </option>
            ))}
          </select>

          <label htmlFor="quiz-count" className="block text-sm font-medium text-gray-700 mb-2">
            出題数を選んでください
          </label>
          <select
            id="quiz-count"
            value={String(selectedCount)}
            onChange={(e) =>
              setSelectedCount(
                e.target.value === 'all' ? 'all' : (Number(e.target.value) as QuizQuestionCount)
              )
            }
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:border-blue-400"
          >
            {QUESTION_COUNT_OPTIONS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleStart}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            クイズを始める
          </button>
        </div>
      </div>
    );
  }

  // 結果画面
  if (stage === 'finished') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">🎵 結果発表</h1>
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {activeQuizType && (
            <p className="text-sm text-gray-500 mb-4">{activeQuizType.label}</p>
          )}
          <p className="text-lg text-gray-600 mb-2">正解数</p>
          <p className="text-5xl font-bold text-blue-600">
            {score} <span className="text-2xl text-gray-400">/ {questions.length}</span>
          </p>
          {user && (
            <p className="mt-4 text-sm text-gray-500">
              🔥 連続正解記録：<span className="font-semibold text-orange-500">{streak}</span>
            </p>
          )}
        </div>

        <div className="flex justify-center mb-4">
          <XShareButton
            text={`ヨルシカクイズ（${activeQuizType?.label ?? ''}）で${questions.length}問中${score}問正解しました！\n\n🔥連続正解数：${streak}問\n`}
            hashtags={['ヨルシカ', 'ヨルシカクイズ']}
            size="medium"
            style="default"
          />
        </div>

        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          もう一度挑戦する
        </button>
      </div>
    );
  }

  // 出題中の画面
  if (!currentQuestion || !activeQuizType) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">🎵 ヨルシカクイズ</h1>
        <p className="text-sm sm:text-base text-gray-600">{activeQuizType.label}</p>
      </div>

      {/* 進捗・スコア */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          問題 {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          正解数 {score}
        </span>
      </div>

      {/* 問題 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-sm text-gray-500 mb-2">{activeQuizType.promptLabel}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">「{currentQuestion.clue}」</h2>
      </div>

      {/* 選択肢 */}
      <div className="space-y-3">
        {currentQuestion.choices.map((choice) => (
          <button
            key={choice.songId}
            onClick={() => handleSelect(choice.songId)}
            disabled={isAnswered}
            className={getChoiceStyle(choice.songId)}
          >
            {choice.songName}
          </button>
        ))}
      </div>

      {/* 結果表示 */}
      {isAnswered && (
        <div className="mt-6 text-center">
          <p
            className={`text-lg font-bold mb-4 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCorrect ? '🎉 正解！' : `❌ 不正解… 正解は「${currentQuestion.correctSongName}」`}
          </p>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            {currentIndex + 1 < questions.length ? '次の問題へ' : '結果を見る'}
          </button>
        </div>
      )}
    </div>
  );
}
