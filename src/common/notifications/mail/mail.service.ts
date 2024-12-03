import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
    BatchEmailPayload,
    SingleEmailPayload
} from 'src/common/notifications/mail/interface/mail-payload.interface'
import { SendMailClient } from 'zeptomail'

@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService) {}

    url = this.configService.get<string>('ZEPTO_MAIL_URL')
    batchUrl = this.url + '/batch'
    token = this.configService.get<string>('ZEPTO_MAIL_TOKEN')
    client = new SendMailClient({ url: this.url, token: this.token })
    clientBatch = new SendMailClient({ url: this.batchUrl, token: this.token })
    from = {
        address: this.configService.get<string>('ZEPTO_MAIL_ADDRESS'),
        name: this.configService.get<string>('ZEPTO_MAIL_NAME')
    }

    sendSingleMail(emailPayload: SingleEmailPayload) {
        this.client
            .sendMail({
                mail_template_key: emailPayload.mail_template_key,
                from: this.from,
                to: emailPayload.to,
                merge_info: emailPayload.merge_info,
                subject: emailPayload.subject
            })
            .catch((error) => console.log(error, 'error'))
    }

    sendBatchMail(emailPayload: BatchEmailPayload) {
        this.clientBatch
            .sendMail({
                mail_template_key: emailPayload.mail_template_key,
                from: this.from,
                to: emailPayload.to,
                subject: emailPayload.subject
            })
            .then((resp) => console.log('success'))
            .catch((error) => console.log('error', error))
    }
}
