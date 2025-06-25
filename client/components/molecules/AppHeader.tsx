"use client"

import Image from "next/image"
import styles from "./AppHeader.module.scss"

export const AppHeader = () => (
  <header className={`app-header flex align-items-center justify-content-between px-3 ${styles.appHeader}`}>
    <div className={`flex align-items-center ${styles.headerLeft}`}>
      <Image src="/images/logo.png" alt="Logo" width={28} height={28} style={{ objectFit: "contain" }} />
    </div>
    <div className={`flex align-items-center ${styles.headerRight}`}>
      <i className={`pi pi-cog ${styles.sidebarIcon}`}></i>
    </div>
  </header>
)
