export const MENUS = {
  ADMINISTRADOR: [
    {
      id: "resumen",
      label: "Resumen general",
      view: "administrador/dashboard"
    },
    {
      id: "usuarios",
      label: "Usuarios",
      view: "administrador/usuarios"
    },
    {
      id: "distribuidores",
      label: "Distribuidores",
      view: "administrador/distribuidores"
    }
  ],

  DISTRIBUIDOR: [
    {
      id: "resumen",
      label: "Resumen",
      view: "distribuidor/dashboard"
    },
    {
      id: "personal",
      label: "Mi personal",
      view: "distribuidor/personal"
    },
    {
      id: "certificacion",
      label: "Certificación",
      view: "distribuidor/certificacion"
    }
  ],

  COORDINADOR: [
    {
      id: "resumen",
      label: "Resumen",
      view: "coordinador/dashboard"
    },
    {
      id: "cartera",
      label: "Mi cartera",
      view: "coordinador/cartera"
    },
    {
      id: "validacion",
      label: "Validación",
      view: "coordinador/validacion"
    }
  ]
};
