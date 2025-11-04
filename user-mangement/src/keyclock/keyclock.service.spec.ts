import { Test, TestingModule } from '@nestjs/testing';
import { KeyclockService } from './keyclock.service';

describe('KeyclockService', () => {
  let service: KeyclockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyclockService],
    }).compile();

    service = module.get<KeyclockService>(KeyclockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
