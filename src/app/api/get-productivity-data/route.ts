import { connectToDB } from "@/lib/db-connect";
import { Form } from "@/models/form-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const id = request.nextUrl.searchParams.get("id");
    const version = request.nextUrl.searchParams.get("version");

    const productivityData: {
      date: string;
      productivity: string;
    }[] = [];

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
    })
      .select("productivity createdAt")
      .sort({
        createdAt: -1,
      })
      .limit(30);

    if (!forms.length) {
      return NextResponse.json({
        message: "Forms not found",
        success: true,
        data: { productivityData: [] },
      });
    }

    forms.forEach((form) => {
      let date = form.createdAt.toLocaleDateString();
      date = date.split("/");
      const formattedDate = `${date[1]}/${date[0]}/${date[2]}`;
      productivityData.push({
        productivity: form.productivity,
        date: formattedDate,
      });
    });

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
