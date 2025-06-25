"use client"

import { useState } from "react"
import { SIDEBAR_MENU_ITEMS } from "@/constants/constants"
import styles from "./Sidebar.module.scss"

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("usuarios")

  return (
    <div className={`flex flex-column align-items-center ${styles.customSidebar}`}>
      <div className={`flex flex-column gap-2 flex-1 ${styles.sidebarMenu}`}>
        {SIDEBAR_MENU_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`${styles.sidebarItem} ${activeItem === item.id ? styles.active : ""}`}
            style={idx === 0 ? { marginTop: 18 } : {}}
          >
            <i className={`${item.icon} ${styles.sidebarIcon}`}></i>
          </button>
        ))}
      </div>
    </div>
  )
}
