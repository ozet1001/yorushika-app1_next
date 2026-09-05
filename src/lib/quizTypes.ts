import { Song } from '@/types/songs';
import { QuizTypeConfig } from '@/types/quiz';

// タイアップ編：tieup_info_1のみを対象とする（2以降は重複データのため対象外）
const getTieupClue = (song: Song): string | null => {
  const tieupName = song.tieup_info?.tieup_info_1?.tieup_name;
  return tieupName && tieupName.trim() !== '' ? tieupName : null;
};

// オマージュ作品編：登録されている文学作品（literatures_1〜3）からランダムで1つを出題する
const getLiteratureClue = (song: Song): string | null => {
  const workNames = Object.values(song.literatures ?? {})
    .map((literature) => literature?.work_name)
    .filter((workName): workName is string => !!workName && workName.trim() !== '');

  if (workNames.length === 0) return null;
  return workNames[Math.floor(Math.random() * workNames.length)];
}

// クイズ種類の一覧。新しいクイズ（例: 聖地編）を追加する場合はここに設定を1つ足すだけでよい
export const QUIZ_TYPES: QuizTypeConfig[] = [
  {
    id: 'tieup',
    label: 'タイアップ編',
    promptLabel: 'このタイアップの曲は？',
    getClue: getTieupClue,
  },
  {
    id: 'literature',
    label: 'オマージュ編',
    promptLabel: 'この作品をオマージュした曲は？',
    getClue: getLiteratureClue,
  },
  // 例）聖地編を追加する場合:
  // {
  //   id: 'holy-location',
  //   label: '聖地編',
  //   promptLabel: 'この聖地が登場する曲は？',
  //   getClue: (song) => {
  //     const name = song.holy_locations?.holy_locations_1?.location_name;
  //     return name && name.trim() !== '' ? name : null;
  //   },
  // },
];
