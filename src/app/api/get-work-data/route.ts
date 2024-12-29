import { connectToDB } from "@/lib/db-connect";
import { Form } from "@/models/form-model";
import { User } from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const id = request.nextUrl.searchParams.get("id");
    const versionFromClient = request.nextUrl.searchParams.get("version");

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
      version: versionFromClient,
    }).select("hoursPlanned hoursWorked createdAt");

    const user = await User.findById(id);

    const desiredWorkingHours = user?.versions?.map(
      (version: {
        versionName: string | null;
        data: { slots: { name: string; hours: number }[] };
      }) => {
        if (version.versionName === versionFromClient) {
          return version.data?.slots;
        }
      }
    );

    if (!forms.length) {
      return NextResponse.json(
        { message: "User not found", success: false },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { success: true, data: { forms, desiredWorkingHours } },
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
