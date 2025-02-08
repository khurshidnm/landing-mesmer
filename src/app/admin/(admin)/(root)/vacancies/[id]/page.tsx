import { getVacancies } from "../server-action"
import VacanciesEditInnerPage from "./page-view";

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const VacancyEditPage = async (props: { params: Promise<{id: string}> }) => {
  const params = await props.params;
  // @next-codemod-ignore
  const vacancy = await getVacancies(params.id);
  return (
    <VacanciesEditInnerPage vacancy={JSON.parse(vacancy)}  />
  )
}

export default VacancyEditPage