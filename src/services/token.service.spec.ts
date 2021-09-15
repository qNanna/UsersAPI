import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let provider: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    provider = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
