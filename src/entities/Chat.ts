import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import Message from './Message';
import User from './User';
import Ride from './Ride';

@Entity()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // type이 Message로 설정, Message안의 chat 속성을 참조할 수 있다.
  // message의 chat는 Chat 하나이기에 하나의 Chat가 messages를 messages가 하나의 Chat를
  @OneToMany(type => Message, message => message.chat)
  messages: Message[];

  @Column({ nullable: true })
  passengerId: number;
  @ManyToOne(type => User, user => user.chatAsPassenger)
  passenger: User;

  @Column({ nullable: true })
  driverId: number;
  @ManyToOne(type => User, user => user.chatAsDriver)
  driver: User;

  @OneToOne(type => Ride, ride => ride.chat)
  ride: Ride;

  @Column({ nullable: true })
  rideId: number;

  @CreateDateColumn()
  createdAt: string;
  @UpdateDateColumn()
  updatedAt: string;
}

export default Chat;

/* TODO relationship
many-to-one
Message --> Chat
one-to-many
Chat    --> [Message]
*/
