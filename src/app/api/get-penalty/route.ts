import { connectToDB } from "@/lib/db-connect";
import { Form } from "@/models/form-model";
import { User } from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const id = request.nextUrl.searchParams.get("id");
    let penalty = 0;

    const desiredSleepHours = await User.findById(id).select(
      "desiredSleepHours"
    );

    const forms = await Form.find({
      createdBy: id,
    }).select("hoursSlept");

    forms.forEach((form) => {
      if (form.hoursSlept > desiredSleepHours.desiredSleepHours) {
        const penaltyHrs =
          form.hoursSlept - desiredSleepHours.desiredSleepHours;
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
