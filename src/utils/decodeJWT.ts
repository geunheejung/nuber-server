import jwt from 'jsonwebtoken';
import User from '../entities/User';

/** TODO
 * 1. token 을 연다.
 * 2. token에 담긴 id를 찾는다.
 * 3. 해당 id를 가진 user를 가져온다.
 * 4. (3)에서 찾는 user를 middleware에게 다시 전해준다.
 */
const decodeJWT = async (token: string): Promise<User | undefined> => {
  try {
    // ...decode
    const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || '');
    const { id } = decoded;
    const user = await User.findOne({ id });

    return user;
  } catch (error) {
    return undefined;
  }
};
export default decodeJWT;
