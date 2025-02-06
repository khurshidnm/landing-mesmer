import React from "react";
import News from "./page-view";
import { getNews } from "@/app/admin/(root)/news/server-action";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NewsPage = async () => {
  const news = await getNews();
  return <News news={JSON.parse(news)} />;
};

export default NewsPage;
