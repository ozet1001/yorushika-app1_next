import { getSongs } from "@/lib/songs";
import QuizClient from "@/app/components/Quiz/QuizClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ヨルシカクイズ | 月猫図書館',
  description: 'ヨルシカ楽曲のタイアップ作品やオマージュ作品から曲名を当てるクイズで遊べます。',
  openGraph: {
    title: 'ヨルシカクイズ | 月猫図書館',
    description: 'ヨルシカ楽曲のタイアップ作品やオマージュ作品から曲名を当てるクイズ',
    type: 'website',
  },
};

export default async function QuizPage() {
  const allSongs = await getSongs();
  return <QuizClient songsData={allSongs} />;
}
