import { connectToDB } from "@/lib/db-connect";
import { Form } from "@/models/form-model";
import { User } from "@/models/user-model";
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

    const forms = await Form.find({
      createdBy: id,
    }).select("hoursSlept createdAt");

    const desiredSleepHours = (
      await User.findById(id).select("desiredSleepHours")
    ).desiredSleepHours;

    if (!forms.length) {
      return NextResponse.json(
        { message: "User not found", success: false },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { success: true, data: { forms, desiredSleepHours } },
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
