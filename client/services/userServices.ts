import type { User, UserFormData, UserFilters } from "@/types/user"
import axiosClient from "./axiosClient"

export async function getUsers(filters: UserFilters): Promise<{ users: User[]; total: number }> {
  try {
    if (!filters) {
      throw new Error("Filters are required")
    }

    const params = new URLSearchParams({
      _limit: filters.limit.toString(),
      _page: filters.page.toString(),
    })

    if (filters.search) {
      params.append("q", filters.search)
    }

    if (filters.estado) {
      params.append("estado", filters.estado.toUpperCase())
    }
    
    if (filters.sector) {
      params.append("sector", filters.sector.toString())
    }

    const response = await axiosClient.get(`?${params}`)
    const total = Number.parseInt(response.headers["x-total-count"] || "0")
    
    return { 
      users: response.data, 
      total 
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export async function createUser(userData: UserFormData): Promise<User> {
  try {
    const apiEstado = userData.estado === "Activo" ? "ACTIVO" : userData.estado === "Inactivo" ? "INACTIVO" : userData.estado
    
    const response = await axiosClient.post('', {
      ...userData,
      estado: apiEstado,
    })

    return response.data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(id: number, userData: UserFormData): Promise<User> {
  try {
    const apiEstado = userData.estado === "Activo" ? "ACTIVO" : userData.estado === "Inactivo" ? "INACTIVO" : userData.estado
    
    const response = await axiosClient.put(`/${id}`, {
      ...userData,
      estado: apiEstado,
    })

    return response.data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await axiosClient.delete(`/${id}`)
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}
