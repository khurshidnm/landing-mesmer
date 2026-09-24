import Certificates from "@/database/certificates.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const certificates = await Certificates.find({});

    return NextResponse.json({
      message: "Certificates retrieved",
      errors: null,
      data: {
        certificates,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server Error", error: (error as Error).message },
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

    const { ...body } = await req.json();

    const certificate = await Certificates.create(body);

    revalidatePath("/admin/certificates");

    return NextResponse.json({
      message: "Certificate created successfully",
      errors: null,
      success: true,
      data: {
        certificate,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server Error", error: (error as Error).message, success: false },
      {
        status: 500,
      }
    );
  }
}
