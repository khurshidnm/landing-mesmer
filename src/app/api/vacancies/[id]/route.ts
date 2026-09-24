import mongoose from "mongoose";
import Vacancies from "@/database/vacancies.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { VACANCY_CATEGORIES } from "@/lib/cms/definitions";

const getQuery = (id: string) =>
  mongoose.Types.ObjectId.isValid(id)
    ? { $or: [{ _id: id }, { slug: id }] }
    : { slug: id };

export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;
    const vacancy = await Vacancies.findOne(getQuery(id));

    if (!vacancy) {
      return NextResponse.json(
        { message: "Vacancy not found", errors: null, data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Vacancy retrieved",
      errors: null,
      data: {
        vacancy,
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
    const vacancy = await Vacancies.findOneAndDelete(getQuery(id));

    revalidatePath("/admin/vacancies");
    return NextResponse.json({
      message: "Vacancy deleted",
      errors: null,
      success: true,
      data: {
        vacancy,
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
    if ("category" in body) {
      body.category = VACANCY_CATEGORIES.some((c) => c.value === body.category) ? body.category : "";
    }
    const query = getQuery(id);
    const existing = await Vacancies.findOne(query);

    if (!existing) {
      return NextResponse.json(
        {
          message: "Vacancy not found",
          errors: null,
          data: null,
          success: false,
        },
        { status: 404 }
      );
    }

    const vacancy = await Vacancies.findOneAndUpdate(query, body, { new: true });
    revalidatePath("/admin/vacancies");

    return NextResponse.json({
      message: "Vacancy updated",
      errors: null,
      success: true,
      data: {
        vacancy,
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
