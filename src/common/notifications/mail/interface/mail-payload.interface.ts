export interface EmailRecipient {
    email_address: {
        address: string
        name: string
    }
}

export interface BatchEmailRecipient {
    email_address: {
        address: string
        name: string
    }
    merge_info: MergeInfo
}

export interface EmailSender {
    address: string
    name: string
}

export interface MergeInfo {
    [key: string]: string // Allows dynamic keys with string values
}

export interface SingleEmailPayload {
    mail_template_key: string
    // from: EmailSender
    to: EmailRecipient[]
    merge_info: MergeInfo
    subject: string
}

export interface BatchEmailPayload {
    mail_template_key: string
    to: BatchEmailRecipient[]
    subject: string
}
