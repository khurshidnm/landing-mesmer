import News from "./page-view";
import { getNews } from "@/app/admin/(admin)/(root)/news/server-action";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ✅ Correct props type
interface PageProps {
  searchParams?: {
    page?: string;
    limit?: string;
  };
}

const NewsPage = async ({ searchParams }: PageProps) => {
  // Get pagination parameters from URL or use defaults
  const page = searchParams?.page ? Number.parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? Number.parseInt(searchParams.limit) : 10;

  // Validate page number
  if (page < 1) {
    redirect("?page=1");
  }

  try {
    // Fetch news with pagination
    const data = await getNews(undefined, page, limit);
    const parsedData = JSON.parse(data);

    console.log("Server parsed data:", parsedData);

    // Check structure
    if (parsedData.news && parsedData.pagination) {
      return <News news={parsedData.news} pagination={parsedData.pagination} />;
    } else {
      // Legacy fallback
      return (
        <News
          news={parsedData}
          pagination={{
            totalPages: 1,
            currentPage: 1,
            totalItems: parsedData.length || 0,
            limit,
          }}
        />
      );
    }
  } catch (error) {
    console.error("Error parsing news data:", error);

    return (
      <News
        news={[]}
        pagination={{ totalPages: 1, currentPage: 1, totalItems: 0, limit }}
      />
    );
  }
};

export default NewsPage;
