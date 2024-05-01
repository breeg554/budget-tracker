import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionType } from '~/dtos/transaction/transaction-type.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ type: 'numeric', precision: 10, scale: 3 })
  value: number;
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;
  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.transaction,
  )
  items: TransactionItem[];
  @Column()
  date: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
