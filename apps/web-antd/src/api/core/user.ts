import type { UserInfo } from '@vben/types';

import { baseRequestClient } from '#/api/request';

/**
 * ABP 框架的标准响应格式
 */
interface AbpResponse<T> {
  result: T;
  success: boolean;
  targetUrl: string | null;
  error: any | null;
  unAuthorizedRequest: boolean;
}

/**
 * ABP 框架的登录信息响应
 */
interface AbpLoginInfo {
  application: any;
  user: UserInfo;
  tenant: any | null;
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  try {
    const response = await baseRequestClient.get<any>('/api/services/app/Session/GetCurrentLoginInformations');
    
    // 检查响应是否成功
    if (response.status === 200 && response.data && response.data.result) {
      // 从 ABP 响应格式中提取用户信息
      const result = response.data.result;
      // 伪造一个roles
      result.user = result.user || {};
      result.user.roles = ['admin'];
      // 如果响应中包含租户信息，将租户 ID 添加到用户信息中
      if (result.tenant && result.tenant.id) {
        result.user.tenantId = result.tenant.id;
      }
      else {
        // 如果没有租户信息，默认设置为租户 ID 1
        result.user.tenantId = 1;
      }
      return result.user;
    }
    
    throw new Error('Failed to get user info: ' + (response.error?.message || 'Unknown error'));
  } catch (error) {
    console.error('Error in getUserInfoApi:', error);
    throw error;
  }
}
