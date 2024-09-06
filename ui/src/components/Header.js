// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <Link className="navbar-brand" to="/"> --React-- </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/patrimoine">Patrimoine</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/possession">Possessions</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;