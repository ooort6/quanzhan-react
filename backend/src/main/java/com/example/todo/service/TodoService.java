package com.example.todo.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.todo.entity.Todo;

public interface TodoService extends IService<Todo> {
    Todo createTodo(Todo todo, String username);

    Page<Todo> getTodoList(Integer current, Integer size, String username);

    boolean deleteTodo(Long id, String username);
}