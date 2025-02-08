import Certificates from "@/database/certificates.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: any) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const certificate = await Certificates.findById(id);
    return NextResponse.json({
      message: "Certificate",
      errors: null,
      data: {
        certificate,
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
    const certificate = await Certificates.findOneAndDelete({_id: id});
    revalidatePath("/admin/certificated")
    return NextResponse.json({
      message: "Certificate",
      errors: null,
      data: {
        certificate,
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
    const { ...body } = await req.json();
    const existCertificates = await Certificates.findOne({_id: id});

    if (!existCertificates) {
      return NextResponse.json({
        message: "Certificate not found",
        errors: null,
        data: null,
      });
    }
    const certificate = await Certificates.findOneAndUpdate({_id: id}, body, {new: true});
    revalidatePath("/admin/certificates")
    return NextResponse.json({
      message: "Certificates",
      errors: null,
      data: {
        certificate,
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
