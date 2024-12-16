import { connectToDB } from "@/lib/db-connect";
import { User } from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const req = await request.json();

    const {
      email,
      id,
      picture,
      given_name,
      isOnBoarded,
      slots,
      desiredSleepHours,
    } = req;

    const user = await User.findOne({ kindeId: id });

    if (user) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        {
          status: 400,
        }
      );
    }

    const newUser = await User.create({
      email,
      kindeId: id,
      picture,
      given_name,
      isOnBoarded,
      slots,
      desiredSleepHours,
    });

    return NextResponse.json(
      { message: "User created", success: true, data: newUser },
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
