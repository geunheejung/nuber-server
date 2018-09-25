import { Resolvers } from '../../../types/resolvers';
import {
  RequestRideResponse,
  RequesrRideMutationArgs,
} from '../../../types/graph';
import privateResolver from '../../../utils/privateResolver';
import Ride from '../../../entities/Ride';
import User from '../../../entities/User';

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: privateResolver(
      async (
        _,
        args: RequesrRideMutationArgs,
        { req }
      ): Promise<RequestRideResponse> => {
        const user: User = req.uesr;
        try {
          const ride = await Ride.create({ ...args, passenger: user });
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
      }
    ),
  },
};

export default resolvers;
