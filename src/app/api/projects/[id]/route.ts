import mongoose from "mongoose";
import Projects from "@/database/projects.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { cityFields, sanitizeProjectStructured } from "@/lib/project-fields";

const getQuery = (id: string) =>
  mongoose.Types.ObjectId.isValid(id)
    ? { $or: [{ _id: id }, { slug: id }] }
    : { slug: id };

export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;
    const project = await Projects.findOne(getQuery(id));

    if (!project) {
      return NextResponse.json(
        { message: "Project not found", errors: null, data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Project retrieved",
      errors: null,
      data: {
        project,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          errors: [
            {
              code: "unauthenticated",
              message: "You are not authenticated",
            },
          ],
          data: null,
          success: false,
        },
        { status: 401 }
      );
    }

    const { id } = await props.params;
    const project = await Projects.findOneAndDelete(getQuery(id));
    revalidatePath("/admin/projects");

    return NextResponse.json({
      message: "Project deleted",
      errors: null,
      success: true,
      data: {
        project,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server Error", error: (error as Error).message, success: false },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          errors: [
            {
              code: "unauthenticated",
              message: "You are not authenticated",
            },
          ],
          data: null,
          success: false,
        },
        { status: 401 }
      );
    }

    const { id } = await props.params;
    const body = await req.json();
    const {
      title_uz,
      title_en,
      title_ru,
      main_title_uz,
      main_title_en,
      main_title_ru,
      description_uz,
      description_en,
      description_ru,
      status_uz,
      status_en,
      status_ru,
      volume_of_tasks_uz,
      volume_of_tasks_en,
      volume_of_tasks_ru,
      customer_uz,
      customer_en,
      customer_ru,
      implementation_period_uz,
      implementation_period_en,
      implementation_period_ru,
      meta_title_uz,
      meta_title_en,
      meta_title_ru,
      meta_description_uz,
      meta_description_en,
      meta_description_ru,
      cover,
      slug,
      gallery,
      project_type,
    } = body;
    // Structured fields are only updated when the form sends them
    const hasStructured = "category" in body || "financier" in body || "stage" in body;
    const structured = sanitizeProjectStructured({ ...body, status_en: status_en || undefined });
    const city = cityFields(body);

    const query = getQuery(id);
    const existProject = await Projects.findOne(query);

    if (!existProject) {
      return NextResponse.json(
        {
          message: "Project not found",
          errors: null,
          data: null,
          success: false,
        },
        { status: 404 }
      );
    }

    const project = await Projects.findOneAndUpdate(
      query,
      {
        uz: {
          title: title_uz || existProject.uz?.title,
          main_title: main_title_uz ?? existProject.uz?.main_title,
          description: description_uz || existProject.uz?.description,
          status: status_uz || existProject.uz?.status,
          volume_of_tasks: volume_of_tasks_uz || existProject.uz?.volume_of_tasks,
          customer: customer_uz || existProject.uz?.customer,
          implementation_period: implementation_period_uz || existProject.uz?.implementation_period,
          meta_title: meta_title_uz !== undefined ? meta_title_uz : existProject.uz?.meta_title || "",
          meta_description: meta_description_uz !== undefined ? meta_description_uz : existProject.uz?.meta_description || "",
          city: `city_uz` in body ? city.uz : existProject.uz?.city || "",
        },
        en: {
          title: title_en || existProject.en?.title,
          main_title: main_title_en ?? existProject.en?.main_title,
          description: description_en || existProject.en?.description,
          status: status_en || existProject.en?.status,
          volume_of_tasks: volume_of_tasks_en || existProject.en?.volume_of_tasks,
          customer: customer_en || existProject.en?.customer,
          implementation_period: implementation_period_en || existProject.en?.implementation_period,
          meta_title: meta_title_en !== undefined ? meta_title_en : existProject.en?.meta_title || "",
          meta_description: meta_description_en !== undefined ? meta_description_en : existProject.en?.meta_description || "",
          city: `city_en` in body ? city.en : existProject.en?.city || "",
        },
        ru: {
          title: title_ru || existProject.ru?.title,
          main_title: main_title_ru ?? existProject.ru?.main_title,
          description: description_ru || existProject.ru?.description,
          status: status_ru || existProject.ru?.status,
          volume_of_tasks: volume_of_tasks_ru || existProject.ru?.volume_of_tasks,
          customer: customer_ru || existProject.ru?.customer,
          implementation_period: implementation_period_ru || existProject.ru?.implementation_period,
          meta_title: meta_title_ru !== undefined ? meta_title_ru : existProject.ru?.meta_title || "",
          meta_description: meta_description_ru !== undefined ? meta_description_ru : existProject.ru?.meta_description || "",
          city: `city_ru` in body ? city.ru : existProject.ru?.city || "",
        },
        slug: slug || existProject.slug,
        cover: cover || existProject.cover,
        gallery: gallery || existProject.gallery,
        project_type: project_type !== undefined ? project_type : existProject.project_type || "",
        ...(hasStructured ? structured : {}),
      },
      { new: true }
    );

    revalidatePath("/admin/projects");

    return NextResponse.json({
      message: "Project updated successfully",
      errors: null,
      success: true,
      data: {
        project,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server Error", error: (error as Error).message, success: false },
      { status: 500 }
    );
  }
}
