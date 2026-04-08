import React from 'react'
import HomePageInner from './client-view';
import { getSertificates } from '../../admin/(admin)/(root)/certificates/server-action';
import { parseServerActionJson } from '@/lib/parse-server-action-json';
import type { Certificate } from '@/types/certificates';

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const AdminCertificatesPage = async () => {
  const news = await getSertificates();
  const certificates = parseServerActionJson<Certificate[]>(news, []);

  return ( <HomePageInner certificates={certificates} />
  )
}

export default AdminCertificatesPage
