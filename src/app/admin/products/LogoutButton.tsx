"use client";

export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
      className="border border-gray-700 hover:border-gray-500 transition rounded-lg px-4 py-2 text-sm text-gray-200"
    >
      Cerrar sesión
    </button>
  );
}