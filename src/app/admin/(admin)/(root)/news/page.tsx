import React from 'react'
import { getNews } from './server-action'
import AdminNewsPageInner from './client-view';

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const AdminNewsPage = async () => {
  const news = await getNews({
    page: 1,
    limit: 10000000,
  });
  return ( <AdminNewsPageInner news={JSON.parse(news)} />
  )
}

export default AdminNewsPage