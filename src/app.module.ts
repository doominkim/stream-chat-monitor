import { Module } from '@nestjs/common';
import { BatchModule } from './batch/batch.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import envFilePath from 'envs/env';
import { ChannelModule } from './channel/channel.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChzzkModule } from './chzzk/chzzk.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { StreamModule } from './stream/stream.module';
import { MinioModule } from './minio/minio.module';
import { LoggerModule } from './logger/logger.module';
import { DatabasePartitionInitializer } from './common/bootstrap/partition-initializer';
import { MediaAiHubModule } from './media-ai-hub/media-ai-hub.module';
import { QueueModule } from './queue/queue.module';
import { BullBoardAppModule } from './queue/bull-board.module';
import { HealthModule } from './health/health.module';

const envValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid('dev', 'staging', 'prod', 'test'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  // JWT_SECRET: Joi.string().required(),
});

const conifgModule = [
  // ServeStaticModule.forRoot({
  //   rootPath: join(__dirname, '..', 'public'),
  // }),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath,
    validationSchema: envValidationSchema,
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA_NAME,
    synchronize: true,
    logging: process.env.DB_LOGGING === 'true' ? true : false,
    autoLoadEntities: true,
    // logger: new CustomDbLogger(),
    ssl: process.env.DB_SSL === 'true' ? true : false,
    // extra: {
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // },
  }),
  ScheduleModule.forRoot(),
];
const serviceModule = [
  BatchModule,
  ChannelModule,
  ChzzkModule,
  AuthModule,
  AccountModule,
  StreamModule,
  MinioModule,
  LoggerModule,
  MediaAiHubModule,
  QueueModule,
  BullBoardAppModule,
  HealthModule,
];
@Module({
  imports: [...conifgModule, ...serviceModule],
  providers: [DatabasePartitionInitializer],
})
export class AppModule {}
