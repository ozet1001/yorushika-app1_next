'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

  // レート制限用の状態
  const [isProcessing, setIsProcessing] = useState(false);
  const lastClickTime = useRef<Record<ReactionType, number>>({
    suki: 0,
    nakeru: 0,
    ensou: 0,
  });

  const CLICK_COOLDOWN = 1000; // 1秒のクールダウン

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
      // ✅ レート制限チェック1: 処理中かどうか
      if (isProcessing) {
        console.warn('⏳ Processing... please wait');
        return { 
          success: false, 
          message: '処理中です。少々お待ちください',
          isActive: userReactions[reactionType]
        };
      }

      // ✅ レート制限チェック2: クールダウン期間
      const now = Date.now();
      const lastClick = lastClickTime.current[reactionType];
      const timeSinceLastClick = now - lastClick;

      if (timeSinceLastClick < CLICK_COOLDOWN) {
        const remainingTime = Math.ceil((CLICK_COOLDOWN - timeSinceLastClick) / 1000);
        console.warn(`⏰ Cooldown: ${remainingTime}s remaining`);
        return { 
          success: false, 
          message: `${remainingTime}秒後にもう一度お試しください`,
          isActive: userReactions[reactionType]
        };
      }

      // ✅ 処理開始
      setIsProcessing(true);
      lastClickTime.current[reactionType] = now;

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
      } finally {
        // ✅ 処理完了（1s待つ）
        setTimeout(() => {
          setIsProcessing(false);
        }, 1000);
      }
    },
    [songId, userReactions, isProcessing]
  );

  return {
    reactions,  
    userReactions,
    loading,
    error,
    isProcessing,
    toggleReaction: handleToggleReaction,
    reload: loadReactions,
  };
}
