import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TransactionItem } from '~/entities/transaction/transactionItem.entity';

@Entity()
export class TransactionItemCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.category,
  )
  items: TransactionItem[];
}
