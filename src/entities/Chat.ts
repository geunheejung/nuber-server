import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Message from './Message';

@Entity()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // type이 Message로 설정, Message안의 chat 속성을 참조할 수 있다.
  // message의 chat는 Chat 하나이기에 하나의 Chat가 messages를 messages가 하나의 Chat를
  @OneToMany(type => Message, message => message.chat)
  messages: Message[];

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
