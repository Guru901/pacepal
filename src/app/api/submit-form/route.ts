import { connectToDB } from "@/lib/db-connect";
import { Form } from "@/models/form-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const req = await request.json();

    const {
      createdBy,
      productivity,
      hoursWorked,
      hoursPlanned,
      tasksCompleted,
      tasksPlanned,
      sleptWell,
      distractions,
      distractionsList,
      followedSchedule,
      hoursSlept,
      mood,
      version,
      overWork,
    } = req;

    const form = await Form.create({
      createdBy,
      productivity,
      hoursWorked,
      hoursPlanned,
      tasksCompleted,
      tasksPlanned,
      sleptWell,
      distractions,
      distractionsList,
      mood,
      followedSchedule,
      hoursSlept,
      version,
      overWork,
    });

    return NextResponse.json(
      { message: "Form submitted", success: true, data: form },
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
