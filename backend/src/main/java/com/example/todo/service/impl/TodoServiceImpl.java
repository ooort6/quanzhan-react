package com.example.todo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.todo.entity.Todo;
import com.example.todo.entity.User;
import com.example.todo.mapper.TodoMapper;
import com.example.todo.service.TodoService;
import com.example.todo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl extends ServiceImpl<TodoMapper, Todo> implements TodoService {

    private final UserService userService;

    @Override
    public Todo createTodo(Todo todo, String username) {
        // 获取当前用户
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 设置用户ID
        todo.setUserId(user.getId());
        // 设置默认值
        todo.setCompleted(false);

        // 保存待办事项
        this.save(todo);
        return todo;
    }

    @Override
    public Page<Todo> getTodoList(Integer current, Integer size, String keyword, String username) {
        // 获取当前用户
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 创建分页对象
        Page<Todo> page = new Page<>(current, size);

        // 创建查询条件
        LambdaQueryWrapper<Todo> queryWrapper = new LambdaQueryWrapper<Todo>()
                .eq(Todo::getUserId, user.getId())
                .and(StringUtils.hasText(keyword), wrapper -> wrapper
                        .like(Todo::getTitle, keyword)
                        .or()
                        .like(Todo::getDescription, keyword))
                .orderByDesc(Todo::getCreateTime);

        // 执行分页查询
        return this.page(page, queryWrapper);
    }

    @Override
    public boolean deleteTodo(Long id, String username) {
        // 获取当前用户
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 查询待办事项是否存在
        Todo todo = this.getById(id);
        if (todo == null) {
            throw new RuntimeException("待办事项不存在");
        }

        // 检查待办事项是否属于当前用户
        if (!todo.getUserId().equals(user.getId())) {
            throw new RuntimeException("无权限删除此待办事项");
        }

        // 删除待办事项
        return this.removeById(id);
    }

    @Override
    public Todo updateTodo(Todo todo, String username) {
        // 获取当前用户
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 查询待办事项是否存在
        Todo existingTodo = this.getById(todo.getId());
        if (existingTodo == null) {
            throw new RuntimeException("待办事项不存在");
        }

        // 检查待办事项是否属于当前用户
        if (!existingTodo.getUserId().equals(user.getId())) {
            throw new RuntimeException("无权限修改此待办事项");
        }

        // 保留原有的用户ID和创建时间
        todo.setUserId(existingTodo.getUserId());
        todo.setCreateTime(existingTodo.getCreateTime());

        // 更新待办事项
        this.updateById(todo);
        return todo;
    }
}