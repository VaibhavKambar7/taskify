import { enhanceTaskDescription } from "@/app/openai/prompt";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const validatedData = z
      .object({
        description: z.string().min(1, "Description is required"),
      })
      .parse(data);

    const result = await enhanceTaskDescription(validatedData.description);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      enhancedDescription: result.enhancedDescription,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to enhance description" },
      { status: 500 }
    );
  }
}
