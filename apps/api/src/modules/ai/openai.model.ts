import { Injectable } from '@nestjs/common';
import {
  AiModel,
  AiModelArgs,
  AiModelMessage,
} from '~/modules/ai/ai-model.interface';
import { ChatOpenAI } from '@langchain/openai';

import { BaseMessageChunk } from '@langchain/core/messages';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z, ZodTypeAny } from 'zod';

@Injectable()
export class OpenAIModel<T = BaseMessageChunk> extends AiModel<T> {
  private readonly client: ChatOpenAI;

  constructor(
    private readonly args: AiModelArgs,
    private readonly parser?: StructuredOutputParser<ZodTypeAny>,
  ) {
    super();

    this.client = new ChatOpenAI({
      model: 'gpt-4o-2024-08-06',
      ...args,
    });
  }

  public async invoke(messages: AiModelMessage[]): Promise<T> {
    const client = this.parser
      ? this.client.withStructuredOutput(this.parser)
      : this.client;

    return client.invoke(this.getMessages(messages));
  }

  public withZodStructuredOutput<T extends z.ZodTypeAny>(
    schema: T,
  ): OpenAIModel<z.infer<T>> {
    return new OpenAIModel<T>(
      this.args,
      StructuredOutputParser.fromZodSchema(schema),
    );
  }
}
