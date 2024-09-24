import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Organization } from '~/entities/organization/organization.entity';
import { Session } from '~/entities/session/session.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  email: string;
  @Column()
  @Exclude()
  password: string;
  @ManyToMany(() => Organization, (organization) => organization.users)
  @JoinTable()
  organizations: Organization[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToOne(() => Session, (session) => session.user)
  @Exclude()
  session: Session;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
