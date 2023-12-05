// 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"

import axios from "axios";

const apiKey = "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";

export const generateSuggestion = async (summaries) => {
  try {
    console.log("From openAI.js: ", summaries);

    const prompts = summaries.map(
      (summary) =>
        `Generate a task suggestion based on the title of this calendar event: "${summary}". Maximum word count of your response should be 5.`
    );

    console.log("Prompts: ", prompts);

    const completionPromises = prompts.map(async (prompt) => {
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/engines/davinci/completions",
          {
            prompt: prompt,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        return response.data.choices[0].text.trim();
      } catch (error) {
        console.error("Error in generating completion:", error);
        return null;
      }
    });

    const completions = await Promise.all(completionPromises);

    const suggestions = completions.map((completion) => completion);

    return suggestions.filter((suggestion) => suggestion !== null);
  } catch (error) {
    console.error("Error in generating suggestions: ", error);
    return [];
  }
};
