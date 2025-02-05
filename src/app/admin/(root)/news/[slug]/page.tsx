import { NewsItem } from "@/types/news";
import { getNews } from "../server-action"
import NewEditPageInner from "./page-view";

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

export async function generateStaticParams() {
    const newsList = await getNews(); // Barcha yangiliklarni olish
    return JSON.parse(newsList).map((news: NewsItem) => ({ slug: news.slug }));
}

const NewsEditPage = async ({ params }: { params: { slug: string } }) => {
    const news = await getNews(params.slug); // Xatolik yo'q

    return <NewEditPageInner news={JSON.parse(news)} />;
};

export default NewsEditPage;