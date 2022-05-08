import { SESClient, SendEmailRequest, SendEmailCommand } from "@aws-sdk/client-ses";
import { awsConfig } from "../config";
import { SignupTemplate, useTemplate, ReplacementKeys, ReplacementType } from "./templates";

export class SESender {

    private client: SESClient;

    constructor() {
        this.client = new SESClient({ region: awsConfig.ses.region });
    }

    async sendMail(receiverMail: string, username: string, verificationLink: string): Promise<boolean> {

        const params: SendEmailRequest = {

            Source: "payme@mail.robin.beer",
            Destination: {
                ToAddresses: [
                    receiverMail
                ]
            },
            Message: useTemplate(SignupTemplate, [{
                key: ReplacementKeys.Username,
                type: ReplacementType.BODY,
                value: username
            }, {
                key: ReplacementKeys.Email_Verification_Link,
                type: ReplacementType.BODY,
                value: verificationLink
            }]
            )
        };


        try {
            await this.client.send(new SendEmailCommand(params));
            return true;
        }
        catch(err) {
            console.error(err);
            return false;
        }
    }
}



