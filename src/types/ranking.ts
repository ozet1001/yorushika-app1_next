import { Song } from '@/types/songs';
import { Reactions } from '@/types/reaction';

/**
 * ランキング用の楽曲データ
 */
export interface RankingSong {
  // 楽曲の基本情報
  song: Song;
  
  // リアクション数
  reactions: Reactions;
  
  // 総リアクション数（計算用）
  totalReactions: number;
}

/**
 * ランキングの種類
 */
export type RankingType = 'total' | 'suki' | 'nakeru' | 'ensou';