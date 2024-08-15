import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { Organization } from '~/entities/organization/organization.entity';

@Entity()
@Unique(['name', 'organization'])
export class Secret {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  @Exclude()
  value: string;
  @ManyToOne(() => Organization)
  organization: Organization;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
