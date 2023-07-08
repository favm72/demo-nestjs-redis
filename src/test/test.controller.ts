import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { TestService } from "./test.service"

@Controller("test")
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get("health")
  async health() {
    return this.testService.health()
  }

  @Get("redis/:key")
  async redisGet(@Param("key") key: string) {
    return this.testService.get(key)
  }

  @Post("redis/:key")
  async redisSet(@Param("key") key: string, @Body() value: any) {
    return this.testService.set(key, value)
  }
}
