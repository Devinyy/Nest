import { alovaInstance } from '../utils/request';

// 定义数据类型
export interface TodoItem {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// 示例 API 定义
export const exampleApi = {
  // 获取 Todo 详情
  getTodo: (id: number) => 
    alovaInstance.Get<TodoItem>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      // 可以覆盖全局配置
      timeout: 5000,
      // 转换响应数据（因为 jsonplaceholder 的格式不是标准的 code/data 结构）
      transform: (data: any) => {
        return data as TodoItem;
      }
    }),

  // 获取列表
  getTodoList: () => 
    alovaInstance.Get<TodoItem[]>('https://jsonplaceholder.typicode.com/todos', {
      params: { _limit: 5 },
      transform: (data: any) => data as TodoItem[]
    }),
    
  // 提交数据
  createTodo: (data: Omit<TodoItem, 'id'>) =>
    alovaInstance.Post<TodoItem>('https://jsonplaceholder.typicode.com/todos', data)
};
