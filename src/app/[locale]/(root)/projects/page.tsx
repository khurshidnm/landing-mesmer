import { getProjects } from "@/app/admin/(admin)/(root)/projects/server-action";
import React from "react";
import ProjectsList from "./page-wiew";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const ProjectsPage = async () => {
  const projects = await getProjects();

  return (
    <div>
      <ProjectsList projects={JSON.parse(projects)} />
    </div>
  );
};

export default ProjectsPage;
