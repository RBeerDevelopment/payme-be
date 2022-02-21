import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";

import { optimize, OptimizedError, OptimizedSvg } from "svgo";


export function generateAvatar(username: string): string {
    const svg = createAvatar(style, {
        seed: username
    });


    const optimizedResult: OptimizedSvg | OptimizedError = optimize(svg, { multipass: false });

    if(isOptimizedError(optimizedResult)) return svg;
    return optimizedResult.data;
}


function isOptimizedError(input: OptimizedSvg | OptimizedError): input is OptimizedError {
    return (<OptimizedError>input).error !== undefined;
}