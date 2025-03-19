import { IsMongoId } from 'class-validator';

export class CreateMatchDto {
  @IsMongoId()
  expertId: string;

  @IsMongoId()
  clientId: string;
}