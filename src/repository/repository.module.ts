import { Global, Module } from '@nestjs/common'
import { MongodbModule } from 'src/repository/mongodb/mongodb.module'

@Global()
@Module({
    imports: [MongodbModule],
    exports: [MongodbModule]
})
export class RepositoryModule {}
