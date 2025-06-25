import Link from 'next/link'
import { Button } from 'primereact/button'
import styles from './not-found.module.scss'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Página no encontrada</h2>
        <p className={styles.description}>
          La página que buscas no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button 
            label="Volver al inicio" 
            icon="pi pi-home"
            className={styles.homeButton}
          />
        </Link>
      </div>
    </div>
  )
}