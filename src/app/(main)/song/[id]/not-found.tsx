export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🎵</div>
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">楽曲が見つかりません</h2>
        <p className="text-gray-600 mb-6">
          指定された楽曲は存在しないか、削除されている可能性があります。
        </p>
        <div className="space-y-4">
          <a
            href="/"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            ホームに戻る
          </a>
          <p className="text-sm text-gray-500">
            左側のサイドバーから他の楽曲を選択してください
          </p>
        </div>
      </div>
    </div>
  );
}