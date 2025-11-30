import db from '@/lib/firebase/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  // setDoc,
  // updateDoc,
  runTransaction,
  increment,
  // Timestamp,
} from 'firebase/firestore';
import { getAnonymousUserId } from '@/lib/anonymousUser';
import { ReactionType, Reactions, UserReactions } from '@/types/reaction';
import { Song } from '@/types/songs';
import { RankingSong, RankingType } from '@/types/ranking';

/**
 * リアクション数を取得
 */
export async function getReactions(songId: string): Promise<Reactions> {
  try {
    const countsRef = doc(db, 'songs', songId, 'reactions', 'counts');
    const countsSnap = await getDoc(countsRef);
    console.log(countsSnap);
    if (countsSnap.exists()) {
      const data = countsSnap.data();
      return {
        suki: data.suki || 0,
        nakeru: data.nakeru || 0,
        ensou: data.ensou || 0,
      };
    } else {
      return { suki: 0, nakeru: 0, ensou: 0 };
    }
  } catch (error) {
    console.error('Error getting reactions:', error);
    return { suki: 0, nakeru: 0, ensou: 0 };
  }
}

/**
 * ユーザーのリアクション状態を取得
 */
export async function getUserReactions(songId: string): Promise<UserReactions> {
  try {
    const userId = getAnonymousUserId();
    if (!userId) {
      return { suki: false, nakeru: false, ensou: false };
    }

    const userReactionRef = doc(
      db,
      'songs',
      songId,
      'reactions',
      userId
    );
    const userReactionSnap = await getDoc(userReactionRef);

    if (userReactionSnap.exists()) {
      const data = userReactionSnap.data();
      return {
        suki: data.suki || false,
        nakeru: data.nakeru || false,
        ensou: data.ensou || false,
      };
    } else {
      return { suki: false, nakeru: false, ensou: false };
    }
  } catch (error) {
    console.error('Error getting user reactions:', error);
    return { suki: false, nakeru: false, ensou: false };
  }
}

/**
 * リアクションを追加または削除（トグル）
 */
export async function toggleReaction(
  songId: string,
  reactionType: ReactionType  // ✅ userId パラメータを削除
): Promise<{ success: boolean; message: string; isActive: boolean }> {
  try {
    // ✅ 内部で userId を取得
    const userId = getAnonymousUserId();
    
    if (!userId) {
      console.error('❌ User ID not found');
      return {
        success: false,
        message: 'ユーザーIDが取得できませんでした',
        isActive: false,
      };
    }
    
    console.log(`🔄 Toggling reaction: ${reactionType} for song ${songId} by user ${userId}`);
    
    // ユーザーのリアクション状態を取得
    const userReactionRef = doc(db, 'songs', songId, 'reactions', userId);
    const userReactionSnap = await getDoc(userReactionRef);
    
    // 現在の状態を確認
    const currentValue = userReactionSnap.exists()
      ? userReactionSnap.data()?.[reactionType] || false
      : false;
    
    const newValue = !currentValue; // トグル（反転）
    
    console.log(`Current: ${currentValue} → New: ${newValue}`);
    
    // トランザクションで更新
    await runTransaction(db, async (transaction) => {
      // カウント用ドキュメントを取得
      const countsRef = doc(db, 'songs', songId, 'reactions', 'counts');
      const countsSnap = await transaction.get(countsRef);
      
      if (!countsSnap.exists()) {
        // counts が存在しない場合は作成
        transaction.set(countsRef, {
          suki: 0,
          nakeru: 0,
          ensou: 0,
          updatedAt: new Date(),
        });
      }
      
      // ユーザーのリアクションを更新
      transaction.set(
        userReactionRef,
        {
          [reactionType]: newValue,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      
      // カウントを更新（ON なら +1、OFF なら -1）
      const incrementValue = newValue ? 1 : -1;
      transaction.update(countsRef, {
        [reactionType]: increment(incrementValue),
        updatedAt: new Date(),
      });
    });
    
    console.log(`✅ Reaction toggled successfully: ${reactionType} = ${newValue}`);
    
    return {
      success: true,
      message: newValue ? 'リアクションを追加しました' : 'リアクションを取り消しました',
      isActive: newValue,
    };
  } catch (error) {
    console.error('❌ Error toggling reaction:', error);
    return {
      success: false,
      message: 'エラーが発生しました',
      isActive: false,
    };
  }
}

/**
 * 全曲のリアクションデータを取得
 */
export async function getAllSongsReactions(): Promise<RankingSong[]> {
  try {
    console.log('🔍 Fetching all songs with reactions...');
    
    const songsRef = collection(db, 'songs');
    const songsSnap = await getDocs(songsRef);
    
    const songsWithReactions = await Promise.all(
      songsSnap.docs.map(async (songDoc) => {
        const songData = songDoc.data() as Song;
        
        // リアクション数を取得
        const countsRef = doc(db, 'songs', songDoc.id, 'reactions', 'counts');
        const countsSnap = await getDoc(countsRef);
        
        const reactions: Reactions = countsSnap.exists()
          ? {
              suki: countsSnap.data().suki || 0,
              nakeru: countsSnap.data().nakeru || 0,
              ensou: countsSnap.data().ensou || 0,
            }
          : { suki: 0, nakeru: 0, ensou: 0 };
        
        const totalReactions = reactions.suki + reactions.nakeru + reactions.ensou;
        
        return {
          song: {
            ...songData,
            id: songDoc.id,
          },
          reactions,
          totalReactions,
        } as RankingSong;
      })
    );
    
    console.log(`✅ Fetched ${songsWithReactions.length} songs`);
    return songsWithReactions;
  } catch (error) {
    console.error('❌ Error getting all songs reactions:', error);
    return [];
  }
}

/**
 * 特定のリアクションタイプでソートして上位を取得
 */
export async function getTopSongsByReaction(
  reactionType: ReactionType,
  limitCount: number = 10
): Promise<RankingSong[]> {
  try {
    const songsWithReactions = await getAllSongsReactions();
    
    // リアクション数でソート（降順）
    const sorted = songsWithReactions
      .filter((item) => !item.song.isDeleted) // 削除済みを除外
      .sort((a, b) => b.reactions[reactionType] - a.reactions[reactionType]);
    
    return sorted.slice(0, limitCount);
  } catch (error) {
    console.error('❌ Error getting top songs by reaction:', error);
    return [];
  }
}

/**
 * 総合ランキング（全リアクションの合計）
 */
export async function getTopSongsByTotal(limitCount: number = 10): Promise<RankingSong[]> {
  try {
    const songsWithReactions = await getAllSongsReactions();
    
    // 総リアクション数でソート（降順）
    const sorted = songsWithReactions
      .filter((item) => !item.song.isDeleted) // 削除済みを除外
      .sort((a, b) => b.totalReactions - a.totalReactions);
    
    return sorted.slice(0, limitCount);
  } catch (error) {
    console.error('❌ Error getting top songs by total:', error);
    return [];
  }
}

/**
 * ランキングタイプに応じてデータを取得
 */
export async function getRanking(
  type: RankingType,
  limit: number = 10
): Promise<RankingSong[]> {
  if (type === 'total') {
    return getTopSongsByTotal(limit);
  } else {
    return getTopSongsByReaction(type as ReactionType, limit);
  }
}