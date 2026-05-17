import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { redisClient } from './redis/redis.client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await redisClient.connect();

  console.log('Notification service started...');

  // 🔥 SUBSCRIBE TO EVENTS
  await redisClient.subscribe('request.created', (message) => {
    const data = JSON.parse(message);

    console.log('📩 New request event received:', data);

    // simulate notification
    data.forEach((req: any) => {
      console.log(
        `🚜 Notify Farmer ${req.farmer.id} → New request from Distributor ${req.distributor.id}`,
      );
    });
  });

  await app.listen(3001);
}
bootstrap();