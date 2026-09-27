import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MenuModule } from './modules/menu/menu.module';
import { DynamicFormModule } from './modules/dynamic-form/dynamic-form.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { CryptoModule } from './shared/crypto/crypto.module';
import { PayloadCryptoModule } from './shared/payload-crypto/payload-crypto.module';
import { PayloadDecryptMiddleware } from './shared/payload-crypto/middlewares/payload-decrypt.middleware';
import { GatewayModule } from './modules/gateway/gateway.module';
import { BudgetModule } from './modules/budget/budget.module';
import { ProjectSchedulerModule } from './modules/project-scheduler/project-scheduler.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CryptoModule,
    PayloadCryptoModule,
    UserModule,
    AuthModule,
    MenuModule,
    DynamicFormModule,
    GatewayModule,
    BudgetModule,
    ProjectSchedulerModule,
  ],
  providers: [
    /** 全域 Exception Filter — 統一錯誤回應為 IApiErrorResponse 格式 */
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    /** 全域 Response Interceptor — 統一成功回應為 IApiResponse<T> 格式 */
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PayloadDecryptMiddleware).forRoutes('*');
  }
}

