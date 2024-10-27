import openai from "../../../config";
import { z } from "zod";

const EnhanceTaskSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

export const generatePrompt = (description: string) => {
  return [
    {
      role: "system" as const,
      content:
        "You are an experienced task manager AI with expertise in project planning and time estimation. Your goal is to enhance task descriptions for clarity and provide realistic time estimates based on the complexity of the tasks described. Always provide your response in a natural language format, not in JSON.",
    },
    {
      role: "user" as const,
      content: `I need your assistance in improving the following task description:\n\n${description}`,
    },
    {
      role: "user" as const,
      content:
        "When providing the enhanced description, please ensure that you include a time estimate. Do not include any labels like 'Enhanced Task Description:' or 'Time Estimate:'. Simply provide the enhanced description followed by the time estimate on a new line, formatted like this: 'This task is estimated to take approximately X hours to complete.'",
    },
  ];
};

export const enhanceTaskDescription = async (description: string) => {
  try {
    const validatedData = EnhanceTaskSchema.parse({ description });
    const prompt = generatePrompt(validatedData.description);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt,
      temperature: 0.3,
      max_tokens: 3500,
    });

    const enhancedDescription = response.choices[0].message.content;

    return { enhancedDescription };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    console.error("Error enhancing task description:", error);
    return { error: "Failed to enhance description" };
  }
};
