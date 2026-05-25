import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  text!: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;
}
