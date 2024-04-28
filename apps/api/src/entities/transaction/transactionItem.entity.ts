import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { TransactionItemType } from '~/dtos/transaction/transaction-item-type.enum';

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  amount: number;
  @Column({ type: 'numeric', precision: 10, scale: 3 })
  value: number;
  @Column({
    type: 'enum',
    enum: TransactionItemType,
  })
  type: TransactionItemType;
  @ManyToOne(() => TransactionItemCategory, (category) => category.items)
  category: TransactionItemCategory;
  @ManyToOne(() => Transaction, (transaction) => transaction.items)
  transaction: Transaction;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
