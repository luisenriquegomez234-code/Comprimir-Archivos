---
trigger: always_on
---

# [cite_start]Reglas de Negocio: Aplicación Web "Comprimir-Archivos" [cite: 1]

## Regla General de Directorio
* [cite_start]En cada entidad, se debe ingresar a una serie de carpetas que comienzan con la estructura `CXC` (Ejemplo: `CXC 122781`). [cite: 2]

## [cite_start]1. POSITIVA COMPAÑIA DE SEGUROS S.A [cite: 3]
* [cite_start]Debes ingresar a cada carpeta que comienza con el nombre de `CXC`. [cite: 4]
* [cite_start]En cada carpeta hay dos subcarpetas: una tiene esta nomenclatura `Prefijo + Numero de Factura` (Ej. `CTFE289320`) y `RIPS`. [cite: 4]

### Reglas para carpeta `RIPS`
* [cite_start]Ingresar a la subcarpeta `Prefijo + Numero de Factura` (Ej. `CTFE289320`) que está dentro de `RIPS`. [cite: 5]
* [cite_start]Comprimir los siguientes archivos: [cite: 5]
  * [cite_start]El archivo `.xml` que comienza por las letras `ad`. [cite: 6]
  * [cite_start]El archivo `.txt` que comienza por `ResultadosMSPS`. [cite: 7]
  * [cite_start]El archivo `.json` llamado `Rips`. [cite: 8]
* [cite_start]**Nomenclatura y Ubicación:** El comprimido debe quedar estructurado como `Rips_Prefijo + Numero de Factura` (Ej. `Rips_CTFE288119.zip`) y el comprimido debe quedar en la carpeta `RIPS` fuera de donde están los archivos. [cite: 9]

### Reglas para carpeta `Prefijo + Numero de Factura`
* [cite_start]Comprimir los archivos `.pdf` que se encuentran en la carpeta `Prefijo + Numero de Factura` (Ej. `CTFE289320`). [cite: 10]
* [cite_start]**Nomenclatura, Ubicación y Exclusiones:** El comprimido de los pdf debe quedar como `Prefijo + Numero de Factura.zip` (Ej. `CTFE289320.zip`). [cite: 11]
* [cite_start]Se debe excluir el archivo en pdf que comienza con el prefijo `CTFE`. [cite: 11]
* [cite_start]El comprimido debe quedar dentro de la carpeta donde están los archivos. [cite: 12]

## [cite_start]2. SALUD TOTAL EPS S S.A [cite: 13]
* [cite_start]Debes ingresar a cada carpeta que comienza con el nombre de `CXC` y en cada carpeta hay varias subcarpetas. [cite: 14]

### Reglas para subcarpetas de "Números"
* [cite_start]Ingresar a la carpeta que contiene Números (Ej. `122573`) la cual tiene subcarpetas con el nombre `NIT_Prefijo + Numero de Factura` (Ej. `812005130_CTFE289320`). [cite: 15]
* [cite_start]Comprimir los archivos con extensión `.json` que están en estas subcarpetas (Ej. `812005130_CTFE287995_CUV.json`, `812005130_CTFE287995_RIPS.json`). [cite: 15, 16]
* [cite_start]**Nomenclatura y Ubicación:** El comprimido debe quedar de la forma `Nit_Prefijo + Numero de Factura` (Ej. `812005130_CTFE287995.zip`) dentro de la carpeta que esta creada y se  llama `COMPRIMIDO`y es ahí donde vas a aguardar los archivos comprimidos. [cite: 17]

### Reglas para subcarpetas `Prefijo + Numero de Factura`
* [cite_start]Entrar a cada una de las carpetas que se llama `Prefijo + Numero de Factura` (Ej. `CTFE287995`) y comprimir los pdf. [cite: 18]
* [cite_start]**Nomenclatura, Ubicación y Exclusiones:** Debe quedar `Prefijo + Numero de Factura.zip` (Ej. `CTFE289320.zip`). [cite: 18]
* [cite_start]Se debe excluir el archivo en pdf que comienza con el prefijo `CTFE`. [cite: 18]
* [cite_start]El comprimido debe quedar dentro de la carpeta donde están los archivos. [cite: 19]

## [cite_start]3. COMPAÑIA DE SEGUROS BOLIVAR S.A [cite: 20]
* [cite_start]Debes ingresar a cada carpeta que comienza con el nombre de `CXC` y entrar a las subcarpetas nombradas como: `Prefijo + Numero de Factura`. [cite: 21]
* [cite_start]Se comprime los archivos con Extensiones `.pdf`, `.txt` y `.json`. [cite: 22]
* [cite_start]**Exclusión:** Se debe excluir el archivo en pdf que comienza con el prefijo `CTFE`. [cite: 22]
* [cite_start]**Nomenclatura y Ubicación:** El comprimido debe quedar alojado en la misma carpeta donde reposan los archivos, y el renombre es el prefijo `FAC_Numero de Factura` (Ej. `FAC_CTFE290177.zip`). [cite: 23, 24]

## [cite_start]4. COMPAÑIA MUNDIAL DE SEGUROS S.A [cite: 25]
* [cite_start]Debes ingresar a cada carpeta que comienza con el nombre de `CXC`. [cite: 26]

### Reglas para carpetas `CUV` y `RIPS`
* [cite_start]Ingresar a la subcarpeta nombrada con el `Numero de la Cuenta` (Ej. `122930`). [cite: 26]
* [cite_start]Dentro de dicha carpeta hay dos subcarpetas que se llaman `CUV` y `RIPS`. [cite: 26]
* [cite_start]Se debe comprimir los archivos que se encuentran en cada carpeta mencionada anteriormente. [cite: 27]
* [cite_start]**Nomenclatura:** En cada carpeta debe quedar su comprimido de esta forma `CUV.zip` y `RIPS.zip`. [cite: 27]

### Reglas para archivos `.pdf`
* [cite_start]Se comprime los archivos que están en pdf, y cada pdf es un comprimido diferente. [cite: 28]
* [cite_start]**Nomenclatura:** El renombre de los archivos es: `Nit-Prefijo + Numero de Factura` (Ej. `8120051308-CTFE290118`). [cite: 28]

## [cite_start]5. ENTIDAD PROMOTORA DE SALUD SANITAS S.A.S – EN INTERVENCIÓN BAJO LA MEDIDA DE TOMA DE POSESIÓN [cite: 29]
* [cite_start]Debes ingresar a cada carpeta que comienza con el nombre de `CXC` y entrar a las subcarpetas nombradas como: `Prefijo + Numero de Factura` (Ej. `CTFE288968`). [cite: 30]
* [cite_start]Dentro de dicha carpeta hay una subcarpeta que se llaman `Prefijo + Numero de Factura` (Ej. `CTFE288968`) y esa es la que vas a comprimir. [cite: 30]
* [cite_start]Los archivos que deben quedar comprimidos son los que tienen extensión `.xml`, `.pdf`, y `.json`. [cite: 30]
* [cite_start]**Exclusión:** Debe quedar excluido el archivo en pdf que comienza con el prefijo `CTFE`. [cite: 30]
* [cite_start]**Nomenclatura:** El comprimido debe quedar de esta forma: `Prefijo + Numero de Factura.zip` (Ej. `CTFE288968.zip`). [cite: 31]

## [cite_start]6. LA PREVISORA S.A COMPAÑÍA DE SEGUROS [cite: 32]
* [cite_start]Debes ingresar a cada carpeta que comienza con el nombre de `CXC` y en cada carpeta hay varias subcarpetas. [cite: 33]

### Reglas para carpetas `CUV` y `RIPS`
* [cite_start]Ingresar a la subcarpeta renombrada como: `Numero de la Cuenta` (Ej. `122930`), la cual contiene las carpetas `CUV` y `RIPS`. [cite: 34]
* [cite_start]Comprimir los archivos que están dentro de la carpeta llamada `CUV`, y debe quedar el comprimido dentro de la carpeta. [cite: 35]
* [cite_start]El comprimido debe quedar de esta forma: `CUV.zip`. [cite: 36]
* [cite_start]Comprimir los archivos que están dentro de la carpeta llamada `RIPS`, y debe quedar el comprimido dentro de la carpeta. [cite: 37]
* [cite_start]El comprimido debe quedar de esta forma: `RIPS.zip`. [cite: 38]

### Reglas para carpeta `SOPORTE`
* [cite_start]Luego regresas a la carpeta `CXC`. [cite: 39]
* [cite_start]Comprime los archivos que están dentro de la carpeta llamada `SOPORTES`, y debe quedar el comprimido dentro de la carpeta. [cite: 40]
* [cite_start]El comprimido debe quedar de esta forma: `SOPORTES.zip`. [cite: 41]