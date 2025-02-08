import { getSertificates } from "../server-action"
import CertificatesEditPageInner from "./page-view";

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const CertificatesEditPage = async (props: { params: Promise<{id: string}> }) => {
  const params = await props.params;
  // @next-codemod-ignore
  const news = await getSertificates(params.id);
  return (
    <CertificatesEditPageInner certificate={JSON.parse(news)}  />
  )
}

export default CertificatesEditPage