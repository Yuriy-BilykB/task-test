import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly db: DatabaseService) {}

  async findAll() {
    return await this.db.category.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
