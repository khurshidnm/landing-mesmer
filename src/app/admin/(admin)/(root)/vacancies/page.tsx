import React from 'react'
import { getVacancies } from './server-action'
import AdminVacanciesPageInner from './client-view';

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const AdminVacanciesPage = async () => {
  const vacancies = await getVacancies();
  console.log(vacancies)
  return ( <AdminVacanciesPageInner vacancies={JSON.parse(vacancies)} />
  )
}

export default AdminVacanciesPage