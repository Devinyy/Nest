import { createAlova, type Method } from 'alova';
import adapterFetch from 'alova/fetch';
import { retry } from 'alova/server';

// 定义 API 响应的基础结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 扩展 Method 的配置项，用于控制重试等
interface CustomConfig {
  enableRetry?: boolean; // 是否启用重试
  maxRetries?: number; // 最大重试次数
  hideErrorMsg?: boolean; // 是否隐藏自动错误提示
}

// 环境变量获取 API Base URL
const baseURL = import.meta.env.PUBLIC_API_BASE_URL || '/api';

/**
 * 统一错误处理函数
 */
const handleRequestError = (error: any, hideErrorMsg = false) => {
  let errorMessage = '未知错误';

  if (error.message) {
    if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
      errorMessage = '网络错误！请您稍后重试';
    } else if (error.message.includes('timeout') || error.message.includes('aborted')) {
      errorMessage = '请求超时！请您稍后重试';
    } else {
      errorMessage = error.message;
    }
  } else if (error.status) {
    switch (error.status) {
      case 400: errorMessage = '请求参数错误 (400)'; break;
      case 401: errorMessage = '未授权，请重新登录 (401)'; break;
      case 403: errorMessage = '拒绝访问 (403)'; break;
      case 404: errorMessage = '请求地址出错 (404)'; break;
      case 408: errorMessage = '请求超时 (408)'; break;
      case 500: errorMessage = '服务器内部错误 (500)'; break;
      case 501: errorMessage = '服务未实现 (501)'; break;
      case 502: errorMessage = '网关错误 (502)'; break;
      case 503: errorMessage = '服务不可用 (503)'; break;
      case 504: errorMessage = '网关超时 (504)'; break;
      case 505: errorMessage = 'HTTP版本不受支持 (505)'; break;
      default: errorMessage = `连接出错(${error.status})`;
    }
  }

  // 这里可以接入你的 UI 组件库 Toast
  if (!hideErrorMsg) {
    console.error(`[API Error]: ${errorMessage}`);
    // if (typeof window !== 'undefined') {
    //   // TODO: 使用 Toast.error(errorMessage)
    //   alert(errorMessage); 
    // }
  }

  return new Error(errorMessage);
};

/**
 * alova 实例
 */
export const alovaInstance = createAlova({
  baseURL,
  requestAdapter: adapterFetch(),
  timeout: 10000,

  beforeRequest(method) {
    // 默认 Header
    if (!method.config.headers['Content-Type']) {
      method.config.headers['Content-Type'] = 'application/json';
    }
    // 可以在这里注入 Token 等通用 Header
  },

  responded: {
    onSuccess: async (response, method) => {
      const isJson = response.headers.get('content-type')?.includes('json');
      
      if (isJson) {
        const json = await response.json();
        // 业务状态码处理
        if (json.code !== undefined && json.code !== 200) {
          throw new Error(json.message || '业务请求失败');
        }
        return json.data !== undefined ? json.data : json;
      }
      return response.blob();
    },
    
    onError: (err, method) => {
      // 可以在这里统一处理，也可以在 catch 中处理
      // 抛出错误以便在组件中可以捕获
      throw err;
    }
  }
});

/**
 * 通用请求封装类
 */
class Request {
  // GET 请求
  get<T = any>(url: string, params?: Record<string, any>, config?: any) {
    return this.sendRequest<T>(alovaInstance.Get(url, { params, ...config }), config);
  }

  // POST 请求
  post<T = any>(url: string, data?: any, config?: any) {
    return this.sendRequest<T>(alovaInstance.Post(url, data, config), config);
  }

  // PUT 请求
  put<T = any>(url: string, data?: any, config?: any) {
    return this.sendRequest<T>(alovaInstance.Put(url, data, config), config);
  }

  // DELETE 请求
  delete<T = any>(url: string, data?: any, config?: any) {
    return this.sendRequest<T>(alovaInstance.Delete(url, data, config), config);
  }

  // 下载文件
  download(url: string, fileName?: string) {
    const methodInstance = alovaInstance.Get(url, {
      // 移除 responseType: 'blob'，由 responded.onSuccess 统一处理 blob
      cacheFor: null // 下载通常不需要缓存
    });
    
    return methodInstance.send().then((blob: any) => {
      if (typeof window !== 'undefined') {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    }).catch(err => {
      handleRequestError(err);
    });
  }

  /**
   * 发送请求核心方法（包含重试和错误处理逻辑）
   */
  private async sendRequest<T>(methodInstance: Method, config: CustomConfig = {}) {
    const { enableRetry = false, maxRetries = 3, hideErrorMsg = false } = config;

    try {
      if (enableRetry) {
        // 使用 retry 包装
        const retriableMethod = retry(methodInstance, {
          retry: maxRetries,
          backoff: { delay: 1000, multiplier: 1.5 }
        });
        return await retriableMethod.send() as T;
      } else {
        return await methodInstance.send() as T;
      }
    } catch (error: any) {
      throw handleRequestError(error, hideErrorMsg);
    }
  }
}

export const request = new Request();
