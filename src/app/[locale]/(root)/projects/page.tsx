import { getProjects } from "@/app/admin/(admin)/(root)/projects/server-action";
import ProjectsList from "./page-wiew";
import { redirect } from "next/navigation";

// Optional: Make page dynamic
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Define the type for search parameters
interface PageProps {
  searchParams?: {
    page?: string;
    limit?: string;
  };
}

const ProjectsPage = async ({ searchParams }: PageProps) => {
  // Get pagination params or fallback to defaults
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit, 10) : 10;

  // Redirect if invalid page number
  if (page < 1) {
    redirect("?page=1");
  }

  // Fetch project data
  const data = await getProjects(undefined, page, limit); // assuming slug = undefined
  const { projects, pagination } = JSON.parse(data);

  return (
    <div>
      <ProjectsList projects={projects} pagination={pagination} />
    </div>
  );
};

export default ProjectsPage;
