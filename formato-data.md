{
    // --- Datos base (obligatorios) ---
    id: "",                  // string único, ej "15"
    codigo: "",               // código interno, ej "LUX015"
    ml: 0,                    // tamaño del frasco en ml
    marca: "",
    nombre: "",
    precio: 0,
    stock: 0,
    stockCritico: 0,          // debajo de este número se marca como "poco stock"

    // --- Clasificación / filtros ---
    categoria: "",            // ej "economicos" | "moderados" | "intensos"
    familia: "",              // ej "gourmand" | "acuatico" | "amaderado"
    estacion: "",             // "verano" | "primavera" | "invierno" | "otono"
    genero: "",               // "hombre" | "mujer" | "unisex"
    tipo: "",                 // ej "arabe" | "disenador" | "nicho"
    concentracion: "",        // "edt" | "edp" | "parfum"

    // --- Maridaje / mood (arrays de códigos, ver OCASIONES/HUMOR en script.js) ---
    humor: [],                // ej ["poderoso","misterioso"]
    maridaje: [],             // ej ["noche_especial","cita_romantica"]

    // --- Notas olfativas ---
    notas: {
        salida: [],
        corazon: [],
        fondo: []
    },

    // --- Imagen de catálogo / listado ---
    imagen: "",               // URL usada en las cards de productos.html y como fallback del hero

    // --- Descripción ---
    descripcion: "",

    // --- Si es "inspirado en" otro perfume (opcional, borra el objeto si no aplica) ---
    inspiradoEn: {
        marca: "",
        nombre: "",
        precioOriginal: 0
    },

    // --- Hero (banner superior de producto.html) ---
    heroFondo: "",            // URL de la imagen del hero. Si se deja vacío, usa el hero--fallback con "imagen"
    heroAjuste: "",           // opcional: "contain" si la imagen debe verse completa sin recortarse (por defecto es "cover")

    // --- Nuestra Historia ---
    historiaTitulo: "",
    historia: "",
    historiaImagen: "",       // si se deja vacío, usa el fondo plano de la estación/tema

    // --- Notas visuales (una foto por card de "La Fragancia") ---
    notasImagenes: {
        salida: "",
        corazon: "",
        fondo: ""
    },

    // --- CTA final ---
    ctaFondo: "",             // si se deja vacío, el CTA usa un fondo plano en vez de imagen
    ctaTitulo: "",
    ctaTexto: "",

    // --- Personalización de colores (opcional, pisa el color de la estación) ---
    // Afecta: fondo de página, cards de notas, reviews, títulos, botones y estrellas.
    colores: {
        "tema-bg": "",
        "tema-card": "",
        "tema-card-salida": "",
        "tema-card-corazon": "",
        "tema-card-fondo": "",
        "tema-acento": "",
        "tema-dorado": "",
        "tema-texto": "",
        "tema-texto-sec": ""
    },

    // --- Fondo general de página (pirámide, maridaje, reseñas, historia sin imagen propia) ---
    fondoPagina: "",

    // --- Nav oscuro/claro ---
    navClaro: true            // poner en true si el fondo del producto es claro (por defecto es false/oscuro)
}

localStorage.removeItem("productos");
location.reload();

resetear cache de productos
