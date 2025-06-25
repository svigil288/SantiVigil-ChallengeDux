import { SECTOR_FILTER_OPTIONS } from "@/constants/constants"
import type { User, UserFormData } from "@/types/user"

export function parseUserToFormData(user: User): UserFormData {
  // Parsear estado a 'Activo'/'Inactivo'
  let estado = "";
  if (user.estado) {
    if (user.estado.toUpperCase() === "ACTIVO") estado = "Activo";
    else if (user.estado.toUpperCase() === "INACTIVO") estado = "Inactivo";
    else estado = user.estado;
  }
  
  return {
    id: user.id?.toString() ?? "",
    usuario: user.usuario ?? "",
    estado,
    sector: user.sector ?? SECTOR_FILTER_OPTIONS[0].value // Asignar sector por defecto si no está definido
  };
}