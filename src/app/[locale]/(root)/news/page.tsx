import News from "./page-view";
import { getNews } from "@/app/admin/(admin)/(root)/news/server-action";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NewsPage = async ({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) => {
  // Get pagination parameters from URL or use defaults
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? Number.parseInt(searchParams.limit) : 10;

  // Validate page number
  if (page < 1) {
    redirect("?page=1");
  }

  try {
    // Fetch news with pagination
    const data = await getNews(undefined, page, limit);
    const parsedData = JSON.parse(data);

    // For debugging
    console.log("Server parsed data:", parsedData);

    // Check if the response has the expected structure
    if (parsedData.news && parsedData.pagination) {
      return <News news={parsedData.news} pagination={parsedData.pagination} />;
    } else {
      // Handle legacy format (array of news without pagination)
      return (
        <News
          news={parsedData}
          pagination={{
            totalPages: 1,
            currentPage: 1,
            totalItems: parsedData.length,
            limit,
          }}
        />
      );
    }
  } catch (error) {
    console.error("Error parsing news data:", error);
    // Fallback to empty data with single page
    return (
      <News
        news={[]}
        pagination={{ totalPages: 1, currentPage: 1, totalItems: 0, limit }}
      />
    );
  }
};

export default NewsPage;
