import News from "@/database/news.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const collections = await News.find({});

    return NextResponse.json({
      message: "Collections",
      errors: null,
      data: {
        collections,
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

    const { title_uz, title_en, title_ru, description_uz, description_en, description_ru, content_uz, content_en, content_ru, cover, slug } = await req.json();

    const collection = await News.create({
      uz: {
        title: title_uz,
        description: description_uz,
        content: content_uz,
      },
      en: {
        title: title_en,
        description: description_en,
        content: content_en,
      },
      ru: {
        title: title_ru,
        description: description_ru,
        content: content_ru,
      },
      cover,
      slug,
    });

    revalidatePath("/admin/news")

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
