// 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"

import axios from "axios";

const apiKey = "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";

export const generateSuggestion = async (summaries) => {
  try {
    console.log("From openAI.js: ", summaries);

    const completionPromises = summaries.map(async (summary) => {
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "ft:gpt-3.5-turbo-0613:zion::8TRg2hLV",
            messages: [{ role: "system", content: "Generate helpful task suggestions for users based on their calendar events and their dates. Some events can be ignored, and some can be used to generate task suggestions. User's message will always be in this format: 'Event name, Event date'. If you choose to ignore the event, just say 'ignore'. If you want to use the event to generate task suggestion, send a message with the task suggestion." }, { role: "user", content: `${summary}` }],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        return response.data.choices[0].message.content;
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
