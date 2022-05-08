import "dotenv/config";

export const awsConfig = {
    s3: {
        credentials: {
            accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
            secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
        },
        region: String(process.env.AWS_S3_REGION),
        params: {
            ACL: "public-read",
            Bucket: String(process.env.AWS_S3_BUCKET),
        },
    },
    ses: {
        credentials: {
            accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
            secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
        },
        region: String(process.env.AWS_S3_REGION),
        params: {
            
        }
    },
    app: {
        storageDir: "tmp",
    },
};
