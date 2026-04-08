import { getSertificates } from "../server-action"
import CertificatesEditPageInner from "./page-view";
import { parseServerActionJson } from "@/lib/parse-server-action-json";
import type { Certificate } from "@/types/certificates";

export const dynamic = "force-dynamic"; // Sahifani har doim dynamic qilish
export const revalidate = 0; // Sahifani har doim yangilash

const CertificatesEditPage = async (props: { params: Promise<{id: string}> }) => {
  const params = await props.params;
  // @next-codemod-ignore
  const news = await getSertificates(params.id);
  const certificate = parseServerActionJson<Certificate | null>(news, null);

  return (
    <CertificatesEditPageInner certificate={certificate}  />
  )
}

export default CertificatesEditPage
