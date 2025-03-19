import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SentryGlobalFilter } from "@sentry/nestjs/setup";
import { AppModule } from "./app.module";
import { EnvironmentVariables } from "./common/types/env.type";
import { SentryService } from "./third-parties/sentry.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sentryService = app.get(SentryService);

  app.enableCors();

  sentryService.init();

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryGlobalFilter(httpAdapter));

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

  const config = new DocumentBuilder()
    .setTitle("Task management API")
    .setDescription("OPEN API for Task management")
    .setVersion("1.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, documentFactory);

  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  const port = configService.get<number>("PORT", { infer: true });

  await app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
    console.log(`Visit http://localhost:${port}/swagger to see Open API`);
  });
}

bootstrap().catch((error) => console.error(error));
