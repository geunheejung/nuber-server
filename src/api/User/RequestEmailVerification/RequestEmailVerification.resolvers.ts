import User from '../../../entities/User';
import Verification from '../../../entities/Verification';
import privateResolver from '../../../utils/privateResolver';
import { RequestEmailVerificationResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import { sendVerificationEmail } from '../../../utils/sendEmail';

const resolvers: Resolvers = {
  Mutation: {
    RequestEmailVerification: privateResolver(
      async (_, __, context): Promise<RequestEmailVerificationResponse> => {
        const user: User = context.req.user;
        if (user.email && !user.verifiedEmail) {
          try {
            const oldVerification = await Verification.findOne({
              payload: user.email,
            });
            if (oldVerification) {
              oldVerification.remove();
            }
            const newVerificatipn = await Verification.create({
              payload: user.email,
              target: 'EMAIL',
            }).save();
            await sendVerificationEmail(user.fullName, newVerificatipn.key);
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
        } else {
          return {
            ok: false,
            error: 'Your user has no email to verify',
          };
        }
      }
    ),
  },
};

export default resolvers;

/*
verfiy Email 과정에서 sendEmail을 하면 고유한 key와 함께 link가 생성된 mail이 가는데
react로 해당 link에 매칭되는 sceen을 그려줘야한다.
그러므로 reactApp에서 할건 key값을 가져서 자동으로 CompleteEmailVerification 으로 보내는것이다.
*/
