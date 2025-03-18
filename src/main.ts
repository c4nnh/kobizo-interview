import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvironmentVariables } from "./common/types/env.type";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix("api", {
    exclude: ["swagger"],
  });

  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  const port = configService.get<number>("PORT", { infer: true });

  await app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
    console.log(`Visit http://localhost:${port}/swagger to see Open API`);
  });
}

bootstrap().catch((error) => console.log(error));
