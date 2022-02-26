import { File } from "../aws/s3/models";
import { AwsFileUploader } from "../aws/s3/s3-upload";

export async function uploadAvatar(username: string, avatarSvg: string): Promise<string> {
    // const avatarBuffer = str2ab(avatarSvg);

    const uploader = new AwsFileUploader();

    const file: File = {
        name: `${username}-avatar`,
        extension: "svg",
        size: avatarSvg.length,
        type: "image/svg+xml",
        content: avatarSvg
    };

    const uploadedFile = await uploader.upload(file);

    if(!Array.isArray(uploadedFile)) {
        return uploadedFile?.path || "";
    }
    return "";
}