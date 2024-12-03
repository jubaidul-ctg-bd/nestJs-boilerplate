import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, it } from 'node:test'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
    let appController: AppController

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService]
        }).compile()

        appController = app.get<AppController>(AppController)
    })

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!')
        })
    })
})
function expect(arg0: string) {
    throw new Error('Function not implemented.')
}
