import React from "react";

export default function NavigationRoutes() {
    return(
        <nav className="br-breadcrumb">
                                <ol className="crumb-list" role="list">
                                    <li className="crumb home"><a className="br-button circle" href="javascript:void(0)"><span className="sr-only">Página inicial</span><i className="fas fa-home"></i></a></li>
                                    <li className="crumb"><i className="icon fas fa-chevron-right"></i><a href="javascript:void(0)">Tela Anterior</a>
                                    </li>
                                    <li className="crumb"><i className="icon fas fa-chevron-right"></i><a href="javascript:void(0)">Tela Anterior2</a>
                                    </li>
                                    <li className="crumb"><i className="icon fas fa-chevron-right"></i><a href="javascript:void(0)">Tela Anterior3</a>
                                    </li>
                                    <li className="crumb"><i className="icon fas fa-chevron-right"></i><a href="javascript:void(0)">Tela Anterior4</a>
                                    </li>
                                    <li className="crumb" data-active="active"><i className="icon fas fa-chevron-right"></i><span tabIndex="0" aria-current="page">Tela Atual</span>
                                    </li>
                                </ol>
                            </nav>
    );
}