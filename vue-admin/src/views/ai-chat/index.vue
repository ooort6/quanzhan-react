<template>
  <div class="ai-chat-container">
    <el-card class="chat-card">
      <template #header>
        <div class="card-header">
          <h3>AI 助手</h3>
          <el-button type="primary" :icon="Delete" @click="clearChat"
            >清空对话</el-button
          >
        </div>
      </template>

      <div class="chat-content" ref="chatContentRef">
        <div
          v-for="(msg, index) in chatMessages"
          :key="index"
          :class="[
            'message-item',
            msg.role === 'user' ? 'user-message' : 'ai-message',
          ]"
        >
          <div class="avatar">
            <el-avatar
              :icon="msg.role === 'user' ? User : Monitor"
              :size="40"
              :style="{
                backgroundColor: msg.role === 'user' ? '#667eea' : '#10b981',
              }"
            />
          </div>
          <div class="message-content">
            <div class="message-text">{{ msg.content }}</div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="请输入您的问题..."
          @keyup.enter.native="handleSend"
        />
        <el-button
          type="primary"
          :icon="Position"
          class="send-button"
          :loading="loading"
          @click="handleSend"
        >
          发送
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { Delete, Position, User, Monitor } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  time: string;
}

const inputMessage = ref("");
const loading = ref(false);
const chatContentRef = ref<HTMLElement | null>(null);
const chatMessages = ref<ChatMessage[]>([
  {
    role: "ai",
    content: "你好！我是 AI 助手，有什么我可以帮你的吗？",
    time: new Date().toLocaleTimeString(),
  },
]);

// 发送消息
const handleSend = async () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning("请输入消息内容");
    return;
  }

  // 添加用户消息
  chatMessages.value.push({
    role: "user",
    content: inputMessage.value,
    time: new Date().toLocaleTimeString(),
  });

  loading.value = true;

  try {
    // 模拟 AI 响应
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 添加 AI 回复
    chatMessages.value.push({
      role: "ai",
      content: `收到你的消息：${inputMessage.value}。这是一个示例回复，实际项目中这里应该调用 AI 接口。`,
      time: new Date().toLocaleTimeString(),
    });

    inputMessage.value = "";

    // 滚动到底部
    await nextTick();
    scrollToBottom();
  } finally {
    loading.value = false;
  }
};

// 清空对话
const clearChat = () => {
  chatMessages.value = [
    {
      role: "ai",
      content: "对话已清空，有什么我可以帮你的吗？",
      time: new Date().toLocaleTimeString(),
    },
  ];
};

// 滚动到底部
const scrollToBottom = () => {
  if (chatContentRef.value) {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.ai-chat-container {
  padding: 20px;
  height: 100%;
}

.chat-card {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.chat-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f8fafc;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  gap: 12px;
}

.message-content {
  max-width: 80%;
}

.message-text {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.user-message {
  flex-direction: row-reverse;
}

.user-message .message-text {
  background-color: #667eea;
  color: white;
}

.ai-message .message-text {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chat-input {
  padding: 20px;
  background-color: white;
  border-top: 1px solid #eee;
}

.send-button {
  width: 100%;
  margin-top: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.send-button:hover {
  opacity: 0.9;
}

:deep(.el-textarea__inner) {
  resize: none;
  border-radius: 8px;
}

:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}
</style>
