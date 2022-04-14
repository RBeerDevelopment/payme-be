import { GetObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


import { File, UploadedFile } from "./models";
import { s3Config } from "./s3-config";


export class AwsFileUploader {

    private client: S3Client;
    private clientConfig: S3ClientConfig;
    private readonly bucketName = s3Config.s3.params.Bucket;

    constructor() {
        this.clientConfig = {
            credentials: {
                ...s3Config.s3.credentials
            },
            region: s3Config.s3.region
        };
        this.client = new S3Client(this.clientConfig);
    }

    private generateFileKey(file: File, timestamp: number): string {
        return `${file.name}-${timestamp}.${file.extension}`;
    }

    private async uploadFile(file: File): Promise<string> {
        const timestamp = Date.now();
        const fileKey = this.generateFileKey(file, timestamp);

        try {
            await this.client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: fileKey,
                    Body: file.content,
                    ContentType: file.type
                })
            );
            return fileKey;
        } catch(e) {
            console.error(e);
            return "";
        }

    }
    
    async upload(
        files: File | File[]
    ): Promise<UploadedFile | UploadedFile[] | undefined> {
        try {
            if (Array.isArray(files)) {
                const paths = await Promise.all(
                    files.map(async (file) => this.uploadFile(file))
                );
                return paths.map((path) => ({ path }));
            }
    
            const path = await this.uploadFile(files);

            return {
                path,
            };
        } catch {
            return undefined;
        }
    }

    async createSignedUrl(fileKey: string): Promise<string | undefined> {
        try {
            // const url = await getSignedUrl(this.client, new GetObjectCommand({
            //     Bucket: this.bucketName,
            //     Key: fileKey
            // }), { expiresIn: 10 * 60 });
            return "";//url;
        } catch {
            return;
        }
    }
}
