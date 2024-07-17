import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';

import {User} from "~/entities/user/user.entity";

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  refreshToken: string;
  @OneToOne(() => User, user => user.session, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
