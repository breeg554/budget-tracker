import { Injectable } from '@nestjs/common';
import { TransactionItemCategoryService } from '~/modules/organization/transaction/transaction-item/transaction-item-category/transaction-item-category.service';
import {
  getProcessedReceipt,
  GetProcessedReceiptDto,
  getProcessedReceiptProducts,
  GetProcessedReceiptProductsDto,
} from '~/dtos/receipt/get-processed-receipt.dto';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { AiModel } from '~/modules/ai/ai-model.interface';
import { ConfigService } from '@nestjs/config';
import { StorageClient } from '~/modules/storage/interfaces/storage-client.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from '~/entities/receipt/receipt.entity';
import { Repository } from 'typeorm';
import { OrganizationService } from '~/modules/organization/organization.service';
import { UserService } from '~/modules/user/user.service';
import { ReceiptCreateFailedError } from '~/modules/organization/receipt/errors/receipt.error';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    private readonly transactionItemCategoryService: TransactionItemCategoryService,
    private configService: ConfigService,
    private readonly storageClient: StorageClient,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  public async processReceiptImage(
    fileUrl: string,
    aiClient: AiModel<GetProcessedReceiptDto>,
  ): Promise<GetProcessedReceiptDto> {
    return aiClient
      .withZodStructuredOutput(getProcessedReceipt)
      .invoke([
        this.createSystemMessage(this.buildContentExtractionPrompt()),
        this.createUserImageMessage(fileUrl),
      ]);
  }

  public async processReceiptContent(
    content: string,
    aiClient: AiModel,
  ): Promise<GetProcessedReceiptProductsDto> {
    const categories = await this.transactionItemCategoryService.findAll();

    return aiClient
      .withZodStructuredOutput(getProcessedReceiptProducts)
      .invoke([
        this.createSystemMessage(this.buildProductExtractionPrompt(categories)),
        this.createUserTextMessage(content),
      ]);
  }

  public async upload(
    file: Express.Multer.File,
    organizationName: string,
    userId: string,
  ) {
    try {
      const organization =
        await this.organizationService.findByName(organizationName);
      const user = await this.userService.findOne(userId);

      const { key } = await this.storageClient.upload(file.buffer, {
        name: file.originalname,
        ...file,
        key: `${organizationName}/${userId}/${crypto.randomUUID()}`,
      });

      const receipt = new Receipt();
      receipt.organization = organization;
      receipt.author = user;
      receipt.key = key;
      receipt.originalName = file.originalname;
      receipt.mimeType = file.mimetype;
      receipt.size = file.size;

      return await this.receiptRepository.save(receipt);
    } catch (err) {
      throw new ReceiptCreateFailedError(err);
    }
  }

  private createSystemMessage(content: string) {
    return {
      role: 'system' as const,
      content,
    };
  }

  private createUserTextMessage(content: string) {
    return {
      role: 'user' as const,
      content: content,
    };
  }

  private createUserImageMessage(imageUrl: string) {
    return {
      role: 'user' as const,
      content: [
        {
          type: 'image_url',
          image_url: {
            url: imageUrl,
          },
        },
      ],
    };
  }

  private buildContentExtractionPrompt() {
    return `
          You are an expert in extracting information from receipts. 
          I will send you a shop receipt in image format and your task is to retrieve all details from the receipt in string format.
          
          Receipt image may be of low or high quality.
         
          Remember to:
          1. Extract as many details as possible from the receipt. Split lines by new line character.
          2. Repeat the process two times to ensure you have extracted all the necessary information and in correct order.

          If you cannot retrieve any content from image, return empty string for "content".
          `;
  }

  private buildProductExtractionPrompt(categories: TransactionItemCategory[]) {
    return `
          You are an expert in extracting information from receipt content. I will send you a shop receipt (in string format) and your task is to retrieve all product details.
      
          Remember to:
          1. Extract as many products as possible from the receipt. Ensure each product's name, price, and quantity are correctly identified.
          2. Read the receipt line by line for correctly matching product name, price and quantity:
            - Do not go to the next line until you are sure you have extracted all the necessary information.
            - Remember that Price appear after the quantity.
            - Quantity is a number with a comma or a dot (e.g., 0.5, 0.75, 1, 1.5, 2).
            - Price is a number with a comma or a dot (e.g., 3.5, 1.75, 1.22, 1.21, 22.12).
            - The default quantity is 1.
          3. For items sold by weight (e.g., fruits, vegetables):
            - Use the weight as the quantity.
            - Extract the price per 1 kg.
            - Example format: "0.836 x9.99 = 8.35" where 0.836 is the quantity, 9.99 is the price per kg.
          4. If you notice the same products (products are the same when have the same name and price) multiple times in the receipt, sum the quantity up!
          5. Assign the most appropriate category ID (e.g. "c1b1b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b") from the "Available Categories" list to each product. If no category fits, use the ID (e.g. "c1b1b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b") of "other" category as a last resort.
          6. Ensure that the "category" field contains only the ID (UUID format) from the "Available Categories" list and not the name. The "categoryName" should contain the actual name from the same list.
          7. Product names shouldn't be capitalized.
          8. Ensure that price refers to the price per unit or kg and not the total line price!
          9. Repeat the process two/three times to be sure you have extracted all the necessary information.

          --- Available Categories ---

          ${this.formatCategories(categories)}

          ---   

          If you cannot retrieve any products from the content, return empty array for "products".
          `;
  }

  private formatCategories(categories: TransactionItemCategory[]) {
    return JSON.stringify(
      categories.map((c) => ({ id: c.id, name: c.name })),
      null,
      2,
    );
  }
}
