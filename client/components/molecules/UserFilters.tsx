"use client"

import { useState, useEffect } from "react"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Button } from "primereact/button"
import type { UserFilters as UserFiltersType } from "@/types/user"
import { ESTADO_FILTER_OPTIONS, SECTOR_FILTER_OPTIONS } from "@/constants/constants"
import { useDebounce } from "@/hooks/useDebounce"
import styles from "./UserFilters.module.scss"

interface UserFiltersProps {
  filters: UserFiltersType
  onFiltersChange: (filters: UserFiltersType) => void
  onClearFilters: () => void
}

export const UserFilters = ({ filters, onFiltersChange, onClearFilters }: UserFiltersProps) => {
  
  const estadoOptions = ESTADO_FILTER_OPTIONS;
  const sectorOptions = SECTOR_FILTER_OPTIONS;

  
  const [searchInput, setSearchInput] = useState(filters.search)
  const debouncedSearch = useDebounce(searchInput, 500)

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      handleFilterChange('search', debouncedSearch)
    }
  }, [debouncedSearch])

  // Sincronizar estado local cuando filters.search cambia externamente (ej: al limpiar filtros)
  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  const handleFilterChange = (field: keyof UserFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
      page: 1,
    })
  }

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value)
  }

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersRow}>
        
        <div className={styles.searchContainer}>
          <i className={`pi pi-search ${styles.searchIcon}`}></i>
          <InputText
            value={searchInput}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            placeholder="Buscar"
            className={styles.searchInput}
          />
        </div>

        <div className={styles.searchContainer}>
          <i className={`pi pi-search ${styles.searchIcon}`}></i>
          <Dropdown
            value={filters.estado}
            options={estadoOptions}
            onChange={(e) => handleFilterChange('estado', e.value)}
            placeholder="Seleccionar el Estado"
            className={styles.filterDropdown}
          />
        </div>

        <div className={styles.searchContainer}>
          <i className={`pi pi-search ${styles.searchIcon}`}></i>
          <Dropdown
            value={filters.sector}
            options={sectorOptions}
            disabled
            className={styles.filterDropdown}
            placeholder={sectorOptions[0]?.label || "Sector"}
            optionLabel="label"
            optionValue="value"
          />
        </div>
      </div>
        <div className={styles.filterButtons}>
          <Button icon="pi pi-filter-fill" className="p-button-secondary" onClick={onClearFilters}/>
          <Button icon="pi pi-sliders-v" className="p-button-secondary" disabled/>
        </div>
    </div>
  )
}

/*
  NOTA DE OPTIMIZACIÓN:
  
  Los dos useEffect actuales funcionan correctamente pero generan re-renders innecesarios:
  
  1. Cuando el usuario escribe: el segundo useEffect setea searchInput con el mismo valor que ya tiene
  2. Cuando se limpian filtros: el primer useEffect se ejecuta sin hacer nada útil
  
  OPTIMIZACIÓN RECOMENDADA:
  Cambiar el segundo useEffect por:
  
  useEffect(() => {
    if (filters.search !== searchInput) {
      setSearchInput(filters.search)
    }
  }, [filters.search, searchInput])
  
  Esto evita setear el estado cuando el valor es el mismo, reduciendo re-renders innecesarios.
  
  FLUJO ACTUAL:
  Usuario escribe → searchInput cambia → debouncedSearch cambia → handleFilterChange → 
  filters.search cambia → segundo useEffect setea searchInput OTRA VEZ (innecesario)
  
  - Fecha: [30/06/2025]
  - Impacto: Menor, solo optimización de performance
*/
