import { Resolvers } from '../../../types/resolvers';
import User from '../../../entities/User';
import {
  EmailSignInMutationArgs,
  EmailSignInResponse,
} from '../../../types/graph';

const resolvers: Resolvers = {
  Mutation: {
    EmailSignIn: async (
      _,
      args: EmailSignInMutationArgs
    ): Promise<EmailSignInResponse> => {
      // TODO 입력받은 email로 User에서 사용자를 찾는다.
      try {
        const { email, password } = args;
        const user = await User.findOne({ email });

        if (!user) {
          return {
            ok: false,
            error: 'No User found with that email',
            token: null,
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
    },
  },
};

export default resolvers;

// return {
//   ok: true,
//   error: null,
//   token: 'Coming Soon!',
// };
// } else {
