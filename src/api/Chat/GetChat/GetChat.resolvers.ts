import privateResolver from '../../../utils/privateResolver';
import { GetChatQueryArgs, GetChatResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import User from '../../../entities/User';
import Chat from '../../../entities/Chat';

const resolvers: Resolvers = {
  Query: {
    GetChat: privateResolver(
      async (_, args: GetChatQueryArgs, { req }): Promise<GetChatResponse> => {
        const user: User = req.user;
        try {
          const chat = await Chat.findOne(
            {
              id: args.chatId,
            },
            // 모델의 관계모델을 가져오고 싶지 않으면 relations를 추가해야 한다.
            { relations: ['messages'] }
          );

          if (chat) {
            const { passengerId, driverId } = chat;
            if (passengerId === user.id || driverId === user.id) {
              return {
                ok: true,
                error: null,
                chat,
              };
            } else {
              return {
                ok: false,
                error: 'Not authrized to see this chat',
                chat: null,
              };
            }
          } else {
            return {
              ok: false,
              error: 'Not found',
              chat: null,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            chat: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
