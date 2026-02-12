// Configuración de tipos de entrada permitidos para este frontend
// Solo se mostrarán estos tipos en el formulario de registro
export const TIPOS_PERMITIDOS = [
  'Adulto (Nacional)',
  'Adulto (Extranjero)', 
  'Niño(a)'
]

// Función para filtrar precios según los tipos permitidos
export const filtrarPrecios = (precios) => {
  return precios.filter(precio => TIPOS_PERMITIDOS.includes(precio.tipo))
}
