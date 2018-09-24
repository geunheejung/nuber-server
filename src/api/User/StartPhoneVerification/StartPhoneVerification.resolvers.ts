import { Resolvers } from '../../../types/resolvers';
import {
  StartPhoneVerificationMutationArgs,
  StartPhoneVerificationResponse,
} from '../../../types/graph';
import Verification from '../../../entities/Verification';
import { sendVerificationSMS } from '../../../utils/sendSMS';

const resolvers: Resolvers = {
  Mutation: {
    StartPhoneVerification: async (
      _,
      args: StartPhoneVerificationMutationArgs
    ): Promise<StartPhoneVerificationResponse> => {
      try {
        const { phoneNumber } = args;
        const existingVerification = await Verification.findOne({
          payload: phoneNumber,
        });

        // existingVerification이 있는지 체크해주지 않으면 existingVerification 값이 undefined 도 나올수있음.
        if (existingVerification) {
          existingVerification.remove();
        }

        const newVerification = await Verification.create({
          payload: phoneNumber,
          target: 'PHONE',
        }).save();
        console.log('newVerification :', newVerification);
        // todo: send sms
        await sendVerificationSMS(newVerification.payload, newVerification.key);
        return {
          ok: true,
          error: null,
          token: 'Coming Soon',
        };
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
