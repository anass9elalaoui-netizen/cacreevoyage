import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
});

async function testUpload() {
  try {
    console.log('Testing S3 Upload with:', {
      endpoint: process.env.S3_ENDPOINT,
      bucket: process.env.S3_BUCKET,
      accessKeyLength: process.env.S3_ACCESS_KEY_ID?.length,
    });
    
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: 'test-file.txt',
      Body: 'Hello world',
    });
    
    const response = await client.send(command);
    console.log('Success:', response);
  } catch (error) {
    console.error('S3 Upload Error:', error);
  }
}

testUpload();
