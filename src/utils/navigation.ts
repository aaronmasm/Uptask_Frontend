export const safeNavigation = {
  // Crear URL limpia sin un query param específico
  clearQueryParam: (paramName: string): string => {
    const url = new URL(window.location.href);
    url.searchParams.delete(paramName);
    // Retornar solo el search string (ej: "?other=value" o "")
    return url.search;
  },

  // Refrescar página actual completamente
  refreshPage: () => {
    window.location.reload();
  },
};
