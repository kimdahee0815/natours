const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.uploadToS3 = async (file, filename, mimetype) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Body: file,
    ContentType: mimetype,
    ACL: 'public-read',
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
  } catch (err) {
    console.error('Error uploading to S3:', err);
    throw err;
  }
};
