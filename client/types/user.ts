export interface User {
  id: number
  usuario: string
  estado: string 
  sector: number 
}

export interface UserFormData {
  id: string
  usuario: string
  estado: string
  sector: number
}

export interface UserFilters {
  search: string
  estado: string
  sector: number
  page: number
  limit: number
}

export const SECTOR_LABELS: Record<number, string> = {
  2222: "Comercial",
}
