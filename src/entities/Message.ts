import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import Chat from './Chat';

@Entity()
class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // many Message 가 하나의 Chat 를 바라본다.
  // type이 Chat임으로 Chat의 속성인 messages 를 참조할 수 있다. Chat에 정의된 messages는
  // Array<Message> 이다.
  // 서로가 관계를 가지는 속성에 대해서 바라보는입장에서 정의하나봄 복수의 Message는 하나의 Chat여서
  // Message에서 Chat에 대한 참조를 명세하나봄
  @ManyToOne(type => Chat, chat => chat.messages)
  chat: Chat;

  @CreateDateColumn()
  createdAt: string;
  @UpdateDateColumn()
  updatedAt: string;
}

export default Message;

/* TODO relationship
many-to-one
Message --> Chat
one-to-many
Chat    --> [Message]
*/
