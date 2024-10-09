import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from '~/entities/receipt/receipt.entity';
import { Repository } from 'typeorm';
import { OrganizationService } from '~/modules/organization/organization.service';
import { ChatClient } from '~/modules/clients/chat';
import { TransactionItemCategoryService } from '~/modules/organization/transaction/transaction-item/transaction-item-category/transaction-item-category.service';
import {
  getProcessedReceipt,
  getProcessedReceiptProducts,
} from '~/dtos/receipt/get-processed-receipt.dto';
import { ZodError } from 'zod';
import {
  ReceiptError,
  ReceiptParseError,
  ReceiptSchemaError,
} from '~/modules/organization/receipt/errors/receipt.error';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { FileService } from '~/modules/file/file.service';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    private readonly organizationService: OrganizationService,
    private readonly transactionItemCategoryService: TransactionItemCategoryService,
    private readonly chatClient: ChatClient,
    private readonly fileService: FileService,
  ) {}

  async process(
    file: Express.Multer.File,
    args: { organizationName: string; userId: string; secretName: string },
  ) {
    const secret = await this.organizationService.findOrganizationSecret(
      args.secretName,
      args.organizationName,
    );

    const productCategories =
      await this.transactionItemCategoryService.findAll();

    try {
      const receiptContent = await this.extractContentFromImage(
        file,
        secret.value,
      );
      const receiptProducts = await this.extractProductsFromContent(
        receiptContent.content,
        productCategories,
        secret.value,
      );
      return {
        content: receiptContent.content,
        products: receiptProducts.content,
        place: receiptProducts.place,
        date: receiptProducts.date,
      };
    } catch (err) {
      console.log(err);
      if (err instanceof SyntaxError) throw new ReceiptParseError();
      if (err instanceof ZodError) throw new ReceiptSchemaError();

      throw new ReceiptError(err);
    }
  }

  private async extractContentFromImage(
    file: Express.Multer.File,
    apiKey: string,
  ) {
    console.log(this.fileService.getFileUrl(file.filename));
    const result = await this.chatClient.invoke(
      [
        this.createSystemMessage(this.buildContentExtractionPrompt()),
        this.createUserImageMessage(this.fileService.getFileUrl(file.filename)),
      ],
      {
        apiKey: apiKey,
      },
    );
    const { content } = getProcessedReceipt.parse(
      JSON.parse(result.content as string),
    );

    return { ...result, content };
  }

  private async extractProductsFromContent(
    content: string,
    categories: TransactionItemCategory[],
    apiKey: string,
  ) {
    const result = await this.chatClient.invoke(
      [
        this.createSystemMessage(this.buildProductExtractionPrompt(categories)),
        this.createUserTextMessage(content),
      ],
      {
        apiKey: apiKey,
      },
    );
    const { products, date, place } = getProcessedReceiptProducts.parse(
      JSON.parse(result.content as string),
    );

    return { ...result, content: products, date, place };
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

          Return json format of that shape
          ---
           {
             content: ALL_CONTENT_FROM_RECEIPT_IN_STRING_FORMAT,
           }
          ---
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
          5. Assign the most appropriate category ID from the "Available Categories" list to each product. If no category fits, use the ID of "other" category as a last resort.
          6. Ensure that the "category" field contains only the ID (UUID format) from the "Available Categories" list and not the name. The "categoryName" should contain the actual name from the same list.
          7. Product names shouldn't be capitalized.
          8. Ensure that price refers to the price per unit or kg and not the total line price!
          9. Repeat the process two/three times to be sure you have extracted all the necessary information.

          --- Available Categories ---

          ${this.formatCategories(categories)}

          ---

          Return json format of that shape

            ---
            {
              date: DATE_OF_TRANSACTION ( e.g. "2024-01-01" ),
              place: PLACE_OF_TRANSACTION ( e.g. "Supermarket" ),
              products: [
                {
                  name: PRODUCT_NAME ( e.g. "Apple" ),
                  price: PRICE_OF_ITEM ( e.g. 2.99 ),
                  quantity: QUANTITY_OF_ITEM ( e.g. 1 ),
                  category: ID_OF_CATEGORY ( e.g. "c1b1b1b1-1b1b-1b1b-1b1b-1b1b1b1b1b1b" ),
                  categoryName: NAME_OF_CATEGORY, ( e.g. "Vegetables" )
                }
              ]
            }
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

  private base64(file: Express.Multer.File) {
    return `data:image/${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }
}
