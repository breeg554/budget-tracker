import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TransactionType } from '~/dtos/transaction/transaction-type.enum';
import { Organization } from '~/entities/organization/organization.entity';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { User } from '~/entities/user/user.entity';

@Entity()
@Index(['organization', 'date'])
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
  @ManyToOne(() => User)
  author: User;
  @Column()
  date: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
