import { withFilter } from 'graphql-yoga';
import User from '../../../entities/User';
import { RIDE_REQUEST } from '../RequestRide/RequestRide.resolvers';

const resolvers = {
  Subscription: {
    NearbyRideSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => pubSub.asyncIterator(RIDE_REQUEST),
        async (payload, _, { context }) => {
          const user: User = context.currentUser;
          const {
            NearbyRideSubscription: { pickUpLat, pickUpLng },
          } = payload;

          const { lastLat: userLastLat, lastLng: userLastLng } = user;
          console.log(
            'NearbyRideSubscription ::',
            payload.NearbyRideSubscription
          );
          console.log('user ::', user);
          return (
            pickUpLat >= userLastLat - 0.05 &&
            pickUpLat <= userLastLat + 0.05 &&
            pickUpLng >= userLastLng - 0.05 &&
            pickUpLng <= userLastLng + 0.05
          );
        }
      ),
    },
  },
};

export default resolvers;
