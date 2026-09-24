import Certificates from "@/database/certificates.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;
    const certificate = await Certificates.findById(id);

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found", errors: null, data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Certificate retrieved",
      errors: null,
      data: {
        certificate,
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
    const certificate = await Certificates.findOneAndDelete({ _id: id });
    revalidatePath("/admin/certificates");

    return NextResponse.json({
      message: "Certificate deleted",
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
    const existCertificate = await Certificates.findOne({ _id: id });

    if (!existCertificate) {
      return NextResponse.json(
        {
          message: "Certificate not found",
          errors: null,
          data: null,
          success: false,
        },
        { status: 404 }
      );
    }

    const certificate = await Certificates.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }
    );
    revalidatePath("/admin/certificates");

    return NextResponse.json({
      message: "Certificate updated",
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
      { status: 500 }
    );
  }
}
