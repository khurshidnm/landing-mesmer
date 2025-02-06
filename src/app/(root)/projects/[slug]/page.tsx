import { getProjects } from "@/app/admin/(root)/projects/server-action";
import React from "react";
import ProjectPage from "./page-wiew";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const projects = await getProjects(slug);

  return <ProjectPage project={JSON.parse(projects)} />;
};

export default page;
