import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}

  @Get()
  findAll(@Query() query: QueryTodoDto) {
    return this.todos.findAll(query);
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todos.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todos.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todos.remove(id);
  }
}
