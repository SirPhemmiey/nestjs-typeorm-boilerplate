import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.config.get<DataSourceOptions>('database.type', {
        infer: true,
      }),
      host: this.config.get<string>('database.host', { infer: true }),
      port: this.config.get<number>('database.port', { infer: true }),
      database: this.config.get<string>('database.name', { infer: true }),
      username: this.config.get<string>('database.username', { infer: true }),
      password: this.config.get<string>('database.password', { infer: true }),
      // entities: ['dist/**/*.entity.{ts,js}'],
      // migrations: ['dist/migrations/*.{ts,js}'],
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: this.config.get('database.synchronize', {
        infer: true,
      }),
      dropSchema: false,
      keepConnectionAlive: true,
    };
  }
}
