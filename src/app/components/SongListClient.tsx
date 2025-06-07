"use client";

import React, { useState, useMemo } from "react";
import Link from 'next/link';

interface Song {
  id: string;
  name: string;
  kana: string;
  album: string;
  year: string;
  song_info: string;
  lyrics: string;
  mv_url: string;
  photo: string;
  holy_locations?: {
    location_name: string;
    location_address: string;
    location_url: string;
  };
  goods?: {
    goods_name: string;
    goods_info: string;
    goods_url: string;
  };
  reference_list?: {
    reference_url_1: string;
    reference_url_2: string;
    reference_url_3: string;
  };
  createdAt?: string | null;
  editAt?: string | null;
  isDeleted?: boolean;
}

interface SongListClientProps {
  initialSongs: Song[];
  // onSongSelect?: (songId: string) => void;
}


const SongListClient = ({ initialSongs }: SongListClientProps) => {
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 検索フィルタリング
  const filteredSongs = useMemo(() => {
    if (!searchTerm.trim()) return initialSongs;
    
    const term = searchTerm.toLowerCase();
    return initialSongs.filter(song =>
      song.name?.toLowerCase().includes(term) ||
      song.kana?.toLowerCase().includes(term) ||
      song.album?.toLowerCase().includes(term)
    );
  }, [initialSongs, searchTerm]);

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

  return (
    <div className="h-full flex flex-col">
      {/* 検索フォーム */}
       {/* ✅ 改善6: 検索フォームのUIと機能向上 */}
      <div className="p-2 pb-4 border-b border-gray-200">
        <div className="relative">
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
              <span className="font-medium text-gray-800">{song.name}</span>
              <span className="text-sm text-gray-600">{song.album}</span>
              <span className="text-xs text-gray-500">{song.year}</span>
            </Link>
          </div>

        ))}
        
        {filteredSongs.length === 0 && (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">
              {searchTerm ? '検索結果が見つかりません' : '曲がありません'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongListClient;