const resolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: (_, __, { pubSub }) => {
        /*
        context를 통해 념거받은 pubSub Api의 메서드로 'driverUpdate' 라는 채널을 생성함.
        이제 'driverUpdate' 의 이름과 동일하게 pubSub.publish('driverUpdate') 해주면 생성한 채널을 subscription함.
        subscription 되면 모든 event를 전달받는다.
        */
        return pubSub.asyncIterator('driverUpdate');
      },
    },
  },
};

export default resolvers;
