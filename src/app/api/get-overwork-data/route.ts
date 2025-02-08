import { NextRequest, NextResponse } from "next/server";
import { Form } from "@/models/form-model";
import { connectToDB } from "@/lib/db-connect";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    let totalOverWorkHours = 0;

    const version = request.nextUrl.searchParams.get("version");
    const userId = request.nextUrl.searchParams.get("id");

    const forms = await Form.find({ version, createdBy: userId });

    forms.forEach((form) => {
      totalOverWorkHours += form.overWork;
    });

    return NextResponse.json({
      success: true,
      data: {
        overWork: totalOverWorkHours,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
