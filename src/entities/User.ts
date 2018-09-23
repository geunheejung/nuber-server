import bcrypt from 'bcrypt';
import { IsEmail } from "class-validator";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "text", unique: true })
  @IsEmail()
  email: string;
  @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;
  @Column({ type: "text" })
  firstName: string;
  @Column({ type: "text" })
  lastName: string;
  @Column({ type: "int" })
  age: number;
  @Column({ type: "text" })
  password: string;
  @Column({ type: "text" })
  phoneNumber: string;
  @Column({ type: "boolean", default: false })
  verifiedPhonenNumber: boolean;
  @Column({ type: "text" })
  profilePhoto: string;

  @Column({ type: "boolean", default: false })
  isDriving: boolean;
  @Column({ type: "boolean", default: false })
  isRiding: boolean;
  @Column({ type: "boolean", default: false })
  isTaken: boolean;
  @Column({ type: "double precision", default: 0 })
  lastLng: number;
  @Column({ type: "double precision", default: 0 })
  lastLat: number;
  @Column({ type: "double precision", default: 0 })
  lastOrientation: number;
  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // 일반 text인 password와 hashing된 password랑 비교
  public comparePassword(password: string = '') : Promise<boolean> {  
    return bcrypt.compare(
      password,
      this.password
    );
  }

  // 새로운 object를 만들기 전에 불려지는 메소드  
  // async로 감싼 이유는 hashing 과정이 비동기적으로 이루어지기 때문이다.
  // 그러므로 hashedPassword 를 얻기 위해서는 hasing이 끝날때까지 await 기다려줘야 한다.
  @BeforeInsert()
  @BeforeUpdate()
  async savePassword() : Promise<void> {
    if (this.password) {
      // hash한다 즉 암호화한다.
      const hashedPassword = await this.hashPassword(this.password); 
      this.password = hashedPassword;
    }
  }
  // object를 업데이트하기 전에
  private hashPassword(password: string) : Promise<string> {
    return bcrypt.hash(
      password,
      BCRYPT_ROUNDS
    )
  }
} 

export default User;
