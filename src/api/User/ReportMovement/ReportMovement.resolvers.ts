import User from '../../../entities/User';
import {
  ReportMovementMutationArgs,
  ReportMovementResponse,
} from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import cleanNullArgs from '../../../utils/cleanNullArg';
import privateResolver from '../../../utils/privateResolver';
const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: privateResolver(
      async (
        _,
        args: ReportMovementMutationArgs,
        { req, pubSub }
      ): Promise<ReportMovementResponse> => {
        const user: User = req.user;
        const notNull = cleanNullArgs(args);
        try {
          await User.update({ id: user.id }, { ...notNull });
          // pubSub안에 update를 보낸다. diver이름과 보낼 data가 필요, key는 완전히 매칭되어야 한다.
          const updatedUser = await User.findOne({ id: user.id });

          pubSub.publish('driverUpdate', { DriversSubscription: updatedUser });
          return {
            ok: true,
            error: null,
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
          };
        }
      }
    ),
  },
};
export default resolvers;
