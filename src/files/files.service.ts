import {
    DeleteObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    ObjectCannedACL,
    PutObjectCommand,
    S3
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

interface fileReturn {
    mimetype: string
    key: string
    url: string
}

interface filesReturn {
    mimetype: string[]
    key: string[]
    url: string[]
}
@Injectable()
export class FilesService {
    constructor(private readonly configService: ConfigService) {}

    s3Client = new S3({
        region: this.configService.get('AWS_REGION'),
        credentials: {
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')
        }
    })

    async uploadPublicFile(file: any, folder?: string, extededPath?: string) {
        try {
            const filename =
                folder +
                '/' +
                (extededPath
                    ? extededPath
                          .toLowerCase()
                          .replace(/ /g, '-')
                          .replace(/[^\w-]+/g, '') + '-'
                    : '') +
                Date.now() +
                '.' +
                file.originalname.split('.').pop()

            const bucketParams = {
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: '3ZeroClub/' + filename,
                Body: file.buffer,
                ContentEncoding: 'base64',
                ContentType: file.mimetype,
                ACL: 'public-read' as ObjectCannedACL
            }
            await this.s3Client.send(new PutObjectCommand(bucketParams))
            return {
                mimetype: file.mimetype,
                key: bucketParams.Key,
                url:
                    this.configService.get('AWS_BUCKET_URL') +
                    '/' +
                    bucketParams.Key
            }
        } catch (err) {
            console.log('image upload error', err)
        }
    }

    async uploadPublicFiles(
        files: Express.Multer.File[],
        folder?: string,
        extededPath?: string
    ): Promise<filesReturn> {
        const uploadedFiles: filesReturn = {
            mimetype: [],
            key: [],
            url: []
        }
        for (const file of files) {
            const filename =
                folder +
                '/' +
                (extededPath
                    ? extededPath
                          .toLowerCase()
                          .replace(/ /g, '-')
                          .replace(/[^\w-]+/g, '') + '-'
                    : '') +
                Date.now() +
                '.' +
                file.originalname.split('.').pop()

            const bucketParams = {
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: '3ZeroClub/' + filename,
                Body: file.buffer,
                ContentEncoding: 'base64',
                ContentType: file.mimetype,
                ACL: 'public-read' as ObjectCannedACL
            }

            try {
                await this.s3Client.send(new PutObjectCommand(bucketParams))
                uploadedFiles.mimetype.push(file.mimetype)
                uploadedFiles.key.push(bucketParams.Key)
                uploadedFiles.url.push(
                    this.configService.get('AWS_BUCKET_URL') +
                        '/' +
                        bucketParams.Key
                )
            } catch (error) {
                console.log(`Error uploading ${file.originalname}`, error)
            }
        }
        return uploadedFiles
    }

    async readPublicFile(path: string) {
        try {
            const bucketParams = {
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: path
            }
            const data = await this.s3Client.send(
                new GetObjectCommand(bucketParams)
            )
            return await data.Body.transformToByteArray()
        } catch (err) {}
    }

    async deletePublicFile(path: string) {
        try {
            const bucketParams = {
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: path
            }

            const data = await this.s3Client.send(
                new DeleteObjectCommand(bucketParams)
            )
            return data
        } catch (err) {}
    }

    async deletePublicFiles(paths: string[]) {
        try {
            const objects = paths.map((path) => ({ Key: path }))
            const deleteParams = {
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Delete: {
                    Objects: objects,
                    Quiet: false
                }
            }
            const response = await this.s3Client.send(
                new DeleteObjectsCommand(deleteParams)
            )

            return response.Deleted
        } catch (err) {
            console.log('Multiple image delete error', err)
        }
    }
}
