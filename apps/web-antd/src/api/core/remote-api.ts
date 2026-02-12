import { RequestClient, type RequestClientOptions } from '@vben/request';
import { useAppConfig } from '@vben/hooks';

// 从环境变量中获取远程接口基础地址
const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
// 在开发环境中使用代理路径，避免跨域问题
const REMOTE_API_BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_REMOTE_API_URL || apiURL);

/**
 * 创建远程请求客户端
 */
function createRemoteRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  // 可以在这里添加请求拦截器和响应拦截器
  // 例如添加认证token、错误处理等

  return client;
}

// 远程请求客户端
export const remoteRequestClient = createRemoteRequestClient(REMOTE_API_BASE_URL, {
  responseReturn: 'data',
});

// 基础远程请求客户端（不处理响应数据格式）
export const baseRemoteRequestClient = new RequestClient({ 
  baseURL: REMOTE_API_BASE_URL 
});

/**
 * 远程API命名空间
 */
export namespace RemoteApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    userNameOrEmailAddress?: string;
    rememberClient?: boolean;
    tenantId?: number;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    data: any;
    // accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 远程登录接口
 */
export async function login(data: RemoteApi.LoginParams) {
  return remoteRequestClient.post<RemoteApi.LoginResult>('/api/TokenAuth/Authenticate', data);
}

/**
 * 远程刷新accessToken
 */
export async function remoteRefreshTokenApi() {
  return baseRemoteRequestClient.post<RemoteApi.RefreshTokenResult>('/api/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 远程退出登录
 */
export async function remoteLogoutApi() {
  return baseRemoteRequestClient.post('/api/services/app/Account/Logout', {
    withCredentials: true,
  });
}

/**
 * 远程获取用户权限码
 */
export async function remoteGetAccessCodesApi() {
  // return remoteRequestClient.get<string[]>('/api/auth/codes');
  return remoteRequestClient.get<string[]>('/api/services/app/Session/GetCurrentLoginInformations');
}
