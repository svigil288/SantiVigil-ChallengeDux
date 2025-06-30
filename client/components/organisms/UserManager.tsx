"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "primereact/button"
import { Toast } from "@/components/atoms/Toast"
import { Toast as PrimeToast } from "primereact/toast"
import type { User, UserFormData, UserFilters } from "@/types/user"
import { getUsers, createUser, updateUser, deleteUser } from "@/services/userServices"
import { UserTable } from "./UserTable"
import { UserForm } from "@/components/molecules/UserForm"
import { UserFilters as UserFiltersComponent } from "@/components/molecules/UserFilters"
import { TOAST_MESSAGES,SECTOR_FILTER_OPTIONS } from "@/constants/constants"
import styles from "./UserManager.module.scss"

interface UserManagementProps {
  initialUsers: User[]
  initialTotal: number
}

export const UserManagement = ({ initialUsers, initialTotal }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [totalRecords, setTotalRecords] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    estado: "",
    sector: SECTOR_FILTER_OPTIONS[0].value, // Sector por defecto 5000
    page: 1,
    limit: 10,
  })

  const toast = useRef<PrimeToast>(null)
  const isInitialRender = useRef(true);

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { users: fetchedUsers, total } = await getUsers(filters)
      setUsers(fetchedUsers)
      setTotalRecords(total)
    } catch (error) {
      setUsers([])
      setTotalRecords(0)
      toast.current?.show(TOAST_MESSAGES.userLoadError)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    loadUsers()
  }, [loadUsers])

  const handleCreateUser = () => {
    setSelectedUser(null)
    setShowForm(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData: UserFormData) => {
    setFormLoading(true)
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData)
        toast.current?.show(TOAST_MESSAGES.userUpdated)
      } else {
        await createUser(formData)
        toast.current?.show(TOAST_MESSAGES.userCreated)
      }
      await loadUsers()
    } catch (error) {
      toast.current?.show(selectedUser ? TOAST_MESSAGES.userUpdateError : TOAST_MESSAGES.userCreateError)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id)
      toast.current?.show(TOAST_MESSAGES.userDeleted)
      await loadUsers()
    } catch (error) {
      toast.current?.show(TOAST_MESSAGES.userDeleteError)
    }
  }

  const handlePaginationChange = (pagination: { page: number; limit: number }) => {
    setFilters((prev) => ({ ...prev, ...pagination }))
  }

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      estado: "",
      sector: SECTOR_FILTER_OPTIONS[0].value,
      page: 1,
      limit: 10,
    })
  }

  return (
    <div className={styles.userManagerContainer}>
      <Toast ref={toast} />

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Usuarios</h1>
        <Button label="Nuevo Usuario" icon="pi pi-plus" onClick={handleCreateUser} className={styles.nuevoUsuarioButton}/>
      </div>

      <UserFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      <div className={styles.tableContainer}>
        <UserTable
          users={users}
          loading={loading}
          totalRecords={totalRecords}
          currentPage={filters.page}
          rowsPerPage={filters.limit}
          onPaginationChange={handlePaginationChange}
          onEdit={handleEditUser}
        />
      </div>

      <UserForm
        visible={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        loading={formLoading}
        onDelete={handleDeleteUser}
      />
    </div>
  )
}

/*
  NOTA DE OPTIMIZACIÓN:
  
  1. Hay muchos estasdos individuales que estan relacionados entre si, esto puede generar, entre las actualizaciones de estados 
  en cadena, re-renders innecesarios. React 18 implementa batching automático incluso para operaciones asíncronas, pero en versiones
  anteriores (React 17-) solo batchea en event handlers síncronos, lo que puede causar múltiples re-renders innecesarios.
  
  Para optimizar eso podrian implementarse otros patrones que dan mayor control y no requieren tanto mantenimiento de codigo: 
  * utilizar un useReducer 
  lo que permite manejar el estado de manera mas controlada y evitar re-renders innecesarios.

  type State = {
  users: User[]
  totalRecords: number
  loading: boolean
  formLoading: boolean
  showForm: boolean
  selectedUser: User | null
  filters: UserFilters
}

type Action = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USERS'; payload: { users: User[]; total: number } }
  | { type: 'OPEN_FORM'; payload: User | null }
  | { type: 'CLOSE_FORM' }

Un solo dispatch, un solo re-render

dispatch({ type: 'OPEN_FORM', payload: user })

 *Utilizar un custom hook para gestionar los estados dependiendo las responsabilidades.

  - useUserFilters(): Gestiona lógica de filtros (reutilizable en otras páginas)
  - useUserOperations(): Maneja CRUD operations con loading states unificados
  - useFormModal(): Controla apertura/cierre de modales

  2. Mejora en las dependencias de useEffect, patrón ANTI-PATTERN.
  
  CÓDIGO ACTUAL:
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    loadUsers()
  }, [loadUsers])
  
  *. DEPENDENCIA REDUNDANTE: useEffect depende de [loadUsers], pero loadUsers 
     depende de [filters]. Es como poner una alarma para otra alarma.
     
  *. LÓGICA DE INICIALIZACIÓN CONFUSA: isInitialRender.current puede causar 
     comportamiento inconsistente entre primer y segundo mount del componente.
     
  *. TIMING INESPERADO: Si el componente se desmonta/monta, el comportamiento 
     cambia (primera vez no carga, segunda vez sí carga).
  
  SOLUCIÓN RECOMENDADA:
  useEffect(() => {
    loadUsers()
  }, [filters]) // Dependencia directa, comportamiento predecible
  
  JUSTIFICACIÓN:
  - Más simple y directo
  - Comportamiento consistente en todos los mounts
  - Fácil de entender y debuggear
  - Elimina lógica innecesaria con refs

  
  Si realmente necesitas evitar la carga inicial, usar useState 
  en lugar de useRef para mejor control del estado.

  3. Duplicacion de logica asincrona:
   - Patrón try/catch/finally repetido en múltiples handlers
   - Inconsistencia en loading states (formLoading vs sin loading para delete)
   - Manejo de errores no estandarizado
   
   SOLUCIÓN: Custom hook useAsyncOperation() para unificar operaciones
  
  - Fecha: [30/06/2025]
  - Impacto: Menor, solo optimización de performance
*/