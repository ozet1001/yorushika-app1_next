"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
// firestoreからのSong型をインポート
import { Song } from "@/types/songs";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import XShareButton from "@/app/components/XShareButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface MainProps {
  songsData: Song[];
}

// アフィリエイトリンクの判定関数
// URLが楽天またはAmazonのアフィリエイトリンクかどうかを判定
// MEMO: レンダリング時に毎回読込みされないように、コンポーネントの外に定義
const isAffiliateLink = (url: string): boolean => {
  if (!url) return false;

  const rakutenPatterns = [
    "hb.afl.rakuten.co.jp",
    "af.moshimo.com",
    "px.a8.net",
    "rakuten.co.jp",
  ];

  const amazonPatterns = [
    "amazon.co.jp",
    // "amzn.to",
    "amazon.com",
    "associates-amazon.com",
  ];

  const allAffiliatePatterns = [...rakutenPatterns, ...amazonPatterns];

  return allAffiliatePatterns.some((pattern) => url.includes(pattern));
};

const Main = ({ songsData }: MainProps) => {
  const pathname = usePathname();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // パスから楽曲IDを取得して該当楽曲を設定
  useEffect(() => {
    const songIdMatch = pathname.match(/^\/song\/(.+)$/);

    if (songIdMatch) {
      const songId = songIdMatch[1];
      const song = songsData.find((s) => s.id === songId);
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
    <div className="py-5 px-1">
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

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 ml-3">
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
          
          {/* Xシェアボタン追加 */}
          <div className="ml-1 mb-1">
            <XShareButton 
              text={`ヨルシカ「${song.name}」の楽曲情報✨`}
              hashtags={["ヨルシカ", song.name, "楽曲情報"]}
              size="small"
              style="default"
            />
          </div>
          {/* 基本情報 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">基本情報</h2>
            <div className="mb-3 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <dl className="space-y-3">
              <div>
                <dt className="text-base font-medium text-gray-600">アルバム</dt>
                <dd className="text-gray-800">{song.album}</dd>
              </div>
              <div>
                <dt className="text-base font-medium text-gray-600">リリース</dt>
                <dd className="text-gray-800">{song.year}</dd>
              </div>
            </dl>
          </section>

          {/* 演奏情報 */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">演奏情報</h2>
              <div className="mb-3 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              {song.play_info.bpm && (
                <>
                  <h2 className="text-sm sm:text-md font-semibold mt-2 mb-2">BPM：{song.play_info.bpm}</h2>
                  <h2 className="text-sm sm:text-md font-semibold mb-2">Key：{song.play_info.key}</h2>
                  <h2 className="text-sm sm:text-md font-semibold mb-2">簡易コード：{song.play_info.capo}</h2>
                  {/* <h2 className="text-md font-semibold mb-2">拍子：{song.play_info.time_signature}</h2> */}
                  <p className="mt-2 text-sm text-gray-700">※ 演奏の参考情報です</p>
                </>
              )}
              </section>


          {/* 楽曲情報 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">楽曲について</h2>
            <div className="mb-3 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {song.song_info}
            </div>
            <h2 className="text-lg font-semibold mt-4 mb-4">MV・楽曲</h2>
            {song.mv_url ? (
              <iframe
                className="block w-full sm:max-w-[500px] ml-1 sm:ml-5 rounded-lg"
                width="350"
                height="300"
                src={song.mv_url}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="mt-4 mb-4 pl-4 text-gray-500">MV・楽曲メディアなし</div>
            )}

            {/* <h2 className="text-lg font-semibold mt-4 mb-4">ライブ</h2>
                {song.live_url ? (
                  <>
                    <iframe
                      className="block w-full sm:max-w-[500px] ml-1 sm:ml-5 rounded-lg"
                      width="350"
                      height="350"
                      src={song.live_url}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </>
                ) : (
                  <div className="mt-4 mb-4 pl-4 text-gray-500">ライブ映像なし</div>
                )} */}


              {song.lyrics && (
                <>
                  <p className="text-lg font-semibold mt-4 mb-4">歌詞</p>
                  <div className="space-y-3">
                    <a
                      href={song.lyrics}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      歌詞を見る
                    </a>
                  </div>
                </>
              )}

          </section>
          {/* 聖地情報 */}
          {song?.holy_locations?.holy_locations_1?.location_name && (
            <section className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4 sm:p-8 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">聖地情報</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              
              <div className="space-y-8">
                {/* 1つ目の聖地情報 */}
                <div className="bg-white rounded-lg p-3 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-400">
                  <h3 className="font-bold text-xl text-gray-800 mb-3 relative inline-block">
                    <span className="relative z-10">{song.holy_locations.holy_locations_1.location_name}</span>
                    <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-200 opacity-60 -z-10"></span>
                  </h3>
                  {song?.holy_locations?.holy_locations_1?.location_address && (
                    <address className="text-gray-600 not-italic mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {song.holy_locations.holy_locations_1.location_address}
                    </address>
                  )}
                  <div className="flex-col gap-3 items-star">
                    {song?.holy_locations?.holy_locations_1?.location_url && (
                      <a
                        href={song.holy_locations.holy_locations_1.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        地図を見る
                      </a>
                    )}
                    {song?.holy_locations?.holy_locations_1?.location_img_1 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="mr-2">聖地画像 1</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                        <div className="flex justify-start">
                          <div className="relative w-full max-w-lg">
                            <Image
                              src={song.holy_locations.holy_locations_1.location_img_1}
                              alt={`${song.holy_locations.holy_locations_1.location_name}の写真`}
                              width={600}
                              height={600}
                              className="mt-4 w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 500px"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {song?.holy_locations?.holy_locations_1?.location_img_1_account_name && (
                      <div className="mt-2 text-xs sm:text-sm text-gray-600">
                        <span className="mr-1">📸 by</span>
                        <a
                          href={`${song.holy_locations.holy_locations_1.location_img_1_account_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200"
                        >
                          @{song.holy_locations.holy_locations_1.location_img_1_account_name.replace('@', '')}
                        </a>
                         さん
                      </div>
                    )}
                    {song?.holy_locations?.holy_locations_1?.location_img_2 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="mr-2">聖地画像 2</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                        <div className="flex justify-start">
                          <div className="relative w-full max-w-lg">
                            <Image
                              src={song.holy_locations.holy_locations_1.location_img_2}
                              alt={`${song.holy_locations.holy_locations_1.location_name}の写真`}
                              width={600}
                              height={600}
                              className="mt-4 w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 500px"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {song?.holy_locations?.holy_locations_1?.location_img_2_account_name && (
                      <div className="mt-2 text-xs sm:text-sm text-gray-600">
                        <span className="mr-1">📸 by</span>
                        <a
                          href={`${song.holy_locations.holy_locations_1.location_img_2_account_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200"
                        >
                          @{song.holy_locations.holy_locations_1.location_img_2_account_name.replace('@', '')}
                        </a>
                         さん
                      </div>
                    )}
                    {song?.holy_locations?.holy_locations_1?.location_img_3 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="mr-2">聖地画像 3</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                        <div className="flex justify-start">
                          <div className="relative w-full max-w-lg">
                            <Image
                              src={song.holy_locations.holy_locations_1.location_img_3}
                              alt={`${song.holy_locations.holy_locations_1.location_name}の写真`}
                              width={600}
                              height={600}
                              className="mt-4 w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 500px"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {song?.holy_locations?.holy_locations_1?.location_img_3_account_name && (
                      <div className="mt-2 text-xs sm:text-sm text-gray-600">
                        <span className="mr-1">📸 by</span>
                        <a
                          href={`${song.holy_locations.holy_locations_1.location_img_3_account_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200"
                        >
                          @{song.holy_locations.holy_locations_1.location_img_3_account_name.replace('@', '')}
                        </a>
                        さん
                      </div>
                    )}
                  </div>
                </div>

                {/* 2つ目の聖地情報 */}
                {song?.holy_locations?.holy_locations_2?.location_name && (
                  <div className="bg-white rounded-lg p-3 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-purple-400">
                    <h3 className="font-bold text-xl text-gray-800 mb-3 relative inline-block">
                      <span className="relative z-10 ">{song.holy_locations.holy_locations_2.location_name}</span>
                      <span className="absolute bottom-0 left-0 w-full h-2 bg-purple-200 opacity-60 -z-10"></span>
                    </h3>
                    {song?.holy_locations?.holy_locations_2?.location_address && (
                      <address className="text-gray-600 not-italic mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {song.holy_locations.holy_locations_2.location_address}
                      </address>
                    )}
                    {song?.holy_locations?.holy_locations_2?.location_url && (
                      <a
                        href={song.holy_locations.holy_locations_2.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        地図を見る
                      </a>
                    )}
                    {song?.holy_locations?.holy_locations_2?.location_img_1 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="mr-2">聖地画像 1</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                        <div className="flex justify-start">
                          <div className="relative w-full max-w-lg">
                            <Image
                              src={song.holy_locations.holy_locations_2.location_img_1}
                              alt={`${song.holy_locations.holy_locations_2.location_name}の写真`}
                              width={600}
                              height={600}
                              className="mt-4 w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 500px"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {song?.holy_locations?.holy_locations_2?.location_img_1_account_name && (
                      <div className="mt-2 text-xs sm:text-sm text-gray-600">
                        <span className="mr-1">📸 by</span>
                        <a
                          href={`${song.holy_locations.holy_locations_2.location_img_1_account_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200"
                        >
                          @{song.holy_locations.holy_locations_2.location_img_1_account_name.replace('@', '')}
                        </a>
                        さん
                      </div>
                    )}
                    {song?.holy_locations?.holy_locations_2?.location_img_2 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="mr-2">聖地画像 2</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                        <div className="flex justify-start">
                          <div className="relative w-full max-w-lg">
                            <Image
                              src={song.holy_locations.holy_locations_2.location_img_2}
                              alt={`${song.holy_locations.holy_locations_2.location_name}の写真`}
                              width={600}
                              height={600}
                              className="mt-4 w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 500px"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {song?.holy_locations?.holy_locations_2?.location_img_2_account_name && (
                      <div className="mt-2 text-xs sm:text-sm text-gray-600">
                        <span className="mr-1">📸 by</span>
                        <a
                          href={`${song.holy_locations.holy_locations_2.location_img_2_account_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200"
                        >
                          @{song.holy_locations.holy_locations_2.location_img_2_account_name.replace('@', '')}
                        </a>
                        さん
                      </div>
                    )}
                    {song?.holy_locations?.holy_locations_2?.location_img_3 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="mr-2">聖地画像 3</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                        <div className="flex justify-start">
                          <div className="relative w-full max-w-lg">
                            <Image
                              src={song.holy_locations.holy_locations_2.location_img_3}
                              alt={`${song.holy_locations.holy_locations_2.location_name}の写真`}
                              width={600}
                              height={600}
                              className="mt-4 w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 500px"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {song?.holy_locations?.holy_locations_2?.location_img_3_account_name && (
                      <div className="mt-2 text-xs sm:text-sm text-gray-600">
                        <span className="mr-1">📸 by</span>
                        <a
                          href={`${song.holy_locations.holy_locations_2.location_img_3_account_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200"
                        >
                          @{song.holy_locations.holy_locations_2.location_img_3_account_name.replace('@', '')}
                        </a>
                        さん
                      </div>
                    )}
                  </div>
                )}

                {/* 3つ目の聖地情報 */}
                {song?.holy_locations?.holy_locations_3?.location_name && (
                  <div className="bg-white rounded-lg p-3 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-pink-400">
                    <h3 className="font-bold text-xl text-gray-800 mb-3 relative inline-block">
                      <span className="relative z-10">{song.holy_locations.holy_locations_3.location_name}</span>
                      <span className="absolute bottom-0 left-0 w-full h-2 bg-pink-200 opacity-60 -z-10"></span>
                    </h3>
                    {song?.holy_locations?.holy_locations_3?.location_address && (
                      <address className="text-gray-600 not-italic mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {song.holy_locations.holy_locations_3.location_address}
                      </address>
                    )}
                    {song?.holy_locations?.holy_locations_3?.location_url && (
                      <a
                        href={song.holy_locations.holy_locations_3.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        地図を見る
                      </a>
                    )}
                    {song?.holy_locations?.holy_locations_3?.location_img_1 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="mr-2">聖地画像 1</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                        <div className="flex justify-start">
                          <div className="relative w-full max-w-lg">
                            <Image
                              src={song.holy_locations.holy_locations_3.location_img_1}
                              alt={`${song.holy_locations.holy_locations_3.location_name}の写真`}
                              width={600}
                              height={600}
                              className="mt-4 w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 500px"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {song?.holy_locations?.holy_locations_3.location_img_1_account_name && (
                      <div className="mt-2 text-xs sm:text-sm text-gray-600">
                        <span className="mr-1">📸 by</span>
                        <a
                          href={`${song.holy_locations.holy_locations_3.location_img_1_account_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200"
                        >
                          @{song.holy_locations.holy_locations_3.location_img_1_account_name.replace('@', '')}
                        </a>
                        さん
                      </div>
                  )}
                  {song?.holy_locations?.holy_locations_3?.location_img_2 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="mr-2">聖地画像 2</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                      <div className="flex justify-start">
                        <div className="relative w-full max-w-lg">
                          <Image
                            src={song.holy_locations.holy_locations_3.location_img_2}
                            alt={`${song.holy_locations.holy_locations_3.location_name}の写真`}
                            width={600}
                            height={600}
                            className="mt-4 w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 500px"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {song?.holy_locations?.holy_locations_3.location_img_2_account_name && (
                      <div className="mt-2 text-xs sm:text-sm text-gray-600">
                        <span className="mr-1">📸 by</span>
                        <a
                          href={`${song.holy_locations.holy_locations_3.location_img_2_account_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200"
                        >
                          @{song.holy_locations.holy_locations_3.location_img_2_account_name.replace('@', '')}
                        </a>
                        さん
                      </div>
                  )}
                  {song?.holy_locations?.holy_locations_3?.location_img_3 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="mr-2">聖地画像 3</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                      <div className="flex justify-start">
                        <div className="relative w-full max-w-lg">
                          <Image
                            src={song.holy_locations.holy_locations_3.location_img_3}
                            alt={`${song.holy_locations.holy_locations_3.location_name}の写真`}
                            width={600}
                            height={600}
                            className="mt-4 w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 500px"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {song?.holy_locations?.holy_locations_3.location_img_3_account_name && (
                      <div className="mt-2 text-xs sm:text-sm text-gray-600">
                        <span className="mr-1">📸 by</span>
                        <a
                          href={`${song.holy_locations.holy_locations_3.location_img_3_account_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200"
                        >
                          @{song.holy_locations.holy_locations_3.location_img_3_account_name.replace('@', '')}
                        </a>
                        さん
                      </div>
                  )}
                  </div>
                )}
              </div>
              {/* 募集文 */}
              <div className="mt-5 p-3 bg-blue-50 border-l-4 border-blue-300 rounded-r-lg">
                <p className="text-sm text-gray-600">
                  📸 <span className="font-medium">ここに載せる聖地画像ほしいです！</span><br /><br />
                  聖地画像を載せてもいいよ！って方は、
                  <a 
                    href="https://x.com/GuanDou29555" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline mx-1"
                  >
                    X
                  </a>
                  へDM等いただけますと大変嬉しいです！🙏<br />
                </p>
              </div>
            </section>
          )}

          {/* オマージュ作品 */}
          {/* {song?.literatures?.literatures_1?.work_name && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-2">オマージュ作品</h2>
              <div className="mb-2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <div className="space-y-3">
                {Object.entries(song.literatures)
                  .filter(([, literature]) => literature.work_name)
                  .map(([key, literature]) => (
                    <div key={key} className="border-l-4 border-blue-200 pl-4 py-2">
                      <h3 className="font-medium text-lg text-gray-800">
                        <a 
                          href={literature.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors duration-200"
                        >
                          {literature.work_name}
                        </a>
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        著者: {literature.author}
                      </p>
                    </div>
                  ))}
                </div>
            </section>
          )} */}

          {/* タイアップ情報 */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-2">タイアップ情報</h2>
              <div className="mb-5 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="space-y-4">
                {Object.entries(song.tieup_info)
                  .filter(([, tieup_info]) => tieup_info.tieup_name)
                  .map(([key, tieup_info]) => {
                    // YouTubeのビデオIDをURLから抽出する関数
                    const getYoutubeVideoId = (url: string) => {
                      if (!url) return null;
                      // 標準的なYouTube URL、短縮URL、埋め込みURLなどに対応する正規表現
                      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                      const match = url.match(regExp);
                      return (match && match[2].length === 11) ? match[2] : null;
                    };

                    const videoId = getYoutubeVideoId(tieup_info.tieup_url);

                    return (
                      <div key={key} className="border-l-4 border-blue-200 pl-4 py-2">
                        <h3 className="font-medium text-lg text-gray-800">
                          {tieup_info.tieup_name}
                        </h3>

                        {/* videoIdがあればYouTube埋め込み、なければ通常のリンクを表示 */}
                        {videoId ? (
                          <div className="mt-2 w-full">
                            <div className="relative w-full aspect-video max-w-[500px]">
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-600 text-sm mt-1">
                            <a 
                              href={tieup_info.tieup_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 transition-colors duration-200 break-all"
                            >
                            {tieup_info.tieup_url}
                            </a>
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </section>

          {/* グッズ情報 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">関連グッズ</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            {song.goods?.goods_1?.goods_name && (
              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-base">
                  ・ {song.goods?.goods_1?.goods_name}
                </h3>
                {song.goods?.goods_1?.goods_info && (
                  <p className="text-gray-600">
                      {song.goods?.goods_1?.goods_info}
                  </p>
                )}
                {isAffiliateLink(song.goods.goods_1.goods_url) ? (
                  // 楽天・Amazonアフィリエイトの場合：そのまま表示
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(song.goods.goods_1.goods_url),
                    }}
                  />
                ) : (
                  // それ以外の場合：詳細を見るボタン
                  <a
                    href={song.goods.goods_1.goods_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 transition-colors"
                  >
                    詳細を見る
                  </a>
                )}
              </div>
            )}
            {song.goods?.goods_2?.goods_name && (
              <div className="space-y-2 mt-4">
                <h3 className="font-medium text-base">
                  ・ {song.goods?.goods_2?.goods_name}
                </h3>
                {song.goods?.goods_2?.goods_info && (
                  <p className="text-gray-600">
                      {song.goods?.goods_2?.goods_info}
                  </p>
                )}
                {isAffiliateLink(song.goods.goods_2.goods_url) ? (
                  // 楽天・Amazonアフィリエイトの場合：そのまま表示
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(song.goods.goods_2.goods_url),
                    }}
                  />
                ) : (
                  // それ以外の場合：詳細を見るボタン
                  <a
                    href={song.goods.goods_2.goods_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 transition-colors"
                  >
                    詳細を見る
                  </a>
                )}
              </div>
            )}
            {song.goods?.goods_3?.goods_name && (
              <div className="space-y-2 mt-4">
                <h3 className="font-medium text-base">
                  ・ {song.goods?.goods_3?.goods_name}
                </h3>
                {song.goods?.goods_3?.goods_info && (
                  <p className="text-gray-600">
                      {song.goods?.goods_3?.goods_info}
                  </p>
                )}
                {isAffiliateLink(song.goods.goods_3.goods_url) ? (
                  // 楽天・Amazonアフィリエイトの場合：そのまま表示
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(song.goods.goods_3.goods_url),
                    }}
                  />
                ) : (
                  // それ以外の場合：詳細を見るボタン
                  <a
                    href={song.goods.goods_3.goods_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-purple-500 text-white px-2 py-2 rounded hover:bg-purple-600 transition-colors"
                  >
                    詳細を見る
                  </a>
                )}
              </div>
            )}
          </section>
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-2">楽曲考察</h2>
              <div className="mb-2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>

              {/* 考察情報 */}
              {(song?.song_analysis?.song_analysis_1?.content ||
                song?.song_analysis?.song_analysis_2?.content ||
                song?.song_analysis?.song_analysis_3?.content ||
                song?.song_analysis?.song_analysis_4?.content ||
                song?.song_analysis?.song_analysis_5?.content) && (

                  <div className="space-y-6">
                    {/* song_analysis_1 */}
                    {song?.song_analysis?.song_analysis_1?.content && (
                      <div className="bg-white rounded-lg border border-gray-200 mb-6  p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-4">
                          <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">
                            {song.song_analysis.song_analysis_1.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            {song.song_analysis.song_analysis_1.account_url ? (
                              <a 
                                href={song.song_analysis.song_analysis_1.account_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
                              >
                                {song.song_analysis.song_analysis_1.account_name || '匿名'}
                              </a>
                            ) : (
                              <span className="text-gray-600 font-medium text-sm">
                                {song.song_analysis.song_analysis_1.account_name || '匿名'}
                              </span>
                            )}
                          </div>

                          {/* <div className="flex items-center space-x-1">
                            <span className="text-red-500">♥</span>
                            <span className="text-sm text-gray-600">
                              {song.song_analysis.song_analysis_1.like_count || 0}
                            </span>
                          </div> */}
                        </div>
                      </div>
                    )}

                    {/* song_analysis_2 */}
                    {song?.song_analysis?.song_analysis_2?.content && (
                      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-4">
                          <p className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                            {song.song_analysis.song_analysis_2.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            {song.song_analysis.song_analysis_2.account_url ? (
                              <a 
                                href={song.song_analysis.song_analysis_2.account_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
                              >
                                {song.song_analysis.song_analysis_2.account_name || '匿名'}
                              </a>
                            ) : (
                              <span className="text-gray-600 font-medium text-sm">
                                {song.song_analysis.song_analysis_2.account_name || '匿名'}
                              </span>
                            )}
                          </div>

                          {/* <div className="flex items-center space-x-1">
                            <span className="text-red-500">♥</span>
                            <span className="text-sm text-gray-600">
                              {song.song_analysis.song_analysis_2.like_count || 0}
                            </span>
                          </div> */}
                        </div>
                      </div>
                    )}

                    {/* song_analysis_3 */}
                    {song?.song_analysis?.song_analysis_3?.content && (
                      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-4">
                          <p className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                            {song.song_analysis.song_analysis_3.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            {song.song_analysis.song_analysis_3.account_url ? (
                              <a 
                                href={song.song_analysis.song_analysis_3.account_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
                              >
                                {song.song_analysis.song_analysis_3.account_name || '匿名'}
                              </a>
                            ) : (
                              <span className="text-gray-600 font-medium text-sm">
                                {song.song_analysis.song_analysis_3.account_name || '匿名'}
                              </span>
                            )}
                          </div>

                          {/* <div className="flex items-center space-x-1">
                            <span className="text-red-500">♥</span>
                            <span className="text-sm text-gray-600">
                              {song.song_analysis.song_analysis_3.like_count || 0}
                            </span>
                          </div> */}
                        </div>
                      </div>
                    )}

                    {/* song_analysis_4 */}
                    {song?.song_analysis?.song_analysis_4?.content && (
                      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-4">
                          <p className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                            {song.song_analysis.song_analysis_4.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            {song.song_analysis.song_analysis_4.account_url ? (
                              <a 
                                href={song.song_analysis.song_analysis_4.account_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
                              >
                                {song.song_analysis.song_analysis_4.account_name || '匿名'}
                              </a>
                            ) : (
                              <span className="text-gray-600 font-medium text-sm">
                                {song.song_analysis.song_analysis_4.account_name || '匿名'}
                              </span>
                            )}
                          </div>

                          {/* <div className="flex items-center space-x-1">
                            <span className="text-red-500">♥</span>
                            <span className="text-sm text-gray-600">
                              {song.song_analysis.song_analysis_4.like_count || 0}
                            </span>
                          </div> */}
                        </div>
                      </div>
                    )}

                    {/* song_analysis_5 */}
                    {song?.song_analysis?.song_analysis_5?.content && (
                      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-4">
                          <p className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                            {song.song_analysis.song_analysis_5.content}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            {song.song_analysis.song_analysis_5.account_url ? (
                              <a 
                                href={song.song_analysis.song_analysis_5.account_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
                              >
                                {song.song_analysis.song_analysis_5.account_name || '匿名'}
                              </a>
                            ) : (
                              <span className="text-gray-600 font-medium text-sm">
                                {song.song_analysis.song_analysis_5.account_name || '匿名'}
                              </span>
                            )}
                          </div>

                          {/* <div className="flex items-center space-x-1">
                            <span className="text-red-500">♥</span>
                            <span className="text-sm text-gray-600">
                              {song.song_analysis.song_analysis_5.like_count || 0}
                            </span>
                          </div> */}
                        </div>
                      </div>
                    )}
                  </div>
              )}

            {/* 考察募集文 */}
            <div className="max-w-2xl mt-8 p-2">
              <div className="rounded-lg border border-gray-200 p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
                
                <p className="text-gray-800 text-base mb-4 leading-relaxed font-medium">
                  🌙 あなたの考察を聞かせてください！
                </p>
                
                <ul className="text-gray-600 mb-4 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 mt-0.5">•</span>
                    歌詞の意味や解釈
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 mt-0.5">•</span>
                    n-bunaさんが創る楽曲構成・各楽器パートのフレーズについて
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 mt-0.5">•</span>
                    suisさんの歌声の表現
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 mt-0.5">•</span>
                    MVや小説との関連性
                  </li>
                </ul>
                
                <p className="text-gray-700 mb-4 leading-normal text-sm">
                  どんな角度からの解釈でも大歓迎です✨
                </p>
                
                <p className="text-purple-600 font-medium mb-4 text-sm">
                  XでDMをいただけると嬉しいです🎵
                </p>
                
                <div className="border-t border-gray-200 pt-3 mt-4 bg-white/50 -mx-4 px-4 rounded-b-lg">
                  <p className="text-xs text-gray-500 text-center">
                    ※ ここに載せる考察は個人の見解であり、公式の見解ではありません
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* サイドバー */}
        <aside className="space-y-6">
          {/* 参考リンク */}
          {(song.reference_list?.reference_url_1 ||
            song.reference_list?.reference_url_2 ||
            song.reference_list?.reference_url_3) && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">参考リンク</h2>
              <div className="mb-2 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
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
      <Accordion type="single" collapsible className="w-[100%] sm:w-[66%] mt-6 bg-blue-200 rounded-md">
        <AccordionItem value="greeting">
          <AccordionTrigger className="pl-5 pr-5 no-underline hover:no-underlin">管理人メッセージ</AccordionTrigger>
          <AccordionContent className="bg-white rounded-b-mde">
            <div className="space-y-4 text-sm pt-5 w-[95%] mx-auto pb-3">
              <p>こんにちは、管理人のたにぐちです。</p>
                <p className="text-sm leading-loose">
                  このサイトは、ヨルシカの楽曲情報をまとめたファンサイトです。 
                  <br />
                  ネットだと情報が点在していて見つけるのが大変なので、曲ごとに整理したら欲しい情報に素早くアクセスできるのでは？と思い作成しました。
                  <br /> 
                  楽曲の考察や関連する写真なども載せれるようにして、皆さんからのご協力をいただきながら、 より充実したファンサイトに育てていきたいと思っています。<br/>
                  まだ成長途中で定期的にアップデートしていきますので、ぜひブックマークして時々覗いてみてくださいね。
                </p>
                                        
                <p className="text-sm">
                  ご要望や修正点などがございましたら、Xの
                  <a 
                    href="https://x.com/GuanDou29555" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline mx-1"
                  >
                    @GuanDou29555
                  </a>
                  までお気軽にご連絡ください。
                </p>
                    
                  <div className="border-t border-gray-200 pt-3 text-left">
                    <p className="text-xs text-gray-500">
                      ※ このサイトは非公式のファンサイトです。
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
    </div>
  );
};

export default Main;
