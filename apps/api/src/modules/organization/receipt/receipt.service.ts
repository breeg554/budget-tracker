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
            Return them in json format of that shape
            ---
            {
              content: TEXT_FROM_RECEIPT,
              products: [
                {
                  name: PRODUCT_NAME,
                  price: PRICE_OF_SINGLE_ITEM,
                  quantity: QUANTITY_OF_ITEMS (if you notice the same product multiple times in the receipt, sum the quantity up)
                  category: ID_OF_CATEGORY (if you can't match the product to any category, use the ID of the "Other" category)
                  categoryName: NAME_OF_CATEGORY,
                }
              ]
            }
            ---
            
            CATEGORIES:
            ---
              ${preparedCategories}
            ---
            
            DO not return anything else! 
            
            If you cannot retrieve any products or content from image, return empty array for "products" and empty string for "content".
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
