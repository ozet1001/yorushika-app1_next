"use client";
import React, { useState, useMemo } from "react";
import Link from 'next/link';
import { MdLibraryMusic } from "react-icons/md";
import { FaMusic } from "react-icons/fa"; // タイアップアイコン用
import { RiLiveFill } from "react-icons/ri"; // ライブ映像アイコン用
// firestoreからのSong型をインポート
import { Song } from "@/types/songs";

interface SongListClientProps {
  initialSongs: Song[];
  // onSongSelect?: (songId: string) => void;
}


const SongListClient = ({ initialSongs }: SongListClientProps) => {
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyTieup, setShowOnlyTieup] = useState(false); // タイアップフィルタのstate
  const [showOnlyLive, setShowOnlyLive] = useState(false); // ライブ映像ィルタのstate

  // 検索フィルタリング + タイアップフィルタリング+ ライブ映像フィルタリング
  const filteredSongs = useMemo(() => {
    let songs = initialSongs;

    // タイアップフィルタ
    if (showOnlyTieup) {
      songs = songs.filter(song => 
        song.tieup_info?.tieup_info_1?.tieup_name && 
        song.tieup_info.tieup_info_1.tieup_name.trim() !== ''
      );
    }

    // ライブ映像フィルタ
    if (showOnlyLive) {
      songs = songs.filter(song => 
        song.live_url && 
        song.live_url.trim() !== ''
      );
    }

    // 検索フィルタ
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      songs = songs.filter(song =>
        song.name?.toLowerCase().includes(term) ||
        song.kana?.toLowerCase().includes(term) ||
        song.album?.toLowerCase().includes(term)
      );
    }

    return songs;
  }, [initialSongs, searchTerm, showOnlyTieup,showOnlyLive]);

  const handleSongClick = (songId: string) => {
    setSelectedSongId(songId);
    // onSongSelect?.(songId);
    // console.log(`選択された曲ID: ${songId}`);
  };

  // ✅ 改善4: 検索のクリア機能
  const clearSearch = () => {
    setSearchTerm("");
  };

  // ✅ 改善5: キーボードショートカット
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  // タイアップフィルタのトグル
  const toggleTieupFilter = () => {
    setShowOnlyTieup(!showOnlyTieup);
  };

  // ライブ映像フィルタのトグル
  const toggleLiveFilter = () => {
    setShowOnlyLive(!showOnlyLive);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 検索フォーム */}
      {/* ✅ 改善6: 検索フォームのUIと機能向上 */}
      <div className="p-2 pb-4 border-b border-gray-200">
        <span className="mt-2 sm:mt-6 mb-4 font-bold flex items-center">
          <MdLibraryMusic className="inline ml-1 mr-1 text-lg" />
          曲一覧（全 {filteredSongs.length}件）
        </span>

        {/* 検索バー */}
        <div className="relative mb-3">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full p-2 pl-8 pr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="曲名、アルバム名、読み方で検索..."
          />
          
          {/* 検索アイコン */}
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex lg:flex-col xl:flex-row gap-2 mb-2">
          {/* タイアップフィルタボタン */}
          <button
            onClick={toggleTieupFilter}
            className={`flex items-center gap-2 px-2 py-1 w-2/3 lg:w-[100%] xl:w-2/3 text-sm rounded-lg transition-all ${
              showOnlyTieup
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaMusic className="text-xs" />
            <span>タイアップあり</span>
            {showOnlyTieup && (
              <span className="ml-1 text-xs bg-blue-500 px-2 py-0.5 rounded-full">
                ON
              </span>
            )}
          </button>

            
          {/* ライブ映像フィルタボタン */}
          <button
            onClick={toggleLiveFilter}
            className={`flex items-center gap-2 px-2 py-1 w-2/3 lg:w-[100%] xl:w-2/3 text-sm rounded-lg transition-all ${
              showOnlyLive
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RiLiveFill className="text-xs" />
            <span>ライブ映像あり</span>
            {showOnlyLive && (
              <span className="ml-1 text-xs bg-blue-500 px-2 py-0.5 rounded-full">
                ON
              </span>
            )}
          </button>
          </div>
      </div>

      {/* 曲一覧 */}
      <div className="flex-1 overflow-y-auto">
        {filteredSongs.map((song) => (
          <div
            className={`p-3 ml-3 cursor-pointer hover:bg-blue-200 transition-colors border-b border-gray-100 ${
              selectedSongId === song.id 
                ? 'bg-blue-300 border-r-4 border-blue-800' 
                : ''
            }`}
            key={song.id}
            onClick={() => handleSongClick(song.id)}
          >
            <Link href={`/song/${song.id}`} className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 py-0">{song.name}</span>
                {/* タイアップアイコン表示 */}
                {song.tieup_info?.tieup_info_1?.tieup_name && (
                  <FaMusic className="text-xs text-blue-600" title="タイアップあり" />
                )}
                {/* ライブアイコン表示 */}
                {song.live_url && (
                  <RiLiveFill className="text-xs text-red-500" title="ライブ映像あり" />
                )}
                <span className="text-xs text-gray-500 lg:hidden">( {song.album} )</span>
              </div>
              <span className="text-sm text-gray-600 hidden lg:inline">{song.album}</span>
              <span className="text-xs text-gray-500 hidden lg:inline">{song.year}</span>
            </Link>
          </div>
        ))}
        
        {filteredSongs.length === 0 && (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">
              {searchTerm || showOnlyTieup ? '条件に一致する曲が見つかりません' : '曲がありません'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongListClient;