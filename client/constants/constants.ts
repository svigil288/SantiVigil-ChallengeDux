export const ESTADO_FILTER_OPTIONS = [
  { label: "Activo", value: "Activo" },
  { label: "Inactivo", value: "Inactivo" },
];

export const SECTOR_FILTER_OPTIONS = [
  { label: "Comercial", value: 5000 },
];

export const TOAST_MESSAGES = {
  userCreated: {
    severity: "success" as const,
    summary: "Éxito",
    detail: "Usuario creado correctamente",
    life: 3000,
  },
  userUpdated: {
    severity: "success" as const,
    summary: "Éxito",
    detail: "Usuario actualizado correctamente",
    life: 3000,
  },
  userDeleted: {
    severity: "success" as const,
    summary: "Éxito",
    detail: "Usuario eliminado correctamente",
    life: 3000,
  },
  userCreateError: {
    severity: "error" as const,
    summary: "Error",
    detail: "Error al crear usuario",
    life: 3000,
  },
  userUpdateError: {
    severity: "error" as const,
    summary: "Error",
    detail: "Error al actualizar usuario",
    life: 3000,
  },
  userDeleteError: {
    severity: "error" as const,
    summary: "Error",
    detail: "Error al eliminar usuario",
    life: 3000,
  },
  userLoadError: {
    severity: "error" as const,
    summary: "Error",
    detail: "Error al cargar usuarios",
    life: 3000,
  },
};

export const SIDEBAR_MENU_ITEMS = [
  { id: "box1", icon: "pi pi-box" },
  { id: "box2", icon: "pi pi-box" },
  { id: "box3", icon: "pi pi-box" },
  { id: "box4", icon: "pi pi-box" },
  { id: "box5", icon: "pi pi-box" },
  { id: "box6", icon: "pi pi-box" },
  { id: "box7", icon: "pi pi-box" },
  { id: "box8", icon: "pi pi-box" },
];
