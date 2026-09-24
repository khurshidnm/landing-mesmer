import mongoose from "mongoose";
import News from "@/database/news.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { parseDateTimeLocal } from "@/lib/datetime-local";

const getQuery = (id: string) =>
  mongoose.Types.ObjectId.isValid(id)
    ? { $or: [{ _id: id }, { slug: id }] }
    : { slug: id };

export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;
    const news = await News.findOne(getQuery(id));

    if (!news) {
      return NextResponse.json(
        { message: "News not found", errors: null, data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "News retrieved",
      errors: null,
      data: {
        news,
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
    const news = await News.findOneAndDelete(getQuery(id));
    revalidatePath("/admin/news");

    return NextResponse.json({
      message: "News deleted",
      errors: null,
      success: true,
      data: {
        news,
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
      createdAt,
    } = await req.json();

    const query = getQuery(id);
    const existNews = await News.findOne(query);
    const parsedCreatedAt = parseDateTimeLocal(createdAt);

    if (!existNews) {
      return NextResponse.json(
        {
          message: "News not found",
          errors: null,
          data: null,
          success: false,
        },
        { status: 404 }
      );
    }

    const news = await News.findOneAndUpdate(
      query,
      {
        uz: {
          title: title_uz || existNews.uz?.title,
          description: description_uz || existNews.uz?.description,
          content: content_uz || existNews.uz?.content,
        },
        en: {
          title: title_en || existNews.en?.title,
          description: description_en || existNews.en?.description,
          content: content_en || existNews.en?.content,
        },
        ru: {
          title: title_ru || existNews.ru?.title,
          description: description_ru || existNews.ru?.description,
          content: content_ru || existNews.ru?.content,
        },
        cover: cover || existNews.cover,
        slug: slug || existNews.slug,
        createdAt: parsedCreatedAt || existNews.createdAt,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
        timestamps: false,
        overwriteImmutable: true,
      }
    );

    revalidatePath("/admin/news");

    return NextResponse.json({
      message: "News updated successfully",
      errors: null,
      success: true,
      data: {
        news,
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
