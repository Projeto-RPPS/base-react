// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const menuRef = useRef(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(m => !m);
  const toggleSubmenu = id =>
    setOpenMenus(o => ({ ...o, [id]: !o[id] }));

  const menuItems = [
    {
      id: "camada1",
      icon: "fa-bell",
      label: "Camada 1",
      children: [
        { id: "c2-1", icon: "fa-heart", label: "Camada 2", link: "#" },
        { id: "c2-2", icon: "fa-user", label: "Camada 2", link: "#" },
        { id: "c2-3", icon: "fa-box", label: "Camada 2", link: "#" },
      ],
    },
    {
      id: "camada1-2",
      icon: "fa-bell",
      label: "Camada 1",
      children: [
        { id: "c2-4", icon: "fa-heart", label: "Camada 2", link: "#" },
        { id: "c2-5", icon: "fa-user", label: "Camada 2", link: "#" },
        { id: "c2-6", icon: "fa-box", label: "Camada 2", link: "#" },
      ],
    },
    {
      id: "item-simples",
      icon: "fa-bell",
      label: "Item de Camada 1",
      link: "#",
    },
  ];

  return (
    <>
      {/* === HEADER COMPACTO === */}
      <header className="br-header compact">
        <div
          className="container-lg"
          style={{
            maxWidth: "100%",
            paddingLeft: "4rem",
            paddingRight: "4rem",
            paddingBottom: "0.5rem",
          }}
        >
          {/* topo: logo + assinatura (se aplicável) */}
          <div className="header-top">
            <div className="header-logo">
              <img
                src="https://www.gov.br/ds/assets/img/govbr-logo.png"
                alt="gov.br"
              />
              <span className="br-divider vertical" />
              <div className="header-sign">Assinatura</div>
            </div>
          </div>

          {/* bottom: menu + título + links + Entrar */}
          <div
            className="header-bottom"
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* botão de menu e título */}
            <div
              className="header-menu"
              style={{ display: "flex", alignItems: "center" }}
            >
              {!isMenuOpen && (
                <div className="header-menu-trigger">
                  <button
                    className="br-button small circle"
                    type="button"
                    aria-label="Menu principal"
                    onClick={toggleMenu}
                  >
                    <i className="fas fa-bars" aria-hidden="true" />
                  </button>
                </div>
              )}
              <div className="header-info" style={{ marginLeft: "1rem" }}>
                <div className="header-title">RPPS</div>
              </div>
            </div>

            {/* links de acesso + divider + botão Entrar */}
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                marginLeft: "auto",
              }}
            >
              <a href="#">Link de acesso 1</a>
              <a href="#">Link de acesso 2</a>
              <a href="#">Link de acesso 3</a>
              <a href="#">Link de acesso 4</a>

              <span
                className="br-divider vertical"
                style={{
                  margin: "0 0.75rem",    
                  height: "1.75rem",    
                  alignSelf: "center"     
                }}
              />

              <button
                className="br-sign-in small"
                type="button"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-user" aria-hidden="true" />
                <span className="d-sm-inline">Entrar</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* === MENU LATERAL SOBREPOSTO === */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="br-menu"
          style={{
            display: "flex",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          {/* scrim */}
          <div
            className="menu-scrim"
            onClick={toggleMenu}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "var(--surface-overlay-scrim)",
            }}
          />

          <div
            className="menu-panel"
            style={{
              position: "relative",
              width: "320px",
              flex: "none",
              borderRight: "1px solid var(--border-color)",
            }}
          >
            <div className="menu-header">
              <div
                className="menu-title"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src="https://www.gov.br/ds/assets/img/govbr-logo.png"
                  alt="gov.br"
                  style={{
                    width: 30,
                    height: 30,
                    objectFit: "contain",
                    marginRight: 12,
                  }}
                />
                <span>RPPS</span>
              </div>
              <button
                className="br-button circle"
                type="button"
                aria-label="Fechar menu"
                onClick={toggleMenu}
              >
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </div>

            <div
              className="menu-body"
              style={{
                overflowY: "auto",
                maxHeight: "calc(100vh - 120px)",
                padding: "0rem",
              }}
            >
              <ul>
                {menuItems.map(item =>
                  item.children ? (
                    <li
                      key={item.id}
                      className={`drop-menu${
                        openMenus[item.id] ? " active" : ""
                      }`}
                    >
                      <a
                        href="#"
                        className="menu-item"
                        onClick={e => {
                          e.preventDefault();
                          toggleSubmenu(item.id);
                        }}
                      >
                        <span className="icon">
                          <i className={`fas ${item.icon}`} />
                        </span>
                        <span className="content">{item.label}</span>
                        <span className="support">
                          <i className="fas fa-angle-down" />
                        </span>
                      </a>
                      <ul style={{ paddingLeft: "var(--spacing-scale-3x)" }}>
                        {item.children.map(ch => (
                          <li key={ch.id}>
                            <a className="menu-item" href={ch.link}>
                              <span className="icon">
                                <i className={`fas ${ch.icon}`} />
                              </span>
                              <span className="content">{ch.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={item.id}>
                      <a className="menu-item" href={item.link}>
                        <span className="icon">
                          <i className={`fas ${item.icon}`} />
                        </span>
                        <span className="content">{item.label}</span>
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div
              className="menu-footer"
              style={{ borderTop: "1px solid var(--border-color)" }}
            >
              <div className="menu-links">
                <a href="#">Ajuda</a>
                <a href="#">Sobre</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}