import News from "@/database/news.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
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

    const { title, cover, slug, description } = await req.json();

    const collection = await News.create({
      title,
      cover,
      slug,
      description,
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
