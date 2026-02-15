import {
  type Prisma,
  prisma,
  type TaskPriority,
  type TaskStatus,
} from "../client";
import { TaskNotFoundError } from "../errors";

type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  identityId: string;
};

type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
};

type ListTasksInput = {
  page: number;
  limit: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  identityId: string;
};

const TASK_PUBLIC_SELECT = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  identityId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TaskSelect;

const buildTaskWhere = (
  input: Pick<ListTasksInput, "search" | "status" | "priority" | "identityId">,
): Prisma.TaskWhereInput => ({
  identityId: input.identityId,
  deletedAt: { isSet: false },
  ...(input.status && { status: input.status }),
  ...(input.priority && { priority: input.priority }),
  ...(input.search && {
    OR: [
      { title: { contains: input.search, mode: "insensitive" } },
      { description: { contains: input.search, mode: "insensitive" } },
    ],
  }),
});

const listTasks = async (input: ListTasksInput) => {
  const where = buildTaskWhere(input);

  return await prisma.task.findMany({
    where,
    select: TASK_PUBLIC_SELECT,
    skip: (input.page - 1) * input.limit,
    take: input.limit,
    orderBy: { createdAt: "desc" },
  });
};

const countTasks = async (
  input: Pick<ListTasksInput, "search" | "status" | "priority" | "identityId">,
) => {
  return await prisma.task.count({
    where: buildTaskWhere(input),
  });
};

const createTask = async (input: CreateTaskInput) => {
  return await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      identityId: input.identityId,
    },
    select: TASK_PUBLIC_SELECT,
  });
};

const findTaskById = async (id: string, identityId: string) => {
  return await prisma.task.findFirst({
    where: { id, identityId, deletedAt: { isSet: false } },
    select: TASK_PUBLIC_SELECT,
  });
};

const findTaskByIdOrThrow = async (id: string, identityId: string) => {
  const task = await findTaskById(id, identityId);
  if (!task) throw new TaskNotFoundError();
  return task;
};

const updateTask = async (
  id: string,
  identityId: string,
  input: UpdateTaskInput,
) => {
  const existing = await findTaskById(id, identityId);
  if (!existing) throw new TaskNotFoundError();

  return await prisma.task.update({
    where: { id },
    data: input,
    select: TASK_PUBLIC_SELECT,
  });
};

const softDeleteTask = async (id: string, identityId: string) => {
  const existing = await findTaskById(id, identityId);
  if (!existing) throw new TaskNotFoundError();

  return await prisma.task.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export {
  TASK_PUBLIC_SELECT,
  type CreateTaskInput,
  type UpdateTaskInput,
  type ListTasksInput,
  createTask,
  findTaskById,
  findTaskByIdOrThrow,
  listTasks,
  countTasks,
  updateTask,
  softDeleteTask,
};
