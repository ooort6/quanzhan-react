import request from "@/utils/request";

// 获取待办事项列表
export function getTodoList(params: { current: number; size: number }) {
  return request({
    url: "/todos",
    method: "get",
    params,
  });
}

// 创建待办事项
export function createTodo(data: { title: string; description?: string }) {
  return request({
    url: "/todos",
    method: "post",
    data,
  });
}

// 删除待办事项
export function deleteTodo(id: number) {
  return request({
    url: `/todos/${id}`,
    method: "delete",
  });
}
