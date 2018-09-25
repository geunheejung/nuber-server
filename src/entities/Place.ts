import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import User from './User';

@Entity()
class Place extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'double precision', default: 0 })
  lat: number;

  @Column({ type: 'double precision', default: 0 })
  lng: number;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'boolean', default: false })
  isFav: boolean;

  // typeORM에서 아래와 같이 user에 Id를 붙이면 user.id가 자동적으로 담긴다. 이렇게 하면 모든 relationship 정보를
  // 로드하지 않아도 된다.
  @Column({ nullable: true })
  userId: number;

  @ManyToOne(type => User, user => user.places)
  user: User;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}

export default Place;
