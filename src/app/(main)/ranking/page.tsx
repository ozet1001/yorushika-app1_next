import ReactionRanking from '@/app/components/ReactionRanking';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'みんなの感想ランキング | 月猫図書館',
  description: 'ヨルシカの楽曲をリアクション数でランキング。好き、泣ける、演奏してみたい、総合ランキングをチェック！',
  openGraph: {
    title: 'みんなの感想ランキング | 月猫図書館',
    description: 'ヨルシカの楽曲をリアクション数でランキング',
    type: 'website',
  },
};

export default function RankingPage() {
  return <ReactionRanking />;
}