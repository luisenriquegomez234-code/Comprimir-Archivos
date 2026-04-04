import { procesar as positiva } from "./positiva";
import { procesar as saludTotal } from "./saludTotal";
import { procesar as bolivar } from "./bolivar";
import { procesar as mundial } from "./mundial";
import { procesar as sanitas } from "./sanitas";
import { procesar as previsora } from "./previsora";

/**
 * Mapa de procesadores por id de entidad
 * Cada procesador recibe: (cxcDirHandle, logCallback) => Promise<void>
 */
export const procesadores = {
  positiva,
  saludTotal,
  bolivar,
  mundial,
  sanitas,
  previsora,
};
