import Vacancies from "@/database/vacancies.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: any) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const news = await Vacancies.findById(id);
    return NextResponse.json({
      message: "Collection",
      errors: null,
      data: {
        news,
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
    const vacancy = await Vacancies.findOneAndDelete({ _id: id });
    return NextResponse.json({
      message: "Vacancy deleted",
      errors: null,
      data: {
        vacancy,
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
    console.log(id);
    const { ...body } = await req.json();
    const existNews = await Vacancies.findOne({ _id: id });

    if (!existNews) {
      return NextResponse.json({
        message: "Vacancy not found",
        errors: null,
        data: null,
      });
    }
    const news = await Vacancies.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }
    );
    revalidatePath("/admin/vacancies");
    return NextResponse.json({
      message: "News",
      errors: null,
      data: {
        news,
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
