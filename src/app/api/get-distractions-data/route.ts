import { connectToDB } from "@/lib/db-connect";
import { Form } from "@/models/form-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const id = request.nextUrl.searchParams.get("id");
    const version = request.nextUrl.searchParams.get("version");

    const distractionsArray: string[] = [];
    const distractions: string[] = [];

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
      version,
    }).select("distractionsList createdAt");

    forms.forEach((form: { distractionsList: string }) => {
      form.distractionsList.split(",").forEach((distraction) => {
        distractionsArray.push(distraction.trim().replaceAll(" ", ""));
      });
    });

    distractionsArray.forEach((distraction) => {
      if (distraction !== "") {
        distractions.push(distraction);
      }
    });

    if (!forms.length) {
      return NextResponse.json({
        message: "Forms not found",
        success: true,
        data: { distractions: [] },
      });
    }

    return NextResponse.json(
      { success: true, data: { distractions: distractions } },
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
