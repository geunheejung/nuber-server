import { Resolvers } from '../../../types/resolvers';
import Verification from '../../../entities/Verification';
import {
  CompletePhopneNumberVerificationMutationArgs,
  CompletePhopneNumberVerificationResponse,
} from '../../../types/graph';
import User from '../../../entities/User';
import createJWT from '../../../utils/createJWT';

/** TODO phoneNumber 검증
 * 1. phoneNumber가 Verification 되었나?
 * 1.1 Verification.verified = true;로 바꾸고 save();
 * 1.2 검증되지 않았다고 error 반환
 * 2. 이미 존재하는 phoneNumber인가?
 * 2.1 user의 verifiedPhoneNumber = true; save(); 검증 완료
 * 2.2 phoneNumber verified는 되었지만 DB에는 존재하지 않음 그러므로 error, token 둘다 null ok는 true
 *
 */
const resolvers: Resolvers = {
  Mutation: {
    CompletePhopneNumberVerification: async (
      _,
      args: CompletePhopneNumberVerificationMutationArgs
    ): Promise<CompletePhopneNumberVerificationResponse> => {
      const { phoneNumber, key } = args;
      try {
        const verification = await Verification.findOne({
          payload: phoneNumber,
          key,
        });

        if (!verification) {
          return {
            ok: false,
            error: 'Verificztion token not vaild',
            token: null,
          };
        } else {
          verification.verified = true;
          verification.save();
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }

      try {
        const user = await User.findOne({ phoneNumber });
        // verification을 통과한 뒤 user가 DB에 존재할 경우
        if (user) {
          user.verifiedPhoneNumber = true;
          user.save();
          const token = createJWT(user.id);
          return {
            ok: true,
            error: null,
            token,
          };
        } else {
          // phoneNumber는 verified되었지만, DB에 존재하지는 않은 유저
          // phone 인증은 성공했지만 할당된 유저는 없기에 성공이면서 null
          return {
            ok: true,
            error: null,
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

/*
만약 이미 계정을 가지고 있고
방금 폰을 열었고
내번호를 인증하고싶은데
내가 이미 계정이 있다면
내가 이메일이나 패스워드를 잊어버렸어도 자동으로 로그인이될 수 있어야한다.
휴대폰 번호로 되있는 계정이 있는걸 안다.
그럼 나는 verification 과정을 다른사람들처럼 시작할거지만
내가 그걸 끝냈을때
시스템은 그 휴대폰 번호를 ㅏㄱ지고 있는 유저가 이미 존재한다는것을 알아야한다.
그래서 이게 자동으로 인증할것이고,
만약 그 핸드폰번호를 가진 유저가 없으면
오케이 인증되었다라 뜰것
하지만 유저(계정)은 없을것.

어플은 우리가 어떻게 보내냐에따라 다르게 반응하기에
어떤 유저의 폰 번호가 인증되고 우리가 데이터베이스에서 그 사람을 찾으면
우리는 그 사람을 고정(잠금)해 둔다.

만약에 어떤 유저가 폰번호를 인증하고
데이터베이스에 등록되지 않았다는게 증명되면
그건 그 유저가 프로필을 생성하길 원한다는 뜻
*/
