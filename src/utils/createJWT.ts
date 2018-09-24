import jwt from 'jsonwebtoken';

// userId를 받아서, token 안에 넣은 다음 userId를 암호화한다.
// 매 request마다 user에게 준다.
const createJWT = (id: number): string => {
  const token = jwt.sign(
    {
      id,
    },
    process.env.JWT_TOKEN || ''
  );

  return token;
};

export default createJWT;
