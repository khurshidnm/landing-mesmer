import Constants from "@/database/consts.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const constant = await Constants.findOne({});

    if (!constant) {
      const new_constant = await Constants.create({});
      return NextResponse.json({
        message: "constants created",
        errors: null,
        data: {
          constant: new_constant,
        },
      })
    }

    return NextResponse.json({
      message: "constants retrieved",
      errors: null,
      data: {
        constant,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();

    const {...updateData } = await req.json();
    const constant = await Constants.findOneAndUpdate({}, updateData, {
      new: true,
    });

    if (!constant) {
      return NextResponse.json({
        message: "Something went wrong",
        errors: null,
        data: null,
      })
    }

    return NextResponse.json({
      message: "Contact updated",
      errors: null,
      data: {
        constant,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
