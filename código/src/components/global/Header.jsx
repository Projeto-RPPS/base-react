// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
 
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
 
  // Fechar menu quando clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
 
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };
 
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };
 
  return (
    <>
      {/* === HEADER COMPACTO === */}
      <header ref={headerRef} className="br-header compact" data-sticky>
        <div className="container-lg">
          <div className="header-top">
            <div className="header-logo">
              <img
                src="https://www.gov.br/ds/assets/img/govbr-logo.png"
                alt="logo"
              />
              <span className="br-divider vertical" />
              <div className="header-sign">Assinatura</div>
            </div>
 
            <div className="header-actions">
              {/* Acesso Rápido */}
              <div className="header-links dropdown">
                <button
                  className="br-button circle small"
                  type="button"
                  aria-label="Abrir Acesso Rápido"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-ellipsis-v" aria-hidden="true" />
                </button>
                <div className="br-list">
                  <div className="header">
                    <div className="title">Acesso Rápido</div>
                  </div>
                  {[1, 2, 3, 4].map((i) => (
                    <a key={i} className="br-item" href="#">
                      Link de acesso {i}
                    </a>
                  ))}
                </div>
              </div>
 
              <span className="br-divider vertical mx-half mx-sm-1" />
 
              {/* Funcionalidades */}
              <div className="header-functions dropdown">
                <button
                  className="br-button circle small"
                  type="button"
                  aria-label="Abrir Funcionalidades do Sistema"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-th" aria-hidden="true" />
                </button>
                <div className="br-list">
                  <div className="header">
                    <div className="title">Funcionalidades do Sistema</div>
                  </div>
                  {[
                    { icon: "fa-chart-bar", label: "Funcionalidade 1" },
                    { icon: "fa-headset", label: "Funcionalidade 2" },
                    { icon: "fa-comment", label: "Funcionalidade 3" },
                    { icon: "fa-adjust", label: "Funcionalidade 4" },
                  ].map((f, idx) => (
                    <div key={idx} className="br-item">
                      <button
                        className="br-button circle small"
                        type="button"
                        aria-label={f.label}
                      >
                        <i className={`fas ${f.icon}`} aria-hidden="true" />
                        <span className="text">{f.label}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Busca */}
              <div className="header-search-trigger">
                <button
                  className="br-button circle"
                  type="button"
                  aria-label="Abrir Busca"
                  onClick={toggleSearch}
                >
                  <i className="fas fa-search" aria-hidden="true" />
                </button>
              </div>
 
              {/* Login */}
              <div className="header-login">
                <div className="header-sign-in">
                  <button
                    className="br-sign-in small"
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-user" aria-hidden="true" />
                    <span className="d-sm-inline">Entrar</span>
                  </button>
                </div>
                <div className="header-avatar d-none" />
              </div>
            </div>
          </div>
 
          {/* Rodapé do Header */}
          <div className="header-bottom">
            <div className="header-menu">
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
              <div className="header-info">
                <div className="header-title">Header Compacto</div>
              </div>
            </div>
 
            <div
              ref={searchRef}
              className={`header-search ${isSearchOpen ? "active" : ""}`}
            >
              <div className="br-input has-icon">
                <label htmlFor="searchbox-98886">Texto da pesquisa</label>
                <input
                  id="searchbox-98886"
                  type="text"
                  placeholder="O que você procura?"
                />
                <button
                  className="br-button circle small"
                  type="button"
                  aria-label="Pesquisar"
                >
                  <i className="fas fa-search" aria-hidden="true" />
                </button>
              </div>
              <button
                className="br-button circle search-close ml-1"
                type="button"
                aria-label="Fechar Busca"
                onClick={() => setIsSearchOpen(false)}
              >
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
 
        {/* Menu principal */}
        <div ref={menuRef} className={`br-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="menu-container">
            <div className="menu-scrim" onClick={() => setIsMenuOpen(false)} />
            <div className="menu-panel">
              <div className="menu-header">
                <button
                  className="br-button circle"
                  type="button"
                  aria-label="Fechar Menu"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-times" aria-hidden="true" />
                </button>
                <div className="menu-title">
                  <span>Menu Principal</span>
                </div>
              </div>
              <div className="menu-body">
                <ul>
                  <li className="menu-folder">
                    <a className="menu-item" href="#">
                      <span className="content">Item de menu 1</span>
                    </a>
                    <ul>
                      <li>
                        <a className="menu-item" href="#">
                          <span className="content">Subitem 1</span>
                        </a>
                      </li>
                      <li>
                        <a className="menu-item" href="#">
                          <span className="content">Subitem 2</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a className="menu-item" href="#">
                      <span className="content">Item de menu 2</span>
                    </a>
                  </li>
                  <li className="drop-menu">
                    <a className="menu-item" href="#">
                      <span className="content">Item com dropdown</span>
                      <span className="support">
                        <i className="fas fa-angle-down" aria-hidden="true" />
                      </span>
                    </a>
                    <ul>
                      <li>
                        <a className="menu-item" href="#">
                          <span className="content">Opção 1</span>
                        </a>
                      </li>
                      <li>
                        <a className="menu-item" href="#">
                          <span className="content">Opção 2</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="menu-footer">
                <div className="menu-links">
                  <a href="#">Ajuda</a>
                  <a href="#">Sobre</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
 
export default Header;
 