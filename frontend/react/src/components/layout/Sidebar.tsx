import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Wallet,
  BarChart3,
  Settings,
  ChevronDown,
  Truck,
} from 'lucide-react'
import './Sidebar.css'

const menuItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Cadastros',
    icon: Users,
    children: [
      { label: 'Clientes', path: '/clientes', icon: Users },
      { label: 'Produtos', path: '/produtos', icon: Package },
      { label: 'Fornecedores', path: '/fornecedores', icon: Truck },
    ],
  },
  {
    label: 'Vendas',
    path: '/vendas',
    icon: ShoppingCart,
  },
  {
    label: 'Financeiro',
    path: '/financeiro',
    icon: Wallet,
  },
  {
    label: 'Relatórios',
    path: '/relatorios',
    icon: BarChart3,
  },
  {
    label: 'Configurações',
    path: '/configuracoes',
    icon: Settings,
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true)
  const [openMenus, setOpenMenus] = useState({ Cadastros: true })
  const location = useLocation()

  function toggleSubmenu(label) {
    setOpenMenus((previous) => ({
      ...previous,
      [label]: !previous[label],
    }))
  }

  function hasActiveChild(item) {
    return item.children?.some((child) => location.pathname === child.path)
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-brand">Meu Sistema</span>}

        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}>
          {collapsed ? (
            <PanelLeftOpen size={21} />
          ) : (
            <PanelLeftClose size={21} />
          )}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          const activeChild = hasActiveChild(item)
          const expanded = Boolean(openMenus[item.label])

          if (item.children) {
            return (
              <div className="menu-group" key={item.label}>
                <button
                  className={`menu-link ${activeChild ? 'parent-active' : ''}`}
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false)
                      setOpenMenus((previous) => ({
                        ...previous,
                        [item.label]: true,
                      }))
                    } else {
                      toggleSubmenu(item.label)
                    }
                  }}
                  title={collapsed ? item.label : undefined}
                  aria-expanded={!collapsed && expanded}>
                  <Icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && (
                    <ChevronDown
                      className={`submenu-chevron ${expanded ? 'rotated' : ''}`}
                      size={16}
                    />
                  )}
                </button>

                {!collapsed && expanded && (
                  <div className="submenu">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon

                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `submenu-link ${isActive ? 'active' : ''}`
                          }>
                          <ChildIcon size={17} />
                          <span>{child.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `menu-link ${isActive ? 'active' : ''}`
              }>
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="status-indicator" />
        {!collapsed && <span>ERP Geral</span>}
      </div>
    </aside>
  )
}
