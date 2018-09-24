import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VerificationTarget } from '../types/types';

const PHONE = 'PHONE';
const EMAIL = 'EMAIL';

@Entity()
class Verification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', enum: [PHONE, EMAIL] })
  target: VerificationTarget;

  @Column({ type: 'text' })
  payload: string;

  @Column({ type: 'text' })
  key: string;

  @Column({ type: 'boolean', default: false })
  used: boolean;

  // @ManyToOne(type => User, user => user.verifications, { nullable: true })
  // user: User;

  @CreateDateColumn()
  createdAt: string;
  @UpdateDateColumn()
  updatedAt: string;

  @BeforeInsert()
  createKey(): void {
    switch (this.target) {
      case PHONE:
        this.key = String(Math.floor(Math.random() * 100000));
        break;
      case EMAIL:
        this.key = Math.random()
          .toString(36)
          .substr(2);
        break;
      default:
        throw Error('not this.key setting');
    }
  }
}

export default Verification;

/*
email이나 phoneNumber를 verify할 때,
verification 정보를 db에 만들기 위해서 생성된 파일이다.
사용자의 email, phoneNumber로 verification정보를 만들고,
key 값 또한 제작하게 될것

그가 verified되었는지 확인 가능

v.target = phone
v.payload = +8253852003
v.key = 3456
target - email 이였다면 key가 더 길었을 것
*/
