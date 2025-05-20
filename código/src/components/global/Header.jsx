// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
      id: "home",
      icon: "fa-home",
      label: "Home",
      link: "/home",
    },
    {
      id: "contribuinte",
      icon: "fa-users",
      label: "Contribuinte",
      children: [
        { id: "fazer-contribuicao", icon: "fa-hand-holding-heart", label: "Fazer Contribuição", link: "/contribuicoes" },
        { id: "listar-contribuintes", icon: "fa-user", label: "Contribuintes", link: "/contribuintes" },
        { id: "historico-contribuicoes", icon: "fa-history", label: "Histórico", link: "/contribuicoes/historico" },
      ],
    },
    {
      id: "categoria",
      icon: "fa-tags",
      label: "Categoria",
      children: [
        { id: "cadastrar-categoria", icon: "fa-plus", label: "Cadastrar Categoria", link: "/contribuintes/categorias" },
        { id: "editar-categoria", icon: "fa-edit", label: "Editar Categoria", link: "/contribuintes/categorias/editar" },
      ],
    },
    {
      id: "emprestimo",
      icon: "fa-credit-card",
      label: "Empréstimo",
      children: [
        { id: "criar-emprestimo", icon: "fa-plus-circle", label: "Criar empréstimo", link: "/emprestimos/criar" },
        { id: "simular-emprestimo", icon: "fa-calculator", label: "Simular empréstimo", link: "/emprestimos/simular" },
        { id: "listar-emprestimos", icon: "fa-list", label: "Meus empréstimos", link: "/emprestimos" },
      ],
    },
    {
      id: "margem",
      icon: "fa-balance-scale",
      label: "Margem Consignável",
      children: [
        { id: "simular-margem", icon: "fa-sliders-h", label: "Margem", link: "/margem" },
      ],
    },
    {
    id: "beneficios",
    icon: "fa-gift",               // ícone de presente
    label: "Benefícios",
    children: [
      {
        id: "cadastrar-beneficios",
        icon: "fa-plus",           // ícone de lista
        label: "Cadastrar Benefícios",
        link: "/beneficios/cadastrar"
      },
      {
        id: "editar-beneficio",
        icon: "fa-edit",    // ícone de informação
        label: "Editar Benefício",
        link: "/beneficios/editar"
      }
    ]
  },
    {
      id: "solicitarBeneficio",
      icon: "fa-plus",      // ícone de formulário
      label: "Solicitar Benefício",
      children: [
        {
          id: "nova-solicitacao",
          icon: "fa-edit",           // ícone de edição
          label: "Nova Solicitação",
          link: "/solicitacao-beneficios"
        },
        {
          id: "historico-solicitacoes",
          icon: "fa-history",        // ícone de histórico
          label: "Histórico de Solicitações",
          link: "/beneficios/solicitacao/historico"
        }
      ]
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
          {/* topo: logo + assinatura */}
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
              <a href="/contribuintes">Contribuintes</a>
              <a href="/contribuicoes">Contribuição</a>
              <a href="/emprestimos">Empréstimo</a>
              <a href="/margem">Margem Consignável</a>
              <a href="#">Benefício</a>
              <a href="#">Solicitar Benefício</a>

              <span
                className="br-divider vertical"
                style={{
                  margin: "0 0.75rem",
                  height: "1.75rem",
                  alignSelf: "center",
                }}
              />

              <button
                className="br-sign-in small"
                type="button"
                onClick={() => {setIsMenuOpen(false);
                  navigate("/login");}
                }
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
                      className={`drop-menu${openMenus[item.id] ? " active" : ""}`}
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
                            <NavLink
                              to={ch.link}
                              end
                              className="menu-item"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="icon">
                                <i className={`fas ${ch.icon}`} />
                              </span>
                              <span className="content">{ch.label}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={item.id}>
                      <NavLink
                        to={item.link}
                        end
                        className="menu-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="icon">
                          <i className={`fas ${item.icon}`} />
                        </span>
                        <span className="content">{item.label}</span>
                      </NavLink>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div
              className="menu-footer"
              style={{ borderTop: "1px solid var(--border-color)" }}
            >
              
            </div>
          </div>
        </div>
      )}
    </>
  );
}