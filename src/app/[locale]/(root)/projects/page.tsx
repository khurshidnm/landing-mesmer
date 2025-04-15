import { getProjects } from "@/app/admin/(admin)/(root)/projects/server-action";
import ProjectsList from "./page-wiew";
import { redirect } from "next/navigation";

// Rename the interface to avoid conflict
interface PaginationPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
  };
}

const ProjectsPage = async ({ searchParams }: PaginationPageProps) => {
  // Get pagination parameters from URL or use defaults
  const page = searchParams?.page ? Number.parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? Number.parseInt(searchParams.limit) : 10;

  // Validate page number
  if (page < 1) {
    redirect("?page=1");
  }

  // Fetch projects with pagination
  const data = await getProjects(undefined, page, limit); // slug = undefined
  const { projects, pagination } = JSON.parse(data);

  return (
    <div>
      <ProjectsList projects={projects} pagination={pagination} />
    </div>
  );
};

export default ProjectsPage;
