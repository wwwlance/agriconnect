import { Controller, Post, Body } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly service: RequestsService) {}

  @Post()
  create(@Body() dto: any) {
    return this.service.createRequest(dto);
  }
}