import React from "react";
import "./header.css";

function Header() {
  return (
    <header className="header">
      <h1>Knight's Tour Visualizer</h1>
      <a
        href="https://github.com/Soumo275/knights_tour_visualizer" // Replace with your actual GitHub repo link
        className="source-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Source Code
      </a>
    </header>
  );
}

export default Header;
