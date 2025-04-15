import React from 'react'
import { getProjects } from './server-action'
import AdminProjectsPageInner from './client-view';

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const AdminProjectsPage = async () => {
  const projects = await getProjects({
    page: 1,
    limit: 10000000
  });
  return ( <AdminProjectsPageInner projects={JSON.parse(projects).projects} />
  )
}

export default AdminProjectsPage