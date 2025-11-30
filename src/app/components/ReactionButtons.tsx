'use client';

import { useReactions } from '@/hooks/useReactions';
import { ReactionType } from '@/types/reaction';

interface ReactionButtonsProps {
  songId: string;
}

export default function ReactionButtons({ songId }: ReactionButtonsProps) {
  const { reactions, userReactions, loading, error, toggleReaction } =
    useReactions(songId);

  const handleClick = async (type: ReactionType) => {
    const result = await toggleReaction(type);
    if (!result.success) {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2 items-center">
        <div className="animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-700">※ この曲についてどう思う？以下のボタンをタップして投票をお願いします！</p>
      <p className="text-sm text-gray-700">※ 上部ヘッダーメニューの「<span><a href='/ranking' className="text-blue-500">みんなの感想ランキング</a></span>」の投票数に加算されます。</p>
      <div className="flex flex-row flex-wrap gap-2 mt-2">
        {/* 好き */}
        <button
          onClick={() => handleClick('suki')}
          // disabled={userReactions.suki}
          className={`
            flex items-center gap-2 px-1 py-1 rounded-lg border-2 
            transition-all duration-200
            ${
              userReactions.suki
                ? 'bg-pink-100 border-pink-500 hover:bg-pink-200'
                : 'bg-white border-gray-300 hover:border-pink-500 hover:bg-pink-50'
            }
          `}
        >
          <span className="text-base sm:text-lg">♡</span>
          <span className="flex-1 text-left font-medium text-xs sm:text-sm">好き</span>
          <span className="text-gray-600 text-sm">{reactions.suki}人</span>
          {userReactions.suki && (
            <span className="text-pink-500 font-bold text-sm">✓</span>
          )}
        </button>

        {/* 泣ける */}
        <button
          onClick={() => handleClick('nakeru')}
          // disabled={userReactions.nakeru}
          className={`
            flex items-center gap-2 px-1 py-1 rounded-lg border-2 
            transition-all duration-200
            ${
              userReactions.nakeru
                ? 'bg-blue-100 border-blue-500 hover:bg-blue-200'
                : 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }
          `}
        >
          <span className="text-base sm:text-lg">😢</span>
          <span className="flex-1 text-left font-medium text-xs sm:text-sm">泣ける</span>
          <span className="text-gray-600 text-sm">{reactions.nakeru}人</span>
          {userReactions.nakeru && (
            <span className="text-blue-500 font-bold text-sm">✓</span>
          )}
        </button>

        {/* 演奏してみたい */}
        <button
          onClick={() => handleClick('ensou')}
          // disabled={userReactions.ensou}
          className={`
            flex items-center gap-2 px-1 py-1 rounded-lg border-2 
            transition-all duration-200
            ${
              userReactions.ensou
                ? 'bg-purple-100 border-purple-500 hover:bg-purple-200'
                : 'bg-white border-gray-300 hover:border-purple-500 hover:bg-purple-50'
            }
          `}
        >
          <span className="text-base sm:text-lg">🎸</span>
          <span className="flex-1 text-left font-medium text-xs sm:text-sm">演奏したい</span>
          <span className="text-gray-600 text-sm">{reactions.ensou}人</span>
          {userReactions.ensou && (
            <span className="text-purple-500 font-bold text-sm">✓</span>
          )}
        </button>
      </div>
    </div>
  );
}