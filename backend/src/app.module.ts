import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [DatabaseModule, TodosModule, CategoriesModule],
})
export class AppModule {}
