import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TestModule } from "./test/test.module"

@Module({
  imports: [TestModule, ConfigModule.forRoot()],
})
export class AppModule {}
