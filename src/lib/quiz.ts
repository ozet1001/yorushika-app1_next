import { Song } from '@/types/songs';
import { QuizQuestion, QuizQuestionCount, QuizTypeConfig } from '@/types/quiz';

// 指定したクイズ種類の手がかりを持つ曲のみ抽出
export const getSongsWithClue = (songs: Song[], quizType: QuizTypeConfig): Song[] => {
  return songs.filter((song) => quizType.getClue(song) !== null);
};

const shuffle = <T,>(items: T[]): T[] => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// correctSongを正解として、選択肢付きの問題を1つ組み立てる
const buildQuestion = (
  correctSong: Song,
  allSongs: Song[],
  quizType: QuizTypeConfig
): QuizQuestion | null => {
  const clue = quizType.getClue(correctSong);
  if (!clue) return null;

  // 正解曲と曲名が異なる曲からダミー選択肢を2つ選ぶ（曲名の重複を避ける）
  const distractorPool = shuffle(allSongs.filter((song) => song.name !== correctSong.name));
  const distractors: Song[] = [];
  const usedNames = new Set<string>([correctSong.name]);

  for (const song of distractorPool) {
    if (distractors.length >= 2) break;
    if (usedNames.has(song.name)) continue;
    usedNames.add(song.name);
    distractors.push(song);
  }

  if (distractors.length < 2) return null; // 選択肢を3つ用意できない場合は出題不可

  const choices = shuffle([correctSong, ...distractors]).map((song) => ({
    songId: song.id,
    songName: song.name,
  }));

  return {
    clue,
    correctSongId: correctSong.id,
    correctSongName: correctSong.name,
    choices,
  };
};

// 指定したクイズ種類・問題数のクイズセットを生成する（同じ曲は一度しか出題されない）
export const generateQuizSet = (
  songs: Song[],
  quizType: QuizTypeConfig,
  count: QuizQuestionCount
): QuizQuestion[] => {
  const shuffledEligibleSongs = shuffle(getSongsWithClue(songs, quizType));
  const targetCount =
    count === 'all' ? shuffledEligibleSongs.length : Math.min(count, shuffledEligibleSongs.length);

  const questions: QuizQuestion[] = [];
  for (const song of shuffledEligibleSongs) {
    if (questions.length >= targetCount) break;
    const question = buildQuestion(song, songs, quizType);
    if (question) questions.push(question);
  }

  return questions;
};
