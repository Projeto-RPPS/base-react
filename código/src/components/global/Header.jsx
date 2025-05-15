// src/components/Header.jsx
import React, { useEffect, useRef } from "react";

function Header() {
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!window.core) {
      console.error("GovBR DS core não carregado!");
      return;
    }
    // 2) instancia o header compacto
    if (headerRef.current) {
      new core.BRHeader("br-header", headerRef.current);
    }
    // 3) instancia o menu off-canvas
    if (menuRef.current) {
      new core.BRMenu("br-menu", menuRef.current);
    }
  }, []);

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
                  data-toggle="dropdown"
                  aria-label="Abrir Acesso Rápido"
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
                  data-toggle="dropdown"
                  aria-label="Abrir Funcionalidades do Sistema"
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
                    { icon: "fa-adjust", label: "Funcionalidade 4" }
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
                  data-toggle="search"
                  data-target=".header-search"
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
                    data-trigger="login"
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
                  data-toggle="menu"
                  data-target="#main-navigation"
                >
                  <i className="fas fa-bars" aria-hidden="true" />
                </button>
              </div>
              <div className="header-info">
                <div className="header-title">Header Compacto</div>
              </div>
            </div>

            <div className="header-search">
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
                data-dismiss="search"
              >
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* === MENU OFF-CANVAS === */}
      <div
        className="br-menu"
        id="main-navigation"
        ref={menuRef}
      >
        <div className="menu-container">
          <div className="menu-panel">
            <div className="menu-header">
              <div className="menu-title">
                <span>Identificação do site ou Sistema</span>
              </div>
              <div className="menu-close">
                <button
                  className="br-button circle"
                  type="button"
                  aria-label="Fechar o menu"
                  data-dismiss="menu"
                >
                  <i className="fas fa-times" aria-hidden="true" />
                </button>
              </div>
            </div>

            <nav className="menu-body" role="tree">
              <a className="menu-item divider" href="#home">
                <span className="content">Início</span>
              </a>
              <div className="menu-folder">
                <a className="menu-item" href="#servicos" role="treeitem">
                  <span className="content">Serviços</span>
                </a>
                <ul>
                  <li>
                    <a
                      className="menu-item"
                      href="#servico1"
                      role="treeitem"
                    >
                      <span className="content">Serviço 1</span>
                    </a>
                  </li>
                </ul>
              </div>
            </nav>

            <div className="menu-footer">
              <div className="menu-links">
                <a href="#legislacao">
                  <span className="mr-1">Legislação</span>
                  <i className="fas fa-external-link-square-alt" />
                </a>
              </div>
            </div>
          </div>
          <div className="menu-scrim" data-dismiss="menu" tabIndex={0} />
        </div>
      </div>
    </>
  );
}

export default Header;