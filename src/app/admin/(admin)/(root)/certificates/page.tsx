import React from 'react'
import { getSertificates } from './server-action'
import AdmincertificatesPageInner from './client-view';

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const AdminCertificatesPage = async () => {
  const news = await getSertificates();
  return ( <AdmincertificatesPageInner certificates={JSON.parse(news)} />
  )
}

export default AdminCertificatesPage