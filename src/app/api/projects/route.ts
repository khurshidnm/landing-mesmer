import Projects from "@/database/projects.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { cityFields, sanitizeProjectStructured } from "@/lib/project-fields";

export async function GET() {
  try {
    await connectToDatabase();

    const projects = await Projects.find({});

    return NextResponse.json({
      message: "Projects",
      errors: null,
      data: {
        projects,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server Error: ", error },
      {
        status: 500,
      }
    );
  }
}
export async function POST(req: Request) {
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
          status: 401,
        },
        { status: 401 }
      );
    }

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
    const structured = sanitizeProjectStructured(body);
    const city = cityFields(body);

    const collection = await Projects.create({
      uz: {
        title: title_uz,
        main_title: main_title_uz,
        description: description_uz,
        status: status_uz,
        volume_of_tasks: volume_of_tasks_uz,
        customer: customer_uz,
        implementation_period: implementation_period_uz,
        meta_title: meta_title_uz || "",
        meta_description: meta_description_uz || "",
        city: city.uz,
      },
      en: {
        title: title_en,
        main_title: main_title_en,
        description: description_en,
        status: status_en,
        volume_of_tasks: volume_of_tasks_en,
        customer: customer_en,
        implementation_period: implementation_period_en,
        meta_title: meta_title_en || "",
        meta_description: meta_description_en || "",
        city: city.en,
      },
      ru: {
        title: title_ru,
        main_title: main_title_ru,
        description: description_ru,
        status: status_ru,
        volume_of_tasks: volume_of_tasks_ru,
        customer: customer_ru,
        implementation_period: implementation_period_ru,
        meta_title: meta_title_ru || "",
        meta_description: meta_description_ru || "",
        city: city.ru,
      },
      slug,
      cover,
      gallery,
      project_type: project_type || "",
      ...structured,
    });

    return NextResponse.json({
      message: "Project created successfully",
      errors: null,
      success: true,
      data: {
        collection,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server Error: ", error, success: false },
      {
        status: 500,
      }
    );
  }
}
