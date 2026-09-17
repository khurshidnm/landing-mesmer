import { getProjects } from "@/app/admin/(admin)/(root)/projects/server-action";
import React from "react";
import ProjectPage from "./page-wiew";

import { parseServerActionJson } from "@/lib/parse-server-action-json";
import type { ProjectsItem } from "../page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const projects = await getProjects({
    page: 1,
    limit: 10,
    slug: params.slug,
  });

  const project = parseServerActionJson<ProjectsItem | null>(projects, null);

  return <ProjectPage project={project} />;
};

export default page;
