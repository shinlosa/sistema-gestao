import { User } from "../types/nami";

interface RoleDisplayConfig {
  label: string;
  badgeClass: string;
  headerTextClass: string;
  dotClass: string;
}

export const ROLE_DISPLAY_CONFIG: Record<User["role"], RoleDisplayConfig> = {
  admin: {
    label: "Administrador",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    headerTextClass: "text-purple-200",
    dotClass: "bg-purple-500",
  },
  editor: {
    label: "Editor",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    headerTextClass: "text-blue-200",
    dotClass: "bg-blue-500",
  },
  usuario: {
    label: "Usuário",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    headerTextClass: "text-emerald-200",
    dotClass: "bg-emerald-500",
  },
  leitor: {
    label: "Leitor",
    badgeClass: "bg-slate-100 text-slate-800 border-slate-300",
    headerTextClass: "text-slate-200",
    dotClass: "bg-slate-500",
  },
};

export const roleLabels: Record<User["role"], string> = {
  admin: ROLE_DISPLAY_CONFIG.admin.label,
  editor: ROLE_DISPLAY_CONFIG.editor.label,
  usuario: ROLE_DISPLAY_CONFIG.usuario.label,
  leitor: ROLE_DISPLAY_CONFIG.leitor.label,
};

export const roleSelectOptions = (
  Object.entries(ROLE_DISPLAY_CONFIG) as Array<[User["role"], RoleDisplayConfig]>
).map(([value, config]) => ({ value, label: config.label }));
