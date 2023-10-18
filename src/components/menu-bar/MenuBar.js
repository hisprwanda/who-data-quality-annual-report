import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/images/WHO_logo.png'
import styles from './MenuBar.module.css'

const MenuBar = () => {
    return (
        <div className={styles.menubarContainer}>
            <div className={styles.logoContainer}>
                <ul>
                    <li>
                        <img
                            src={logo}
                            alt="Image"
                            className={styles.logoImage}
                        />
                    </li>
                    <li>WHO Data Quality Annual Report</li>
                    <li>
                        <NavLink to="/">Annual Report</NavLink>
                    </li>
                    <li>
                        <NavLink to="/configurations">Configurations</NavLink>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default MenuBar
