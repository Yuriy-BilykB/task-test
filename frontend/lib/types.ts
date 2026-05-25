export type Category = {
  id: string;
  name: string;
};

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  categoryId: string;
  category: Category;
};

export type CreateTodoInput = {
  text: string;
  categoryId: string;
};
