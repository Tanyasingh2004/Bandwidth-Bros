import React from "react";
import { Activity, Wifi, Sun, Moon } from "lucide-react";

const Navbar = ({ theme, toggleTheme }) => {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: "1px solid var(--panel-border)",
        background:
          theme === "dark"
            ? "rgba(11,15,25,0.85)"
            : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            background: "var(--accent-blue-transparent)",
            padding: "10px",
            borderRadius: "12px",
            color: "var(--accent-blue)",
            boxShadow: "0 0 15px rgba(59,130,246,0.35)",
          }}
        >
          <Activity size={24} />
        </div>

        <div>
          <h1
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Automatic Configuration Tool
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              opacity: 0.7,
            }}
          >
            Network Discovery & Automation
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Online Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.25)",
            padding: "8px 12px",
            borderRadius: "999px",
          }}
        >
          <Wifi size={16} color="#22c55e" />
          <span
            style={{
              fontSize: "0.85rem",
              color: "#22c55e",
              fontWeight: 600,
            }}
          >
            System Online
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "1px solid var(--panel-border)",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          {theme === "dark" ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
