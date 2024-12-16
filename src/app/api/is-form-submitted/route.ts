import { connectToDB } from "@/lib/db-connect";
import { Form } from "@/models/form-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User not found", success: false },
        {
          status: 404,
        }
      );
    }

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);

    const form = await Form.find({
      createdBy: id,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    await Form.find({
      kindeId: id,
    });

    if (!form.length) {
      return NextResponse.json(
        { success: true, isFormSubmitted: false },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      { success: true, isFormSubmitted: true },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error", success: false },
      {
        status: 500,
      }
    );
  }
}
