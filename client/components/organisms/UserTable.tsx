"use client"

import { Paginator } from "primereact/paginator"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import type { User } from "@/types/user"
import { SECTOR_LABELS } from "@/types/user"
import { capitalizeWords } from "@/utils/capitalizeWords"
import { useState } from "react"
import styles from "./UserTable.module.scss"

interface UserTableProps {
  users: User[]
  loading: boolean
  totalRecords: number
  currentPage: number
  rowsPerPage: number
  onPaginationChange: (pagination: { page: number; limit: number }) => void
  onEdit: (user: User) => void
}

export const UserTable = ({
  users,
  loading,
  totalRecords,
  currentPage,
  rowsPerPage,
  onPaginationChange,
  onEdit,
}: UserTableProps) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<1 | -1>(1);

  const onPageChangeHandler = (event: { first: number, rows: number, page: number }) => {
    onPaginationChange({ page: event.page + 1, limit: event.rows })
  }

  //Función para manejar el ordenamiento de columnas
  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortOrder === 1) {
        setSortOrder(-1);
      } else if (sortOrder === -1) {
        setSortField(null);
        setSortOrder(1);
      }
    } else {
      setSortField(field);
      setSortOrder(1);
    }
  };

  // Ordenar tabla localmente
  const sortedUsers = sortField
    ? [...users].sort((a, b) => {
        let aValue = a[sortField as keyof User];
        let bValue = b[sortField as keyof User];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder * aValue.localeCompare(bValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder * (aValue - bValue);
        }
        return 0;
      })
    : users;

  // Componente local para header sortable
  const SortableHeader = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <span className="sortable-header">
      {label}
      <span className="sortable-header-icon" onClick={onClick}>
        <i className="pi pi-sort-alt" />
      </span>
    </span>
  );

  return (
    <div className={styles.customTableContainer}>
      <div className={styles.customTable}>
        <DataTable
          value={sortedUsers}
          loading={loading}
          paginator={false}
          emptyMessage={
            loading ? (
              <span className={styles.loadingContainer}>
                <i className={`pi pi-spinner pi-spin ${styles.loadingSpinner}`}></i> Cargando usuarios...
              </span>
            ) : (
              <span className={styles.emptyMessage}>No se encontraron usuarios</span>
            )
          }
          className="p-datatable-lg"
        >
          <Column
            field="id"
            header={<SortableHeader label="Id" onClick={() => handleSort('id')} />}
          />
          <Column
            field="usuario"
            header={<SortableHeader label="Usuario" onClick={() => handleSort('usuario')} />}
            body={(user) => {
              return <button onClick={() => onEdit(user)} className={styles.userName}>{capitalizeWords(user.usuario)}</button>
            }}
          />
          <Column
            field="estado"
            header={<SortableHeader label="Estado" onClick={() => handleSort('estado')} />}
            body={(user) => {
              const estado = user.estado.charAt(0).toUpperCase() + user.estado.slice(1).toLowerCase();
              return <span>{estado}</span>;
            }}
          />
          <Column
            field="sector"
            header={<SortableHeader label="Sector" onClick={() => handleSort('sector')} />}
            body={(user) => SECTOR_LABELS[user.sector] || user.sector}
          />
        </DataTable>
      </div>

      {/* Paginador */}
      {totalRecords > 0 && (
        <div className="pagination-container">
          <Paginator
            first={(currentPage - 1) * rowsPerPage}
            rows={rowsPerPage}
            totalRecords={totalRecords}
            rowsPerPageOptions={[10, 20, 50]}
            onPageChange={onPageChangeHandler}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            className="custom-paginator"
          />
        </div>
      )}
    </div>
  )
}
