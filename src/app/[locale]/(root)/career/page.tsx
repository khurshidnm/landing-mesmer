import React from "react";
import Career from "./page-view";
import { getVacancies } from "@/app/admin/(admin)/(root)/vacancies/server-action";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NewsPage = async () => {
  const vacancies = await getVacancies();
  return <Career vacancies={JSON.parse(vacancies)} />;
};

export default NewsPage;
