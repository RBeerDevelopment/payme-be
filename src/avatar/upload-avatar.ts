import { File } from "../aws/s3/models";
import { AwsFileUploader } from "../aws/s3/s3-upload";

function str2ab(svg: string): ArrayBuffer {
    const buf = new ArrayBuffer(svg.length*2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i=0, strLen=svg.length; i < strLen; i++) {
        bufView[i] = svg.charCodeAt(i);
    }
    return buf;
}

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
    console.log({ uploadedFile});

    if(!Array.isArray(uploadedFile)) {
        return uploadedFile?.path || "";
    }
    return "";
}