import { connectToDB } from "@/lib/db-connect";
import { Form } from "@/models/form-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const id = request.nextUrl.searchParams.get("id");
    const productivityData: {
      date: string;
      productivity: string;
    }[] = []

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
    }).select("productivity createdAt").sort({
      createdAt: -1
    }).limit(30);


    if (!forms.length) {
      return NextResponse.json(
        { message: "User not found", success: false },
        {
          status: 404,
        }
      );
    }

    forms.forEach(form => {
      productivityData.push({
        productivity: form.productivity,
        date: form.createdAt.toLocaleDateString(),
      })
    })

    return NextResponse.json(
      { success: true, data: { productivityData } },
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