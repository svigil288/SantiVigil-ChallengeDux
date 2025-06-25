"use client"

import type React from "react"
import { useEffect } from "react"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Message } from "primereact/message"
import type { User, UserFormData } from "@/types/user"
import { useForm, Controller } from "react-hook-form"
import { ESTADO_FILTER_OPTIONS, SECTOR_FILTER_OPTIONS } from "@/constants/constants"
import { parseUserToFormData } from "@/utils/userFormUtils"
import styles from "./UserForm.module.scss"

interface UserFormProps {
  visible: boolean
  onHide: () => void
  onSubmit: (data: UserFormData) => Promise<void>
  user?: User | null
  loading?: boolean
  onDelete?: (id: number) => void
}

export const UserForm = ({ visible, onHide, onSubmit, user, loading = false, onDelete }: UserFormProps) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
    defaultValues: {
      id: "",
      estado: "",
      sector: null,
      usuario: "",
    },
  })

  const estadoOptions = ESTADO_FILTER_OPTIONS
  const sectorOptions = [SECTOR_FILTER_OPTIONS[0]]; // Solo un sector por defecto 

  useEffect(() => {
    if (user) {
      reset({ ...parseUserToFormData(user), sector: sectorOptions[0].value })
    } else {
      reset({ id: "", usuario: "", estado: "", sector: sectorOptions[0].value })
    }
  }, [user, visible, reset])

  const onSubmitForm = async (data: UserFormData) => {
    try {
      await onSubmit(data)
      onHide()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleDelete = () => {
    if (!user || !onDelete) return;
    onDelete(user.id);
    onHide();
  }

  const customHeader = (
    <div className={styles.customUserDialogHeader}>
      <span>Usuario</span>
      <div className={styles.helpIcon}>
        <i className={`pi pi-cog ${styles.headerIcon}`}></i>
      </div>
    </div>
  )

  return (
    <Dialog
      header={customHeader}
      visible={visible}
      onHide={onHide}
      modal
      className={styles.customUserDialog}
      draggable={false}
      resizable={false}
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className={styles.formField}>
          <label htmlFor="id" className={styles.formLabel}>id</label>
          <Controller
            name="id"
            control={control}
            rules={{
              required: "El id es requerido",
              pattern: { value: /^\d+$/, message: "El id debe ser un número" },
            }}
            render={({ field }) => (
              <InputText
                id="id"
                {...field}
                placeholder="Ingrese el id del Usuario"
                className={`${styles.formInput} ${errors.id ? "p-invalid" : ""}`}
                disabled={!!user}
              />
            )}
          />
          {errors.id && <Message severity="error" text={errors.id.message} className={styles.errorMessage} />}
        </div>
        <div className={styles.formField}>
          <label htmlFor="usuario" className={styles.formLabel}>Nombre:</label>
          <Controller
            name="usuario"
            control={control}
            rules={{
              required: "El usuario es requerido",
              minLength: { value: 2, message: "El usuario debe tener al menos 2 caracteres" },
            }}
            render={({ field }) => (
              <InputText
                id="usuario"
                {...field}
                placeholder="Ingrese el nombre de usuario"
                className={`${styles.formInput} ${errors.usuario ? "p-invalid" : ""}`}
              />
            )}
          />
          {errors.usuario && <Message severity="error" text={errors.usuario.message} icon={false} className={styles.errorMessage} />}
        </div>
        <div className={styles.formField}>
          <label htmlFor="estado" className={styles.formLabel}>Estado:</label>
          <div className={styles.formInputContainer}>
            <i className={`pi pi-search ${styles.inputIcon}`}></i>
            <Controller
              name="estado"
              control={control}
              rules={{ required: "El estado es requerido" }}
              render={({ field }) => (
                <Dropdown
                  id="estado"
                  {...field}
                  options={estadoOptions}
                  onChange={(e) => field.onChange(e.value)}
                  placeholder="Seleccionar el estado"
                  className={`${styles.formDropdown} ${errors.estado ? "p-invalid" : ""}`}
                  showClear={false}
                  filter={false}
                />
              )}
            />
          </div>
          {errors.estado && <Message severity="error" text={errors.estado.message} className={styles.errorMessage} />}
        </div>
        <div className={styles.formField}>
          <label htmlFor="sector" className={styles.formLabel}>Sector:</label>
          <div className={styles.formInputContainer}>
            <i className={`pi pi-search ${styles.inputIcon}`}></i>
            <Controller
              name="sector"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="sector"
                  {...field}
                  options={sectorOptions}
                  value={sectorOptions[0].value}
                  disabled
                  className={styles.formDropdown}
                  optionLabel="label"
                  optionValue="value"
                />
              )}
            />
          </div>
        </div>
        <div className={styles.buttonGroup}>
          {user && (
            <Button
              type="button"
              label="Eliminar"
              loading={loading}
              className={styles.deleteButton}
              icon="pi pi-trash"
              iconPos="left"
              onClick={handleDelete}
            />
          )}
          <Button type="submit"
             label="Confirmar" 
             loading={loading} 
             className={styles.confirmButton} 
             icon="pi pi-check"
             iconPos="left"/>
            <Button
              type="button"
              label="Cancelar"
              onClick={onHide}
              disabled={loading}
              className={`${styles.cancelButton} p-button-outlined`}
              icon="pi pi-check"
              iconPos="left"
            />
        </div>
      </form>
    </Dialog>
  )
}
