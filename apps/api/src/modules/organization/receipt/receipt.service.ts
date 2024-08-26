import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from '~/entities/receipt/receipt.entity';
import { Repository } from 'typeorm';
import { OrganizationService } from '~/modules/organization/organization.service';
import { ChatClient } from '~/modules/clients/chat';
import { TransactionItemCategoryService } from '~/modules/organization/transaction/transaction-item/transaction-item-category/transaction-item-category.service';
import { getProcessedReceipt } from '~/dtos/receipt/get-processed-receipt.dto';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
    private readonly organizationService: OrganizationService,
    private readonly transactionItemCategoryService: TransactionItemCategoryService,
    private readonly chatClient: ChatClient,
  ) {}

  async process(
    file: Express.Multer.File,
    args: { organizationName: string; userId: string; secretName: string },
  ) {
    const secret = await this.organizationService.findOrganizationSecret(
      args.secretName,
      args.organizationName,
      args.userId,
    );

    const productCategories =
      await this.transactionItemCategoryService.findAll();

    const base64Image = file.buffer.toString('base64');

    const preparedCategories = JSON.stringify(
      productCategories.map((c) => ({ id: c.id, name: c.name })),
      null,
      2,
    );

    const messages = await this.chatClient.createChat(
      [
        {
          role: 'system',
          content: `
          You are an expert in extracting information from receipts. I will send you a shop receipt in image format ( image is taken vertically ) in Polish, and your task is to accurately retrieve all product details.

          Remember to:
          1. Extract as many products as possible from the receipt. Ensure each product's name, price, and quantity are correctly identified.
          2. Read the receipt line by line for correctly matching product name, price and quantity:
            - Do not go to the next line until you are sure you have extracted all the necessary information.
            - Remember that Price appear after the quantity.
            - In most cases product name is at the beginning of the line when the quantity and price are at the end.
            - Quantity is a number with a comma or a dot (e.g., 0.5, 0.75, 1, 1.5, 2).
            - Price is a number with a comma or a dot (e.g., 3.5, 1.75, 1.22, 1.21, 22.12).
            - The default quantity is 1.
          3. For items sold by weight (e.g., fruits, vegetables):
            - Use the weight as the quantity.
            - Extract the price per 1 kg.
            - Example format: "0.836 x9.99 = 8.35" where 0.836 is the quantity, 9.99 is the price per kg.
          4. If you notice the same products (products are the same when have the same name and price) multiple times in the receipt, sum the quantity up!
          6. Assign the most appropriate category ID from the "Available Categories" list to each product. If no category fits, use the ID of "other" category as a last resort.
          7. Ensure that the "category" field contains only the ID (UUID format) from the "Available Categories" list and not the name. The "categoryName" should contain the actual name from the same list.
          
          --- Available Categories ---
       
          ${preparedCategories}
        
          ---

          Return json format of that shape
          
            ---
            {
              content: ALL TEXT FROM RECEIPT THAT YOU USED TO GET PRODUCTS,
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
            
          If you cannot retrieve any products or content from image, return empty array for "products" and empty string for "content".
          
          Check two, three times that name, quantity, and price are correctly matched. Ensure that price refers to the price per unit or kg and not the total line price!!!
          
          Ignore addresses, dates, and other irrelevant information that are above and below the product list.
          `,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/${file.mimetype};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      {
        apiKey: secret.value,
        response_format: { type: 'json_object' },
      },
    );

    return getProcessedReceipt.parse(JSON.parse(messages.content));
  }
}
