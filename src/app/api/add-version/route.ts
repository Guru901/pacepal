import { connectToDB } from "@/lib/db-connect";
import { User } from "@/models/user-model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDB();

    const req = await request.json();

    const { userId, versionName, desiredSleepHours, studySlots } = req;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    await user.versions.push({
      versionName,
      data: {
        slots: studySlots,
        desiredSleepHours,
      },
    });

    await user.save();

    const versions = user.versions;

    return NextResponse.json(
      {
        success: true,
        message: "Version added successfully",
        data: { versions },
      },
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
