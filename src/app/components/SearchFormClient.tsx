"use client";

import React, { useState } from "react";

const SearchFormClient = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      console.log("検索キーワード:", searchTerm);
      
      // TODO: 実装パターン選択
      // パターン1: URLパラメータで検索ページに遷移
      // router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      
      // パターン2: 親コンポーネントに検索結果を通知
      // onSearch?.(searchTerm);
      
      // パターン3: 同一ページ内でフィルタリング（現在のパターン）
      // SongListClientと連携が必要
    }
  };

  return (
    <form className="p-2 mx-auto" onSubmit={handleSubmit}>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <input
          type="search"
          name="search_word"
          id="default-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-2 pl-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="曲を探す"
        />
        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-mono rounded-lg text-sm px-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          検索
        </button>
      </div>
    </form>
  );
};

export default SearchFormClient;
