import React from 'react'
import { getNews } from './server-action'
import AdminNewsPageInner from './client-view';

const AdminNewsPage = async () => {
  const news = await getNews();
  return ( <AdminNewsPageInner news={JSON.parse(news)} />
  )
}

export default AdminNewsPage