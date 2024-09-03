const dotenv = require('dotenv');
const { buildCheckFunction } = require('express-validator');
dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

const config = {
  jwt: {
    secretKey: required('JWT_SECRET'),
    expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
  },
  host: {
    port: parseInt(required('HOST_PORT', 8080)),
  },
  db: {
    host: required('DB_HOST'),
    user: required('DB_USER'),
    database: required('DB_DATABASE'),
    password: required('DB_PASSWORD'),
  },
  aws: {
    s3: {
      param: {
        accessKeyId: required('AWS_IAM_USER_ACCESSKEY'), // AWS IAM 사용자 액세스 키
        secretAccessKey: required('AWS_IAM_USER_SECRET_ACCESSKEY'), // AWS IAM 사용자 비밀 액세스 키
        region: 'ap-northeast-2', // S3 버킷이 위치한 리전
      },
      bucket: required('AWS_S3_BUCKET'),
    }
  }
};

module.exports = {
  config
};