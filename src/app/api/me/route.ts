import { connectToDB } from "@/lib/db-connect";
import { User } from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const kindeId = request.nextUrl.searchParams.get("id");

    const user = await User.findOne({ kindeId });

    if (!user) {
      return NextResponse.json(
        { message: "User not saved yet", success: false },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      { success: true, user },
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
