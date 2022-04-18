import "dotenv/config";

export const s3Config = {
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
    app: {
        storageDir: "tmp",
    },
};
