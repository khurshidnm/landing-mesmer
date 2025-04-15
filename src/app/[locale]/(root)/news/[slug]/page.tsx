import React from "react";
import NewsPage from "./page-wiew";
import { getNews } from "@/app/admin/(admin)/(root)/news/server-action";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  // @next-codemod-ignore
  const news = await getNews({
    page: 1,
    limit: 10,
    slug: params.slug,
  });

  return <NewsPage news={JSON.parse(news)} />;
};

export default page;
