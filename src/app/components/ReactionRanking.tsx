'use client';

import { useState, useEffect, useMemo } from 'react';
import { RankingSong, RankingType } from '@/types/ranking';
import { getAllSongsReactions } from '@/lib/reactions';
import { ReactionType } from '@/types/reaction';
import Link from 'next/link';

export default function ReactionRanking() {
  const [rankingType, setRankingType] = useState<RankingType>('total');
  // const [songs, setSongs] = useState<RankingSong[]>([]);
  const [allSongs, setAllSongs] = useState<RankingSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRanking() {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`📊 Loading ${rankingType} ranking...`);
        const data = await getAllSongsReactions();
        setAllSongs(data);
        console.log(`✅ Loaded ${data.length} songs`);
      } catch (err) {
        console.error('❌ Error loading ranking:', err);
        setError('ランキングの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    }
    
    loadRanking();
  }, []);

  const songs = useMemo(() => {
    if (allSongs.length === 0) return [];
    
    let sorted: RankingSong[];
    
    if (rankingType === 'total') {
      sorted = [...allSongs].sort((a, b) => b.totalReactions - a.totalReactions);
    } else {
      const type = rankingType as ReactionType;
      sorted = [...allSongs].sort((a, b) => b.reactions[type] - a.reactions[type]);
    }
    
    // 0より大きいものだけ、上位10件
    return sorted.filter(item => {
      if (rankingType === 'total') {
        return item.totalReactions > 0;
      }
      return item.reactions[rankingType as ReactionType] > 0;
    }).slice(0, 10);
  }, [allSongs, rankingType]);

  const getRankIcon = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}位`;
    }
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-400';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-400';
      case 3:
        return 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-400';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getReactionCount = (song: RankingSong): number => {
    if (rankingType === 'total') {
      return song.totalReactions;
    }

    return song.reactions[rankingType as ReactionType];
  };

  const getReactionLabel = (): string => {
    switch (rankingType) {
      case 'total':
        return '総投票数';
      case 'suki':
        return '♡ 好き';
      case 'nakeru':
        return '😢 泣ける';
      case 'ensou':
        return '🎸 演奏してみたい';
    }
  };

  const getTabStyle = (type: RankingType): string => {
    const isActive = rankingType === type;
    const baseStyle = 'px-2 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all duration-200';
    
    if (!isActive) {
      return `${baseStyle} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
    }
    
    switch (type) {
      case 'total':
        return `${baseStyle} text-sm sm:text-base bg-blue-500 text-white shadow-lg`;
      case 'suki':
        return `${baseStyle} text-sm sm:text-base bg-pink-500 text-white shadow-lg`;
      case 'nakeru':
        return `${baseStyle} text-sm sm:text-base bg-blue-500 text-white shadow-lg`;
      case 'ensou':
        return `${baseStyle} text-sm sm:text-base bg-purple-500 text-white shadow-lg`;
    }
  };

  return (
    <div id="ranking-title" className="container mx-auto px-4 py-8 max-w-4xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          みんなの感想ランキング
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          「好き」「泣ける」「演奏したい」3つの感想でのランキングです
        </p>
      </div>
      
      {/* タブ切り替え */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setRankingType('total')}
          className={getTabStyle('total')}
        >
          3つの合計
        </button>
        
        <button
          onClick={() => setRankingType('suki')}
          className={getTabStyle('suki')}
        >
          ♡ 好き
        </button>
        
        <button
          onClick={() => setRankingType('nakeru')}
          className={getTabStyle('nakeru')}
        >
          😢 泣ける
        </button>
        
        <button
          onClick={() => setRankingType('ensou')}
          className={getTabStyle('ensou')}
        >
          🎸 演奏したい
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* ローディング */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">ランキングを読み込み中...</p>
        </div>
      ) : (
        <>
          {/* ランキングリスト */}
          <div className="space-y-3">
            {songs
            .filter(item => getReactionCount(item) > 0) // 0以上のみ表示
            .map((item, index) => {
              const rank = index + 1;
              const reactionCount = getReactionCount(item);
              
              return (
                <Link
                  key={item.song.id}
                  href={`/song/${item.song.id}`}
                  className={`
                    block p-2 rounded-lg border-2 
                    transition-all duration-200
                    hover:shadow-xl hover:scale-[1.02]
                    ${getRankColor(rank)}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* 順位 */}
                    <div className="text-xl sm:text-3xl font-bold w-16 text-center flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>
                    
                    {/* 楽曲情報 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg md:text-xl truncate">
                        {item.song.name}
                      </h3>
                    </div>
                    
                    {/* リアクション数 */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl md:text-3xl font-bold text-blue-600">
                        {reactionCount}
                      </p>
                      <p className="text-xs text-gray-600 whitespace-nowrap">
                        {getReactionLabel()}
                      </p>
                    </div>
                  </div>
                  
                  {/* 総合ランキングの場合は内訳を表示 */}
                  {rankingType === 'total' && (
                    <div className="mt-3 pt-3 border-t border-gray-300 flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-pink-600">
                        <span>♡</span>
                        <span className="font-medium">{item.reactions.suki}</span>
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <span>😢</span>
                        <span className="font-medium">{item.reactions.nakeru}</span>
                      </span>
                      <span className="flex items-center gap-1 text-purple-600">
                        <span>🎸</span>
                        <span className="font-medium">{item.reactions.ensou}</span>
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* データがない場合 */}
          {songs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 mb-2">📊</p>
              <p className="text-gray-500">まだリアクションがありません</p>
              <p className="text-sm text-gray-400 mt-2">
                曲ページでリアクションを押してみましょう！
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}