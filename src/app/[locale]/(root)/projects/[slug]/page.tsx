import { getProjects } from "@/app/admin/(admin)/(root)/projects/server-action";
import React from "react";
import ProjectPage from "./page-wiew";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const page = async (props: { params: Promise<{slug: string}> }) => {
  const params = await props.params;
  // @next-codemod-ignore
  const projects = await getProjects(params.slug);

  return <ProjectPage project={JSON.parse(projects)} />;
};

export default page;
