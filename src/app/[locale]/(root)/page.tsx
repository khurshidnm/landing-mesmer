import React from 'react'
import HomePageInner from './client-view';
import { getSertificates } from '../../admin/(admin)/(root)/certificates/server-action';

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const AdminCertificatesPage = async () => {
  const news = await getSertificates();
  return ( <HomePageInner certificates={JSON.parse(news)} />
  )
}

export default AdminCertificatesPage