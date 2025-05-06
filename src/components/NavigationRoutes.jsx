import React from 'react';
import { Link } from 'react-router-dom';

export default function NavigationRoutes() {
  return (
    <nav>
      <ul className="br-list">
        <li><Link to="/">Contribuintes</Link></li>
        <li><Link to="/beneficios">Benefícios</Link></li>
      </ul>
    </nav>
  );
}
