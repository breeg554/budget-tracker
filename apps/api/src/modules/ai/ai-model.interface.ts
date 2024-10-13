import {
  AIMessage as LangchainAIMessage,
  HumanMessage as LangchainHumanMessage,
  SystemMessage as LangchainSystemMessage,
  BaseMessage,
  MessageContent,
} from '@langchain/core/messages';
import { z } from 'zod';

export interface AiModelArgs {
  apiKey: string;
  model?: string;
}

export interface AIMessage {
  role: 'ai';
  content: string;
}

export interface HumanMessage {
  role: 'user';
  content: string | MessageContent;
}

export interface SystemMessage {
  role: 'system';
  content: string;
}

export type AiModelMessage = AIMessage | HumanMessage | SystemMessage;

export type AiModelConstructor = new (args: AiModelArgs) => AiModel;

export abstract class AiModel {
  public abstract invoke<R>(messages: AiModelMessage[]): Promise<R>;

  public abstract withZodStructuredOutput<T extends z.ZodTypeAny>(
    schema: T,
  ): this;

  protected getMessages(messages: AiModelMessage[]) {
    return messages.map(this.formatMessage);
  }

  protected formatMessage(message: AiModelMessage): BaseMessage {
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
}
