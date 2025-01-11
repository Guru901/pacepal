import { connectToDB } from "@/lib/db-connect";
import { User } from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const req = await request.json();

    const { id, slots, version } = req;
    if (!id || !slots) {
      return NextResponse.json(
        { message: "Missing required parameters", success: false },
        {
          status: 400,
        }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          "versions.$[elem].data.slots": slots,
        },
      },
      {
        arrayFilters: [{ "elem.versionName": version }],
        new: true,
      }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not saved yet", success: false },
        {
          status: 200,
        }
      );
    }

    const versions = user.versions;

    return NextResponse.json(
      { success: true, user, data: { versions } },
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
