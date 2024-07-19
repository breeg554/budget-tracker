import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TransactionItemType } from '~/dtos/transaction/transaction-item-type.enum';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  quantity: number;
  @Column({ type: 'numeric', precision: 10, scale: 3 })
  price: number;
  @Column({
    type: 'enum',
    enum: TransactionItemType,
  })
  type: TransactionItemType;
  @ManyToOne(() => TransactionItemCategory, (category) => category.items, {
    eager: true,
  })
  category: TransactionItemCategory;
  @ManyToOne(() => Transaction, (transaction) => transaction.items)
  transaction: Transaction;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
