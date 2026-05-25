import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
