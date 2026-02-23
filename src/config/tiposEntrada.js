// Función para filtrar precios que son para público general
export const filtrarPrecios = (precios) => {
  return precios.filter(precio => precio.publico === true)
}
