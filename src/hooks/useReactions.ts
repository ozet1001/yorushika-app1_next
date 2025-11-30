'use client';

import { useState, useEffect, useCallback } from 'react';
import { getReactions, getUserReactions, toggleReaction } from '@/lib/reactions';
import { ReactionType, Reactions, UserReactions } from '@/types/reaction';

export function useReactions(songId: string) {
  const [reactions, setReactions] = useState<Reactions>({
    suki: 0,
    nakeru: 0,
    ensou: 0,
  });
  const [userReactions, setUserReactions] = useState<UserReactions>({
    suki: false,
    nakeru: false,
    ensou: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データ読み込み
  const loadReactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [reactionsData, userReactionsData] = await Promise.all([
        getReactions(songId),
        getUserReactions(songId),
      ]);

      setReactions(reactionsData);
      setUserReactions(userReactionsData);
    } catch (err) {
      console.error('Error loading reactions:', err);
      setError('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [songId]);

  useEffect(() => {
    loadReactions();
  }, [loadReactions]);

  // リアクション追加・削除（トグル）
  const handleToggleReaction = useCallback(
    async (reactionType: ReactionType) => {
      // 現在の状態を取得
      const currentValue = userReactions[reactionType];
      const newValue = !currentValue;

      console.log(`🔄 Toggling ${reactionType}: ${currentValue} → ${newValue}`);

      // 楽観的UI更新
      setReactions((prev) => ({
        ...prev,
        [reactionType]: prev[reactionType] + (newValue ? 1 : -1),
      }));
      setUserReactions((prev) => ({
        ...prev,
        [reactionType]: newValue,
      }));

      try {
        const result = await toggleReaction(songId, reactionType);

        if (!result.success) {
          console.warn('❌ Toggle failed, rolling back');
          
          // 失敗した場合は元に戻す
          setReactions((prev) => ({
            ...prev,
            [reactionType]: prev[reactionType] + (currentValue ? 1 : -1),
          }));
          setUserReactions((prev) => ({
            ...prev,
            [reactionType]: currentValue,
          }));
        } else {
          console.log('✅ Toggle successful:', result);
        }

        return result;
      } catch (err) {
        console.error('❌ Error toggling reaction:', err);

        // エラーの場合も元に戻す
        setReactions((prev) => ({
          ...prev,
          [reactionType]: prev[reactionType] + (currentValue ? 1 : -1),
        }));
        setUserReactions((prev) => ({
          ...prev,
          [reactionType]: currentValue,
        }));

        return { 
          success: false, 
          message: 'エラーが発生しました',
          isActive: currentValue
        };
      }
    },
    [songId, userReactions]
  );

  return {
    reactions,  
    userReactions,
    loading,
    error,
    toggleReaction: handleToggleReaction,
    reload: loadReactions,
  };
}
