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
    sector: SECTOR_FILTER_OPTIONS[0].value, // Sector por defecto 2222
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
