interface Template {
    ReplacementKeys: ReplacementKeys[]
    Message: TemplateMessage
}

interface TemplateMessage {
    Subject: {
        Data: string
    },
    Body: {
        Html: {
            Data: string
        },
        Text: {
            Data: string
        }
    }
}

export enum ReplacementType {
    SUBJECT,
    BODY
}

type ReplacementValues = ReplacementValue[];

interface ReplacementValue {
    key: string
    type: ReplacementType
    value: string
}



export function useTemplate(template: Template, replacementValues?: ReplacementValues): TemplateMessage {
    replacementValues?.forEach(r => {
        if(r.type === ReplacementType.SUBJECT) {
            template.Message.Subject.Data = template.Message.Subject.Data.replace(r.key, r.value);
            return;
        }
        template.Message.Body.Html.Data = template.Message.Body.Html.Data.replace(r.key, r.value);
        template.Message.Body.Text.Data = template.Message.Body.Text.Data.replace(r.key, r.value);
    });

    return template.Message;
}

export enum ReplacementKeys {
    Username = "USERNAME", 
    Email_Verification_Link = "EMAIL_VERIFICATION_LINK"
}

export const SignupTemplate: Template = {
    ReplacementKeys: [ReplacementKeys.Username, ReplacementKeys.Email_Verification_Link],
    Message: {
        Subject: {
            Data: "Thanks for signing up!"
        },
        Body: {
            Html: {
                Data: `
                    Hi ${ReplacementKeys.Username},
                    <br/><br/>
                    we're excited that you recently signed up for PayMe!
                    Let's complete this process by verifying your email address.
                    <br/><br/>
                    Please click <a href="${ReplacementKeys.Email_Verification_Link}">here</a> finished account setup.
                    <br/><br/><br/>
                    Your PayMe Team 
                `   
            },
            Text: {
                Data: `
                    Hi USERNAME,
                    
                    we're excited that you recently signed up for PayMe!
                    Let's complete this process by verifying your email address.
                    
                    Please click here finished account setup.
                    
                    Your PayMe Team
                `
            }

        },
    }
};