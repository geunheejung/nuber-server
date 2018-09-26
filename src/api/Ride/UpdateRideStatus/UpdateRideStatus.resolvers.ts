import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../utils/privateResolver';
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse,
} from '../../../types/graph';
import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import { RIDE_STATUS } from '../../../Constans';

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;

        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === RIDE_STATUS.ACCEPTED) {
              ride = await Ride.findOne({
                id: args.rideId,
                status: 'REQUESTING',
              });

              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
              }
            } else {
              ride = await Ride.findOne({
                id: args.rideId,
                driver: user,
              });
            }

            if (ride) {
              ride.status = args.status;
              ride.save();

              return {
                ok: true,
                error: null,
              };
            } else {
              return {
                ok: false,
                error: `[Can't update ride]`,
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
            };
          }
        } else {
          return {
            ok: false,
            error: `You are not driving`,
          };
        }
      }
    ),
  },
};
export default resolvers;

/** TODO
 * 1. 드라이버가 변경 요청한 상태가 ACEPTED
 *  1.1 상태가 REQUESTING인 ride를 찾는다.(요청 중인 걸 수락해야 함.)
 *    1.1.1 만약 ride가 존재한다면
 *      - ride의 driver를 user로 설정하고, 저장한다. (user는 상태변경을 요청한 드라이버)
 * 2. 드라이버 상태가 REQUESTING일 때
 *  2.1 수락할 수 있어야 한다. 수락할 때 ride의 driver를 요청한 드라이버로 설정한다.
 *
 *
 */
