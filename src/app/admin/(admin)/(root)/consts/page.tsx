import React from 'react'
import { getConsts } from './server-action'
import AdminConstantsPageInner from './client-view';

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const AdminConstantsPage = async () => {
  const news = await getConsts();
  return ( <AdminConstantsPageInner constants={JSON.parse(news)} />
  )
}

export default AdminConstantsPage