import { Resolvers } from '../../../types/resolvers';
import {
  RequestRideResponse,
  RequestRideMutationArgs,
} from '../../../types/graph';
import privateResolver from '../../../utils/privateResolver';
import Ride from '../../../entities/Ride';
import User from '../../../entities/User';

export const RIDE_REQUEST: string = 'rideRequest';

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: privateResolver(
      async (
        _,
        args: RequestRideMutationArgs,
        { req, pubSub }
      ): Promise<RequestRideResponse> => {
        const user: User = req.user;
        if (!user.isRiding) {
          try {
            const ride = await Ride.create({ ...args, passenger: user }).save();
            // 2번째 인자인 payload로 requestRide를 요청한 user의 위치를 전해주면
            pubSub.publish(RIDE_REQUEST, { NearbyRideSubscription: ride });
            user.isRiding = true;
            user.save();
            return {
              ok: true,
              error: null,
              ride,
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              ride: null,
            };
          }
        } else {
          // user.isRiding = false;
          // user.save();
          return {
            ok: false,
            error: `You can't request two rides`,
            ride: null,
          };
        }
      }
    ),
  },
};

export default resolvers;