import React from 'react'
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
        <Header />
        <div className='flex h-screen'>
            <main className='pl-5 h-screen flex-1 overflow-auto bg-red-300'>{children}</main>
        </div>
        <Footer />
    </>
   )
}

export default MainLayout