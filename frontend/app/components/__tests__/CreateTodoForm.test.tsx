import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateTodoForm } from "@/app/components/CreateTodoForm";

jest.mock("@/lib/api", () => ({
  createTodo: jest.fn(),
  extractApiError: (_: unknown, fallback: string) => fallback,
}));

jest.mock("react-toastify", () => ({
  toast: Object.assign(jest.fn(), {
    success: jest.fn(),
    error: jest.fn(),
  }),
}));

import { createTodo } from "@/lib/api";

const categories = [
  { id: "cat_work", name: "Work" },
  { id: "cat_home", name: "Home" },
];

describe("CreateTodoForm", () => {
  beforeEach(() => {
    (createTodo as jest.Mock).mockReset();
  });

  it("shows zod validation errors and does not call the API on empty submit", async () => {
    const user = userEvent.setup();
    render(<CreateTodoForm categories={categories} onCreated={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(await screen.findByText(/task text is required/i)).toBeInTheDocument();
    expect(screen.getByText(/pick a category/i)).toBeInTheDocument();
    expect(createTodo).not.toHaveBeenCalled();
  });

  it("submits when valid, calls onCreated, and keeps the chosen category", async () => {
    const created = {
      id: "t1",
      text: "Buy milk",
      completed: false,
      createdAt: new Date().toISOString(),
      categoryId: "cat_home",
      category: { id: "cat_home", name: "Home" },
    };
    (createTodo as jest.Mock).mockResolvedValueOnce(created);
    const onCreated = jest.fn();

    const user = userEvent.setup();
    render(<CreateTodoForm categories={categories} onCreated={onCreated} />);

    await user.type(screen.getByLabelText(/task/i), "Buy milk");
    await user.selectOptions(screen.getByLabelText(/category/i), "cat_home");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(createTodo).toHaveBeenCalledWith({
      text: "Buy milk",
      categoryId: "cat_home",
    });
    expect(onCreated).toHaveBeenCalledWith(created);

    // category should be preserved across submits; text cleared.
    expect(screen.getByLabelText(/task/i)).toHaveValue("");
    expect(screen.getByLabelText(/category/i)).toHaveValue("cat_home");
  });
});
