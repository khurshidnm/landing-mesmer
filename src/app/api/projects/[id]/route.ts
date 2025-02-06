import Projects from "@/database/projects.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: any) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const project = await Projects.findById(id);
    return NextResponse.json({
      message: "Collection",
      errors: null,
      data: {
        project,
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

export async function DELETE(_: Request, { params }: any) {
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
    const { id } = await params;
    const project = await Projects.findByIdAndDelete(id);
    return NextResponse.json({
      message: "Project",
      errors: null,
      data: {
        project,
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

export async function PUT(req: Request, { params }: any) {
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

    const { id } = await params;
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
    const existNews = await Projects.findOne({_id: id});

    if (!existNews) {
      return NextResponse.json({
        message: "News not found",
        errors: null,
        data: null,
      });
    }
    

    const projects = await Projects.findOneAndUpdate({
      _id: id},{
      uz: {
        title: title_uz || existNews.uz.title,
        description: description_uz || existNews.uz.description,
        status: status_uz || existNews.uz.status,
        volume_of_tasks: volume_of_tasks_uz || existNews.uz.volume_of_tasks,
        customer: customer_uz || existNews.uz.customer,
        implementation_period: implementation_period_uz || existNews.uz.implementation_period,
      },
      oz: {
        title: title_oz || existNews.oz.title,
        description: description_oz || existNews.oz.description,
        status: status_oz || existNews.oz.status,
        volume_of_tasks: volume_of_tasks_oz || existNews.oz.volume_of_tasks,
        customer: customer_oz || existNews.oz.customer,
        implementation_period: implementation_period_oz || existNews.oz.implementation_period,
      },
      ru: {
        title: title_ru || existNews.ru.title,
        description: description_ru || existNews.ru.description,
        status: status_ru || existNews.ru.status,
        volume_of_tasks: volume_of_tasks_ru || existNews.ru.volume_of_tasks,
        customer: customer_ru || existNews.ru.customer,
        implementation_period: implementation_period_ru || existNews.ru.implementation_period,
      },
      slug: slug || existNews.slug,
      cover: cover || existNews.cover,
      gallery: gallery || existNews.gallery,
    },{new:true});
    return NextResponse.json({
      message: "Products",
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
