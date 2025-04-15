import { getProjects } from "@/app/admin/(admin)/(root)/projects/server-action";
import ProjectsList from "./page-view";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ProjectsPage = async ({ searchParams }: any) => {
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
