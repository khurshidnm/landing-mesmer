import { getNews } from "../../admin/(admin)/(root)/news/server-action"
import PageInner from "./pageInner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Page = async () => {
    const data = await getNews();
  return (
    <PageInner data={JSON.parse(data)} />
  )
}

export default Page