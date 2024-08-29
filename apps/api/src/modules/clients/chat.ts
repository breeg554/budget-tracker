import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions';
import { ResponseFormatJSONObject, ResponseFormatText } from 'openai/resources';

export class ChatClient {
  constructor() {}

  async createChat(
    messages: ChatCompletionMessageParam[],
    args: {
      model?: string;
      response_format?: ResponseFormatJSONObject | ResponseFormatText;
      apiKey: string;
    },
  ) {
    const client = this.getChat(args.apiKey);

    const chatCompletion = await client.chat.completions.create({
      messages: messages,
      model: args.model ?? 'gpt-4o-2024-08-06',
      response_format: args.response_format,
    });

    return chatCompletion.choices[0].message;
  }

  private getChat(apiKey: string) {
    return new OpenAI({
      apiKey: apiKey,
    });
  }
}
