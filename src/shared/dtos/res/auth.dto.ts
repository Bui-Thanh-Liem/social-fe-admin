import type { ITwoFactorBackup } from "~/shared/interfaces/admin.interface";

export type ResLogin = {
  admin_id: string;
  two_factor_enabled: boolean;
  two_factor_session_enabled: boolean;
};

export type ResActive2Fa = {
  two_factor_enabled: boolean;
  backupSecret: ITwoFactorBackup[];
};

export type ResVerify2Fa = {
  token: string;
  two_factor_session_enabled: boolean;
};
