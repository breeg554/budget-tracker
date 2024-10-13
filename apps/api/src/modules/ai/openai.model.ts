import { Injectable } from '@nestjs/common';
import {
  AiModel,
  AiModelArgs,
  AiModelMessage,
} from '~/modules/ai/ai-model.interface';
import { ChatOpenAI } from '@langchain/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

@Injectable()
export class OpenAIModel extends AiModel {
  private readonly client: ChatOpenAI;
  private parser: StructuredOutputParser<any>;

  constructor(args: AiModelArgs, parser?: StructuredOutputParser<any>) {
    super();

    this.client = new ChatOpenAI({
      model: 'gpt-4o-2024-08-06',
      ...args,
    });

    this.parser = parser;
  }

  public async invoke(messages: AiModelMessage[]): Promise<any> {
    const client = this.parser
      ? this.client.withStructuredOutput(this.parser)
      : this.client;

    return client.invoke(this.getMessages(messages));
  }

  public withZodStructuredOutput<T extends z.ZodTypeAny>(schema: T) {
    this.parser = StructuredOutputParser.fromZodSchema(schema);

    return this;
  }
}
