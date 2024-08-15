import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '~/entities/user/user.entity';
import { Organization } from '~/entities/organization/organization.entity';

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Organization)
  organization: Organization;
  @ManyToOne(() => User)
  author: User;
  @Column('text')
  content: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
