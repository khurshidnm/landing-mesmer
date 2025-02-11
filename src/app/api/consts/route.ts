import { Contact } from "@/database/consts.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const contacts = await Contact.find({});

    return NextResponse.json({
      message: "Contacts retrieved",
      errors: null,
      data: {
        contacts,
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

    const { id, ...updateData } = await req.json();
    const updatedContact = await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedContact) {
      return NextResponse.json(
        { message: "Contact not found", errors: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Contact updated",
      errors: null,
      data: {
        updatedContact,
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
