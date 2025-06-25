import { ProgressSpinner } from "primereact/progressspinner"
import styles from "./Spinner.module.scss"

export const Spinner = () => {
  return (
    <div className={styles.spinnerOverlay}>
      <ProgressSpinner className={styles.spinner50} />
    </div>
  )
}
