import { connectToDB } from "@/lib/db-connect";
import { Form } from "@/models/form-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const id = request.nextUrl.searchParams.get("id");
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
    }).select("distractionsList createdAt");

    console.log(forms);

    forms.forEach((form: { distractionsList: string }) => {
      form.distractionsList.split(",").forEach((distraction) => {
        console.log(distraction);
        console.log(distractions);
        distractions.push(distraction.trim().replaceAll(" ", ""));
      });
    });

    if (!forms.length) {
      return NextResponse.json(
        { message: "User not found", success: false },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { success: true, data: { distractions } },
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