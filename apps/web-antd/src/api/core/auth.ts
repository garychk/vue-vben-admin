import { baseRequestClient, requestClient } from '#/api/request';
import { login as remoteLogin, type RemoteApi } from './remote-api';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
    rememberClient?: boolean;
    tenantId?: number;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  // 转换参数格式以匹配远程登录接口
  const remoteParams: RemoteApi.LoginParams = {
    password: data.password,
    userNameOrEmailAddress: data.username,
    rememberClient: data.rememberClient,
    tenantId: data.tenantId,
  };

  // 调用远程登录接口
  const resp = await remoteLogin(remoteParams);
  // console.log(resp.data);
  // 转换返回值格式以匹配原有接口
  return {
    accessToken: resp.data.result.accessToken,
  };
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/api/services/app/Account/Logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/api/services/app/Session/GetCurrentLoginInformations');
}
