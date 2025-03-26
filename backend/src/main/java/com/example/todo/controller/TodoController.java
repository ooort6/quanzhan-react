package com.example.todo.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.todo.entity.Todo;
import com.example.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTodo(@Valid @RequestBody Todo todo,
            Authentication authentication) {
        Todo createdTodo = todoService.createTodo(todo, authentication.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "创建成功");
        response.put("data", createdTodo);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTodoList(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            Authentication authentication) {
        Page<Todo> todoPage = todoService.getTodoList(current, size, keyword, authentication.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "获取成功");
        response.put("data", todoPage);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTodo(@PathVariable Long id, Authentication authentication) {
        boolean result = todoService.deleteTodo(id, authentication.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "删除成功");
        response.put("data", result);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTodo(@PathVariable Long id, @Valid @RequestBody Todo todo,
            Authentication authentication) {
        todo.setId(id);
        Todo updatedTodo = todoService.updateTodo(todo, authentication.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "更新成功");
        response.put("data", updatedTodo);

        return ResponseEntity.ok(response);
    }
}