const AWS = require('aws-sdk');
const { URLSearchParams } = require('url');
const path = require('path');
const { config } = require('../config.js');

const s3 = new AWS.S3(config.aws.s3.param);

const s3Upload = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const file = req.file;
  const s3Bucket = config.aws.s3.bucket;

  // S3 업로드 파라미터 설정
  const params = {
    Bucket: s3Bucket,
    Key: `${Date.now()}_${path.basename(file.originalname)}`, // 파일명에 타임스탬프 추가
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // 공개 접근 설정 (선택 사항)
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading to S3:', err);
      return res.status(500).send('Error uploading file');
    }

    // URLSearchParams를 사용하여 업로드된 파일 URL을 생성
    const imageUrl = new URLSearchParams({ url: data.Location });
    req.body.image = imageUrl;
    next();
    });
}

module.exports = {
    s3Upload,
}