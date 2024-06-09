import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionType } from '~/dtos/transaction/transaction-type.enum';
import { Organization } from '~/entities/organization/organization.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;
  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.transaction,
    { cascade: true },
  )
  items: TransactionItem[];
  @ManyToOne(() => Organization, (organization) => organization.transactions)
  organization: Organization;
  @Column()
  date: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
