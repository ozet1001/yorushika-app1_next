import React, { Suspense } from 'react'
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import Main from '@/app/components/Main/Main';
import { getSongs } from '@/lib/songs';
import Loading from '@/app/(main)/loading';


// ✅ ISR設定をページレベルで行う
export const revalidate = 3600; // 1時間ごとに再生成


const MainLayout = async ({
  // children,
}: Readonly<{ 
  children: React.ReactNode;
}>) => {

  // ✅ レイアウトレベルで楽曲データを一度だけ取得
  const allSongs = await getSongs();
  
  console.log(`🎵 [MainLayout] ${allSongs.length}件の楽曲データを取得`);

  console.log('🎵 [MainLayout] レイアウトコンポーネントがレンダリングされました');
  return (
    <>
        <Header />

        <div className="grid w-[97%] mx-auto grid-cols-1 gap-4 sm:grid-cols-5">
          <div className="h-full col-span-1 mt-5 mb-5 grid-item">
            <Sidebar songsData={allSongs} />
          </div>

        {/* メインコンテンツエリア */}
        <div className="col-span-1 p-2 mt-5 mb-5 bg-gray-100 rounded-md sm:col-span-4 grid-item">     
          <main className='pl-5 flex-1 h-full sm:h-screen sm:overflow-y-auto'>
            {/* ✅ childrenの代わりにMainコンポーネントを表示 */}
            <Suspense fallback={<Loading />}>
              <Main songsData={allSongs} />            
            </Suspense>
            {/* {children}  */}
           
          </main>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default MainLayout