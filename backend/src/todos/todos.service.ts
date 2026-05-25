import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

const maxTodosPerCategory = 5;

@Injectable()
export class TodosService {
  constructor(private readonly database: DatabaseService) {}

  async findAll({ category }: QueryTodoDto) {
    const AND: Prisma.TodoWhereInput[] = [];

    if (category) {
      AND.push({ categoryId: category });
    }

    return this.database.todo.findMany({
      where: { AND },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create({ categoryId, text }: CreateTodoDto) {
    const category = await this.database.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new BadRequestException('Category does not exist');
    }

    const count = await this.database.todo.count({
      where: { categoryId },
    });
    if (count >= maxTodosPerCategory) {
      throw new BadRequestException(
        `Category "${category.name}" already has ${maxTodosPerCategory} tasks`,
      );
    }

    return this.database.todo.create({
      data: { text, categoryId },
      include: { category: true },
    });
  }

  async update(id: string, dto: UpdateTodoDto) {
    await this.ensureTodoExists(id);
    return this.database.todo.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.ensureTodoExists(id);
    await this.database.todo.delete({ where: { id } });
    return { id };
  }

  private async ensureTodoExists(id: string) {
    const todo = await this.database.todo.findUnique({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
  }
}
