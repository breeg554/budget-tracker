import { ChatOpenAI, ChatOpenAIFields } from '@langchain/openai';
import {
  AIMessage as LangchainAIMessage,
  HumanMessage as LangchainHumanMessage,
  SystemMessage as LangchainSystemMessage,
  BaseMessage,
  MessageContent,
} from '@langchain/core/messages';

type ChatOpenAIArgs = Partial<ChatOpenAIFields> & { apiKey: string };

type AIMessage = {
  role: 'ai';
  content: string;
};

type HumanMessage = {
  role: 'user';
  content: string | MessageContent;
};

type SystemMessage = {
  role: 'system';
  content: string;
};

type ChatMessage = AIMessage | HumanMessage | SystemMessage;

export class ChatClient {
  public async invoke(messages: ChatMessage[], args: ChatOpenAIArgs) {
    const result = await this.initializeChat(args).invoke(
      this.getMessages(messages),
    );

    return { content: result.content, usage: result.usage_metadata };
  }

  private getMessages(messages: ChatMessage[]) {
    return messages.map(this.formatMessage);
  }

  private formatMessage(message: ChatMessage): BaseMessage {
    switch (message.role) {
      case 'ai':
        return new LangchainAIMessage(message.content);
      case 'user':
        return new LangchainHumanMessage(
          typeof message.content === 'string'
            ? message.content
            : { content: message.content },
        );
      case 'system':
        return new LangchainSystemMessage(message.content);
      default:
        throw new Error('Invalid message type');
    }
  }

  private initializeChat(args: ChatOpenAIArgs) {
    return new ChatOpenAI({
      model: 'gpt-4o-2024-08-06',
      modelKwargs: {
        response_format: { type: 'json_object' },
      },
      ...args,
    });
  }
}
