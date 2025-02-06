import { getNews } from "../server-action"
import NewEditPageInner from "./page-view";

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const NewsEditPage = async (props: { params: Promise<{slug: string}> }) => {
  const params = await props.params;
  // @next-codemod-ignore
  const news = await getNews(params.slug);
  return (
    <NewEditPageInner news={JSON.parse(news)}  />
  )
}

export default NewsEditPage