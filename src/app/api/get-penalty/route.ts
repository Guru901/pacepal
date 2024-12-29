import { connectToDB } from "@/lib/db-connect";
import { Form } from "@/models/form-model";
import { User } from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const id = request.nextUrl.searchParams.get("id");
    const versionFromClient = request.nextUrl.searchParams.get("version");
    let penalty = 0;

    const user = await User.findById(id);

    const desiredSleepHours = user?.versions?.map(
      (version: {
        versionName: string | null;
        data: { desiredSleepHours: number };
      }) => {
        if (version.versionName === versionFromClient) {
          return version.data.desiredSleepHours;
        }
      }
    );

    const forms = await Form.find({
      createdBy: id,
      version: versionFromClient,
    }).select("hoursSlept");

    forms.forEach((form) => {
      if (form.hoursSlept > desiredSleepHours[0]) {
        const penaltyHrs = form.hoursSlept - desiredSleepHours[0];
        penalty += penaltyHrs * 100;
      }
    });

    return NextResponse.json(
      { success: true, data: { penalty } },
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
