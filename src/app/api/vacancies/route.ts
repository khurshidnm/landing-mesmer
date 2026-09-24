import Vacancies from "@/database/vacancies.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { VACANCY_CATEGORIES } from "@/lib/cms/definitions";

export async function GET() {
  try {
    await connectToDatabase();

    const vacancies = await Vacancies.find({});

    return NextResponse.json({
      message: "Vacancies",
      errors: null,
      data: {
        vacancies,
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

    const { ...body } = await req.json();
    body.category = VACANCY_CATEGORIES.some((c) => c.value === body.category) ? body.category : "";

    const vacancy = await Vacancies.create(body);

    revalidatePath("/admin/vacancies")

    return NextResponse.json({
      message: "Vacancy created",
      errors: null,
      success: true,
      data: {
        vacancy,
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
