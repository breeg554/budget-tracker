import {
  AIMessage as LangchainAIMessage,
  HumanMessage as LangchainHumanMessage,
  SystemMessage as LangchainSystemMessage,
  BaseMessage,
  MessageContent,
  BaseMessageChunk,
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

export type AiModelConstructor = new <R extends BaseMessageChunk>(
  args: AiModelArgs,
) => AiModel<R>;

export abstract class AiModel<R = BaseMessageChunk> {
  public abstract invoke(messages: AiModelMessage[]): Promise<R>;

  public abstract withZodStructuredOutput<T extends z.ZodTypeAny>(
    schema: T,
  ): AiModel<z.infer<T>>;

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
