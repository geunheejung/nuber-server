import _isNull from 'lodash/isNull';
import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../utils/privateResolver';
import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse,
} from '../../../types/graph';
import User from '../../../entities/User';
import cleanNullArgs from '../../../utils/cleanNullArg';

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        context
      ): Promise<UpdateMyProfileResponse> => {
        const user: User = context.req.user;
        const notNull: any = cleanNullArgs(args);

        // 인스턴스를 업데이트하기 위해서는 해당 인스턴스의 값이 존재해야 업데이트가 가능한가봄.
        if (!_isNull(notNull.password)) {
          user.password = notNull.password;
          user.save();
          delete notNull.password;
        }

        try {
          /* BUG 수정 - password update 시 해싱이 되어야하지만 instance.save()를 하지 않으면 update로 간주하지 않음.
          User 엔티티의 beforeUpdate()라이프사이클 hook에 걸리기 위해서는 User클래스의 인스턴스 객체인 user를 업데이트해야 beforeUpdate()가
          실행된다. 즉 아래의 방식은 user 인스턴스 객체에 대한 체크가 없기에 user 인스턴스가 없다면 아무 beforeUpdate() hook에 걸리지 않아서
          해싱이 안된 순수한 password값이 db 에 저장되버린다.
          */
          await User.update({ id: user.id }, { ...notNull });
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

        return {
          ok: false,
          error: '',
        };
      }
    ),
  },
};

export default resolvers;
