import React from "react";
import "./header.css";

function Header() {
  return (
    <header className="header">
      <h1>Knight's Tour Visualizer</h1>
      <div className="links">
        <a
          href="https://github.com/Soumo275/knights_tour_visualizer" 
          className="source-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Code
        </a>
        <a
          href="https://www.geeksforgeeks.org/warnsdorffs-algorithm-knights-tour-problem/"
          className="source-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Concept
        </a>
      </div>
    </header>
  );
}

export default Header;
