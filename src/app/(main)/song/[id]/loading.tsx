export default function Loading() {
     console.log('🔄 [Loading] ローディングコンポーネントが表示されました');
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
        <h2 className="text-xl font-semibold">楽曲詳細を読み込み中...</h2>
        <p className="text-gray-500">少々お待ちください</p>
      </div>
    </div>
  );
}