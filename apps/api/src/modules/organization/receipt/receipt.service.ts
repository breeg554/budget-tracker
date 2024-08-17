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
          content: `You are a receipt processing bot. 
            I will send you shop receipt in base64 format and your job is to get products from it.
            
            The most common receipt language is Polish, but you can also get receipts in other languages.
            
            Return them in json format of that shape
            ---
            {
              content: ALL TEXT FROM RECEIPT THAT YOU USED TO GET PRODUCTS,
              products: [
                {
                  name: PRODUCT_NAME,
                  price: PRICE_OF_SINGLE_ITEM,
                  quantity: QUANTITY_OF_ITEMS (if you notice the same product multiple times in the receipt, sum the quantity up)
                  category: ID_OF_CATEGORY (if you can't match the product to any category, use the ID of the "other" category). Always use the most matching category for the product! The "other" category is the last resort.
                  categoryName: NAME_OF_CATEGORY,
                }
              ]
            }
            ---
            
            CATEGORIES:
            ---
              ${preparedCategories}
            ---
         
            Remember that:
            1. When you see product weight multiplied by price (e.g. 0.5kg x 3.00LN), you should look for the final price (that should be listed somewhere on the right side). In this case, the final price is 1.50PLN and quantity is 1!        
            2. Always get as many products as you can and try to not miss any.
            3. At the beginning of the receipt, there is always a shop name and address. You can ignore it. The same goes for the footer of the receipt. Products should be in the middle of the receipt.
            4. If you cannot retrieve any products or content from image, return empty array for "products" and empty string for "content".
            5. DO NOT return anything else than products and content. 
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
