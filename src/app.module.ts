import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FieldsModule } from './fields/fields.module';
import { ClubModule } from './club/club.module';

@Module({
  imports: [
    // 1. Esto lee tu archivo .env automáticamente
    ConfigModule.forRoot(), 
    
    // 2. Esto configura la conexión a PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10), // Con fallback de seguridad
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      //dropSchema: true,
    }),
    UserModule,
    AuthModule,
    FieldsModule,
    ClubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}