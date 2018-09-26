import { withFilter } from 'graphql-yoga';
import User from '../../../entities/User';

export const RIDE_UPDATE_PUPSUB_KEY: string = 'rideUpdate';

const resolvers = {
  Subscription: {
    RideStatusSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => pubSub.asyncIterator(RIDE_UPDATE_PUPSUB_KEY),
        (payload, _, { context }) => {
          const user: User = context.currentUser;
          const {
            RideStatusSubscription: { driverId, passengerId },
          } = payload;
          return user.id === driverId || user.id === passengerId;
        }
      ),
    },
  },
};

export default resolvers;
