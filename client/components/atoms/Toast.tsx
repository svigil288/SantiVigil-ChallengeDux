"use client"

import { forwardRef } from "react"
import { Toast as PrimeToast } from "primereact/toast"
import styles from "./Toast.module.scss"

export const Toast = forwardRef<PrimeToast>((props, ref) => {
  return (
    <div className={styles.toastContainer}>
      <PrimeToast ref={ref} position="bottom-right" {...props} />
    </div>
  )
})

Toast.displayName = "Toast"
