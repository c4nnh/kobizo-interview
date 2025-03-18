import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { MiddlewaresModule } from "./middlewares/middlewares.module";
import { TasksModule } from "./tasks/tasks.module";
import { ThirdPartiesModule } from "./third-parties/third-parties.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThirdPartiesModule.forRoot({ isGlobal: true }),
    MiddlewaresModule,
    AuthModule,
    UsersModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
