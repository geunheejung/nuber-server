const resolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: (_, __, { pubSub }) => {
        return pubSub.asyncIterator('driverUpdate');
      },
    },
  },
};
export default resolvers;

/* TODO
describe도 할 수 있고
해당 subscription으로 어떤 것이 도착할 때마다 받을 수 있다.
매번 서버의 변화가 있을때마다 subscription할 경우 그 업데이트 내역을 보여준다.

*/
