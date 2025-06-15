"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
// firestoreからのSong型をインポート
import { Song } from "@/types/songs";


interface MainProps {
  songsData: Song[];
}

const Main = ({ songsData }: MainProps) => {
  const pathname = usePathname();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // パスから楽曲IDを取得して該当楽曲を設定
  useEffect(() => {
    const songIdMatch = pathname.match(/^\/song\/(.+)$/);
    
    if (songIdMatch) {
      const songId = songIdMatch[1];
      const song = songsData.find(s => s.id === songId);
      setSelectedSong(song || null);
      
      if (song) {
        console.log(`🎵 [Main] 楽曲詳細表示: ${song.name}`);
      } else {
        console.log(`🎵 [Main] 楽曲が見つかりません: ${songId}`);
      }
    } else {
      // ホームページまたは他のページ
      setSelectedSong(null);
      console.log(`🎵 [Main] ホームページ表示`);
    }
  }, [pathname, songsData]);

  // 楽曲詳細表示
  if (selectedSong) {
    return <SongDetailContent song={selectedSong} />;
  }

  // ホームページ表示（空白）
  return <HomeContent songsCount={songsData.length} />;
};

// ホームページの空白コンテンツ
const HomeContent = ({ songsCount }: { songsCount: number }) => {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">🎵</div>
        <h2 className="text-2xl font-semibold text-gray-700">
          楽曲を選択してください
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          左側のサイドバーから楽曲を検索・選択すると、
          こちらに詳細情報が表示されます
        </p>
        <div className="mt-8 text-sm text-gray-400">
          <p>現在 {songsCount} 件の楽曲が登録されています</p>
          <p>楽曲名、アルバム名、読み方で検索できます</p>
        </div>
      </div>
    </div>
  );
};

// 楽曲詳細コンテンツ
const SongDetailContent = ({ song }: { song: Song }) => {
  return (
    <div className="py-7 px-1">
      {/* SEO最適化されたHTML構造 */}
      <header className="mb-8">
        {/* <nav className="text-sm text-gray-600 mb-4" aria-label="パンくずリスト">
          <ol className="flex space-x-2">
            <li><a href="/" className="hover:text-blue-600">ホーム</a></li>
            <li aria-hidden="true">›</li>
            <li><a href="/songs" className="hover:text-blue-600">楽曲一覧</a></li>
            <li aria-hidden="true">›</li>
            <li className="font-medium">{song.name}</li>
          </ol>
        </nav> */}
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {song.name}
        </h1>
        {/* <p className="text-lg text-gray-600">
          <span>ヨルシカ</span> • 
          <span>{song.album}</span> • 
          <span>{song.year}</span>
        </p> */}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <article className="lg:col-span-2 space-y-6">
          {/* 基本情報 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">基本情報</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-600">アルバム</dt>
                <dd className="text-gray-800">{song.album}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">リリース</dt>
                <dd className="text-gray-800">{song.year}</dd>
              </div>
            </dl>
          </section>

          {/* 楽曲情報 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">楽曲について</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {song.song_info}
            </div>
            <h2 className="text-lg  font-semibold mt-4 mb-4">MV</h2>
              {song.mv_url && (
                <iframe 
                  className='block w-full sm:max-w-[500px] ml-1 sm:ml-5 rounded-lg' 
                  width="350" 
                  height="350" 
                  src={song.mv_url} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                />
                )}

              <p className="text-lg font-semibold mt-4 mb-4">歌詞</p>
              <div className="space-y-3">
              {song.lyrics && (
                <a
                  href={song.lyrics}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  歌詞を見る
                </a>
              )}
            </div>
          </section>

          {/* 聖地情報 */}
          {song.holy_locations.holy_locations_1.location_name && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">聖地情報</h2>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">{song.holy_locations.holy_locations_1.location_name}</h3>
                {song.holy_locations.holy_locations_1.location_address && (
                  <address className="text-gray-600 not-italic">
                    {song.holy_locations.holy_locations_1.location_address}
                  </address>
                )}
                {song.holy_locations.holy_locations_1.location_url && (
                  <a
                    href={song.holy_locations.holy_locations_1.location_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    地図を見る
                  </a>
                )}
              </div>
            </section>
          )}

          {/* グッズ情報 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">関連グッズ</h2>
              {song.goods?.goods_1?.goods_name && (
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">{song.goods?.goods_1?.goods_name}</h3>
                  {song.goods?.goods_1?.goods_info && (
                    <p className="text-gray-600">{song.goods?.goods_1?.goods_info}</p>
                  )}
                  {song.goods?.goods_1?.goods_url && (
                    <a
                      href={song.goods?.goods_1?.goods_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                    >
                      詳細を見る
                    </a>
                  )}
                </div>
              )}
              {song.goods?.goods_2?.goods_name && (
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">{song.goods?.goods_2?.goods_name}</h3>
                  {song.goods?.goods_2?.goods_info && (
                    <p className="text-gray-600">{song.goods?.goods_2?.goods_info}</p>
                  )}
                  {song.goods?.goods_2?.goods_url && (
                    <a
                      href={song.goods?.goods_2?.goods_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                    >
                      詳細を見る
                    </a>
                  )}
                </div>
              )}
              {song.goods?.goods_3?.goods_name && (
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">{song.goods?.goods_3?.goods_name}</h3>
                  {song.goods?.goods_3?.goods_info && (
                    <p className="text-gray-600">{song.goods?.goods_3?.goods_info}</p>
                  )}
                  {song.goods?.goods_3?.goods_url && (
                    <a
                      href={song.goods?.goods_3?.goods_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                    >
                      詳細を見る
                    </a>
                  )}
              </div>
            )}
          </section>


        </article>

        {/* サイドバー */}
        <aside className="space-y-6">

          {/* アクションボタン */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">リンク</h2>
            <div className="space-y-3">
              {song.lyrics && (
                <a
                  href={song.lyrics}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  歌詞を見る
                </a>
              )}
            </div>
          </section>

          {/* 参考リンク */}
          {(song.reference_list?.reference_url_1 || 
            song.reference_list?.reference_url_2 || 
            song.reference_list?.reference_url_3) && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">参考リンク</h2>
              <div className="space-y-2">
                {song.reference_list.reference_url_1 && (
                  <p>
                    <a
                      href={song.reference_list.reference_url_1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                    >
                      参考 1
                    </a>
                  </p>
                )}
                {song.reference_list.reference_url_2 && (
                  <p>
                    <a
                      href={song.reference_list.reference_url_2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                    >
                      参考 2
                    </a>
                  </p>
                )}
                {song.reference_list.reference_url_3 && (
                  <p>
                    <a
                      href={song.reference_list.reference_url_3}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                    >
                      参考 3
                    </a>
                  </p>
                )}
              </div>
            </section>
          )}

          {/* 楽曲統計 */}
          {/* <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">この楽曲について</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>歌詞:</span>
                <span>{song.lyrics ? '✅ あり' : '❌ なし'}</span>
              </div>
              <div className="flex justify-between">
                <span>MV:</span>
                <span>{song.mv_url ? '✅ あり' : '❌ なし'}</span>
              </div>
              <div className="flex justify-between">
                <span>聖地情報:</span>
                <span>{song.holy_locations?.location_name ? '✅ あり' : '❌ なし'}</span>
              </div>
              <div className="flex justify-between">
                <span>関連グッズ:</span>
                <span>{song.goods?.goods_name ? '✅ あり' : '❌ なし'}</span>
              </div>
            </div>
          </section> */}
        </aside>
      </div>
    </div>
  );
};

export default Main;