import News from "@/database/news.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: any) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const news = await News.findById(id);
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
    const news = await News.findOneAndDelete({slug: id});
    revalidatePath("/admin/news")
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
    console.log(id)
    const {
      title_uz,
      title_en,
      title_ru,
      description_uz,
      description_en,
      description_ru,
      content_uz,
      content_en,
      content_ru,
      cover,
      slug,
    } = await req.json();
    const existNews = await News.findOne({slug: id});

    if (!existNews) {
      return NextResponse.json({
        message: "News not found",
        errors: null,
        data: null,
      });
    }
    const news = await News.findOneAndUpdate({slug: id}, {
      uz: {
        title: title_uz || existNews.uz.title,
        description: description_uz || existNews.uz.description,
        content: content_uz || existNews.uz.content,
      },
      en: {
        title: title_en || existNews.en.title,
        description: description_en || existNews.en.description,
        content: content_en || existNews.en.content,
      },
      ru: {
        title: title_ru || existNews.ru.title,
        description: description_ru || existNews.ru.description,
        content: content_ru || existNews.ru.content,
      },
      cover: cover || existNews.cover,
      slug: slug || existNews.slug,
    }, {new: true});
    revalidatePath("/admin/news")
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
