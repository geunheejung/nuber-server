import _isEmpry from 'lodash/isEmpty';

/*
resolver를 resolver middleware를 이용해서 context에
의해 보호할 것인지

기존에는 resolver를 그냥 호출하였다면
이제는 middleware를 통하여 resolver를 호출

이 middleware를 resolver로 부른다
모든 resolver가 하나의 argument가 된다.
*/
// resolver function이 실행되기전에 커링으로 먼저 context로 부터 user기 왔는지 검증
const privateResolver = resolverFunction => async (
  parent,
  args,
  context,
  info
) => {
  if (!context.req.user) {
    throw new Error('No JWT. I refuse to proceed');
  }
  const resolved = await resolverFunction(parent, args, context, info);
  return resolved;
};
export default privateResolver;
