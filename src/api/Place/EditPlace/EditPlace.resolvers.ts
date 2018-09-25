import Place from '../../../entities/Place';
import User from '../../../entities/User';
import { EditPlaceMutationArgs, EditPlaceResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import cleanNullArgs from '../../../utils/cleanNullArg';
import privateResolver from '../../../utils/privateResolver';
const resolvers: Resolvers = {
  Mutation: {
    EditPlace: privateResolver(
      async (
        _,
        args: EditPlaceMutationArgs,
        { req }
      ): Promise<EditPlaceResponse> => {
        const user: User = req.user;
        try {
          // 1. 수정하려하는 place를 placeId로 찾는다.
          // Place.findOne의 2번째 인자로 relationship 된 filed들을 가져올 수 있지만 모드 로드해야함. 뒤쳐진 방식
          const place = await Place.findOne({ id: args.placeId });
          // 2. place가 존재하는지 체크한다.
          if (place) {
            // 3. user의 place가 맞는지 체크한다.
            // userId를 추가한 이유는 우리가 place를 찾아도 이때는 relationship을 로드하지 않기에 user로 접근 불가
            if (place.userId === user.id) {
              const notNull = cleanNullArgs(args);
              await Place.update({ id: args.placeId }, { ...notNull });
              return {
                ok: true,
                error: null,
              };
            } else {
              return {
                ok: false,
                error: 'Not Authorized',
              };
            }
          } else {
            return {
              ok: false,
              error: 'Place not found',
            };
          }
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
