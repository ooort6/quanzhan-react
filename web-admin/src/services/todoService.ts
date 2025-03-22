import axios from "axios";

const API_URL = "http://localhost:8080/api";

// 设置请求拦截器，添加 token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 如果没有token，可以在此处添加默认token用于测试（仅开发环境使用）
      config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYxNjEyMTU0MCwiZXhwIjoxNjE2MTI1MTQwfQ.8hHLOqfzU8bOlKTFLX9EBu5jlH9-PBqtksVYJPmOcAo`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器，处理常见错误
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 处理401、403错误（未授权或禁止访问）
      if (error.response.status === 401 || error.response.status === 403) {
        console.log("权限错误，请重新登录", error.response);
        // 清除本地存储的token
        localStorage.removeItem("token");
        // 可以在这里重定向到登录页
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  userId?: number;
  createTime?: string;
  updateTime?: string;
}

export interface TodoResponse {
  code: number;
  message: string;
  data: Todo;
}

export interface TodoListResponse {
  code: number;
  message: string;
  data: {
    records: Todo[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}

export const todoService = {
  // 获取待办事项列表
  getTodoList: async (current: number = 1, size: number = 10) => {
    const response = await axios.get<TodoListResponse>(`${API_URL}/todos`, {
      params: { current, size },
    });
    return response.data;
  },

  // 创建待办事项
  createTodo: async (todo: Omit<Todo, "id">) => {
    const response = await axios.post<TodoResponse>(`${API_URL}/todos`, todo);
    return response.data;
  },

  // 更新待办事项
  updateTodo: async (id: number, todo: Partial<Todo>) => {
    const response = await axios.put<TodoResponse>(
      `${API_URL}/todos/${id}`,
      todo
    );
    return response.data;
  },

  // 删除待办事项
  deleteTodo: async (id: number) => {
    const response = await axios.delete<TodoResponse>(`${API_URL}/todos/${id}`);
    return response.data;
  },
};
