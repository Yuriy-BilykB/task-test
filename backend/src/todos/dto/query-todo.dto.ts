import { IsOptional, IsString } from 'class-validator';

export class QueryTodoDto {
  @IsOptional()
  @IsString()
  category?: string;
}
