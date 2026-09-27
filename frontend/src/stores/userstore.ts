import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface UserInfo {
  id: string;
  name: string;
  roles: string[];
}

export const useUserStore = defineStore("user", () => {
  const token = ref<string>("");
  const userInfo = ref<UserInfo | null>(null);
  const permissions = ref<string[]>([]);

  // 檢查是否擁有特定角色
  const hasRole = computed(() => {
    return (requiredRoles: string | string[]) => {
      if (!userInfo.value || !userInfo.value.roles) return false;
      const rolesToCheck = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];
      if (rolesToCheck.length === 0) return true;
      return userInfo.value.roles.some((role) => rolesToCheck.includes(role));
    };
  });

  // 檢查是否擁有特定權限 (OR 邏輯)
  const hasAnyPermission = computed(() => {
    return (requiredPermissions: string | string[]) => {
      const permsToCheck = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];
      if (permsToCheck.length === 0) return true;
      return permissions.value.some((p) => permsToCheck.includes(p));
    };
  });

  // 檢查是否擁有所有特定權限 (AND 邏輯)
  const hasAllPermissions = computed(() => {
    return (requiredPermissions: string | string[]) => {
      const permsToCheck = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];
      if (permsToCheck.length === 0) return true;
      return permsToCheck.every((p) => permissions.value.includes(p));
    };
  });

  // 預設的權限檢查 (為了兼容舊版，通常使用 OR 邏輯)
  const hasPermission = hasAnyPermission;

  // 模擬登入成功，寫入角色與權限
  function login(
    mockToken: string,
    mockUser: UserInfo,
    mockPermissions: string[],
  ) {
    token.value = mockToken;
    userInfo.value = mockUser;
    permissions.value = mockPermissions;
  }

  function logout() {
    token.value = "";
    userInfo.value = null;
    permissions.value = [];
  }

  return {
    token,
    userInfo,
    permissions,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    login,
    logout,
  };
});
