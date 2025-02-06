import Projects from "@/database/projects.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
          success: true,
          status: 401,
        },
        { status: 401 }
      );
    }

    const {
      title_uz,
      title_oz,
      title_ru,
      description_uz,
      description_oz,
      description_ru,
      status_uz,
      status_oz,
      status_ru,
      volume_of_tasks_uz,
      volume_of_tasks_oz,
      volume_of_tasks_ru,
      customer_uz,
      customer_oz,
      customer_ru,
      implementation_period_uz,
      implementation_period_oz,
      implementation_period_ru,
      cover,
      slug,
      gallery,
    } = await req.json();

    const collection = await Projects.create({
      uz: {
        title: title_uz,
        description: description_uz,
        status: status_uz,
        volume_of_tasks: volume_of_tasks_uz,
        customer: customer_uz,
        implementation_period: implementation_period_uz,
      },
      oz: {
        title: title_oz,
        description: description_oz,
        status: status_oz,
        volume_of_tasks: volume_of_tasks_oz,
        customer: customer_oz,
        implementation_period: implementation_period_oz,
      },
      ru: {
        title: title_ru,
        description: description_ru,
        status: status_ru,
        volume_of_tasks: volume_of_tasks_ru,
        customer: customer_ru,
        implementation_period: implementation_period_ru,
      },
      slug,
      cover,
      gallery,
    });

    return NextResponse.json({
      message: "Hello world",
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
