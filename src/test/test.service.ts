import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { RedisClientType, createClient } from "redis"

@Injectable()
export class TestService {
  logger = new Logger(TestService.name)
  client: RedisClientType<any> | null = null
  constructor(private readonly configService: ConfigService) {}

  async health() {
    return {
      status: "ok",
    }
  }

  async connect() {
    if (this.client !== null) {
      if (!this.client.isOpen) await this.client.connect()
      return
    }

    let retries = 2

    this.client = createClient({
      url: this.configService.get<string>("REDIS_URL"),
    })

    this.client.on("error", error => {
      this.logger.error(error)
      if (retries > 0) {
        this.logger.log(`retries left: ${retries}`)
        retries--
        if (retries === 0) {
          this.logger.error("no retries left")
          this.client?.disconnect()
        }
      }
    })

    this.client.on("connect", () => {
      this.logger.log("connected")
    })

    await this.client.connect()
  }

  async get(key: string) {
    await this.connect()
    if (this.client === null) {
      this.logger.error("client is null")
      return null
    }
    const result = await this.client.get(key)
    if (!result) return null
    return JSON.parse(result)
  }

  async set(key: string, value: any) {
    await this.connect()
    if (this.client === null) {
      this.logger.error("client is null")
      return null
    }
    return await this.client.set(key, JSON.stringify(value))
  }
}
