import { getProjects } from "../server-action"
import ProjectEditPageInner from "./page-view";

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const NewsEditPage = async (props: { params: Promise<{slug: string}> }) => {
  const params = await props.params;
  // @next-codemod-ignore
  const news = await getProjects(params.slug);
  return (
    <ProjectEditPageInner project={JSON.parse(news)}  />
  )
}

export default NewsEditPage