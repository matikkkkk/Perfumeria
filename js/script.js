/* ==========================================================================
    INICIALIZACIÓN GENERAL
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
    actualizarNavbarSesion();  
    actualizarContador();
    actualizarContadorWishlist();
    inicializarDiccionario();
    inicializarNewsletter();
    inicializarBusquedaNav();

    if (document.getElementById("productosGrid")) {
        inicializarFiltrosProductos();
    }

    if (document.getElementById("heroProducto")) {
        mostrarDetalle();
    }

    if (document.getElementById("carruselLanzamientosInner")) {
        inicializarNuevosLanzamientos();
    }

    if (document.getElementById("carruselMujerInner")) {
        inicializarCarruselesGenero();
    }

    if (document.getElementById("destacadosGrid")) {
        renderDestacados();
    }

    if (document.getElementById("wishlistGrid")) {
        mostrarWishlist();
    }

    if (document.getElementById("carritoLista")) {
    mostrarCarrito();
    }

    if (document.getElementById("pagoForm")) {
        inicializarPago();
    }

    if (document.getElementById("confirmacionPago")) {
        mostrarConfirmacionPago();
    }

    if (document.getElementById("region")) {
        cargarRegiones("region", "comuna");
    }
    var registro = document.getElementById("registroForm");
    if (registro) {
        registro.addEventListener("submit", registrarUsuario);
        activarValidacionEnVivo(registro);
    }

    var login = document.getElementById("loginForm");
    if (login) {
        login.addEventListener("submit", iniciarSesion);
        activarValidacionEnVivo(login);
    }

    var contacto = document.getElementById("contactoForm");
    if (contacto) {
        contacto.addEventListener("submit", enviarContacto);
        activarValidacionEnVivo(contacto);
    }


});


/* ==========================================================================
    UTILIDADES Y DICCIONARIOS DE DATOS
   ========================================================================== */
function obtenerLista() {
    return typeof obtenerProductos === "function" ? obtenerProductos() : productos;
}

var OCASIONES = {
    noche_especial: { label: "Noche especial", icon: "👑" },
    dia_a_dia: { label: "Día a día", icon: "☀️" },
    trabajo_reuniones: { label: "Trabajo y reuniones", icon: "💼" },
    cita_romantica: { label: "Cita romántica", icon: "❤️" },
    playa: { label: "Verano / playa", icon: "🏖️" },
    gala: { label: "Gala", icon: "✨" },
    boda: { label: "Boda", icon: "💍" },
    evento_exclusivo: { label: "Evento exclusivo", icon: "⭐" }
};

var HUMOR_LABELS = {
    poderoso: "Poderoso",
    romantico: "Romántico",
    fresco: "Fresco",
    misterioso: "Misterioso",
    relajado: "Relajado",
    elegante: "Elegante"
};

var TIPO_LABELS = { disenador: "Diseñador", nicho: "Nicho", arabe: "Árabe" };

var CONCENTRACION_LABELS = { edt: "EDT", edp: "EDP", parfum: "Parfum", edc: "EDC", eau_cologne: "Eau de Cologne" };

var FAMILIA_LABELS = {
    citrico: "Cítrico",
    floral: "Floral",
    oriental: "Oriental",
    amaderado: "Amaderado",
    acuatico: "Acuático",
    gourmand: "Gourmand",
    especiado: "Especiado",
    frutal: "Frutal",
    avainillado: "Avainillado",
    atalcados: "Atalcado"
};

/* Temas visuales de producto.html según estación. Si el producto trae un
   estacion no reconocido, se usa "invierno" como respaldo neutro. */
var TEMAS_VALIDOS = ["verano", "primavera", "invierno", "otono"];

function temaDeProducto(producto) {
    var key = (producto.estacion || "").toString().trim().toLowerCase();
    return TEMAS_VALIDOS.indexOf(key) !== -1 ? key : "invierno";
}

/* Banco fijo de reseñas "fake" para no tener que redactar una por producto.
   Se eligen siempre las mismas 3 para un mismo id (determinístico), no
   cambian entre recargas. */
var RESENAS_BANCO = [
    { nombre: "Camila R.", texto: "Duración increíble, todavía lo siento en la piel horas después.", estrellas: 5 },
    { nombre: "Matías G.", texto: "El aroma es tal cual se describe, quedé encantado desde la primera vez.", estrellas: 5 },
    { nombre: "Valentina S.", texto: "Se lo regalé a mi pareja y le fascinó, no se lo esperaba.", estrellas: 5 },
    { nombre: "Tomás P.", texto: "Buena relación calidad-precio, sin duda volvería a comprar.", estrellas: 4 },
    { nombre: "Javiera M.", texto: "El empaque llegó impecable y el perfume es precioso en persona.", estrellas: 5 },
    { nombre: "Nicolás F.", texto: "Justo lo que buscaba para el día a día, ni muy fuerte ni muy suave.", estrellas: 4 },
    { nombre: "Antonia V.", texto: "Huele increíble, he recibido muchos cumplidos usándolo.", estrellas: 5 },
    { nombre: "Diego H.", texto: "Se siente como un perfume de nicho, muy elegante para el precio.", estrellas: 5 },
    { nombre: "Fernanda L.", texto: "Llegó rápido y es tal cual la foto, muy conforme.", estrellas: 4 },
    { nombre: "Sebastián O.", texto: "Se convirtió en mi favorito, no me lo esperaba la verdad.", estrellas: 5 },
    { nombre: "Isidora T.", texto: "La fijación es excelente, me dura prácticamente todo el día.", estrellas: 5 },
    { nombre: "Cristóbal A.", texto: "Muy buen aroma para la ocasión que estaba buscando.", estrellas: 4 }
];

function resenasDeProducto(id) {
    var suma = 0;
    for (var i = 0; i < id.length; i++) suma += id.charCodeAt(i);
    var inicio = suma % RESENAS_BANCO.length;
    var elegidas = [];
    for (var j = 0; j < 3; j++) {
        elegidas.push(RESENAS_BANCO[(inicio + j) % RESENAS_BANCO.length]);
    }
    return elegidas;
}

function iniciales(nombre) {
    return nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(function (parte) { return parte.charAt(0).toUpperCase(); })
        .join("");
}

function estrellasHtml(n) {
    var llenas = "★".repeat(n);
    var vacias = "☆".repeat(5 - n);
    return llenas + vacias;
}

function chipHumor(tag) {
    return '<span class="mood-chip mood-chip--' + tag + '">' + (HUMOR_LABELS[tag] || tag) + "</span>";
}

function chipOcasion(codigo) {
    var o = OCASIONES[codigo];
    if (!o) return "";
    return '<span class="occasion-chip">' + o.icon + " " + o.label + "</span>";
}

function chipNota(nombre) {
    return '<span class="nota-chip">' + nombre + "</span>";
}

function notasPlanas(producto) {
    if (!producto.notas) return [];
    return []
        .concat(producto.notas.salida || [])
        .concat(producto.notas.corazon || [])
        .concat(producto.notas.fondo || []);
}


/* ==========================================================================
   RENDERIZADO DE PRODUCTOS (tarjetas, slides, secciones de detalle)
   ========================================================================== */
function renderInspiradoEn(producto, compacto) {
    if (producto.tipo !== "arabe" || !producto.inspiradoEn) return "";
    var info = producto.inspiradoEn;
    var ahorro = info.precioOriginal - producto.precio;

    if (compacto) {
        return (
            '<div class="inspirado-mini">' +
            '<span class="inspirado-mini-label">✦ Inspirado en <em>' +
            info.nombre +
            "</em></span>" +
            '<span class="inspirado-mini-precios"><s>$' +
            info.precioOriginal.toLocaleString("es-CL") +
            "</s> $" +
            producto.precio.toLocaleString("es-CL") +
            "</span>" +
            "</div>"
        );
    }

    return (
        '<section class="inspirado-banner mt-4">' +
        '<span class="text-gold fs-7 text-uppercase tracking-wider">✦ Inspirado en</span>' +
        '<div class="inspirado-banner-body">' +
        '<div>' +
        '<h4 class="luxury-title fst-italic mb-1">' +
        info.nombre +
        "</h4>" +
        '<span class="fs-7 text-gold-light">Fragancia de referencia · Precio original</span><br>' +
        '<s class="text-gold-light">$' +
        info.precioOriginal.toLocaleString("es-CL") +
        "</s>" +
        "</div>" +
        '<div class="text-md-end">' +
        '<span class="fs-7 text-tema-dorado text-uppercase tracking-wider d-block">Nuestra versión</span>' +
        '<span class="price">$' +
        producto.precio.toLocaleString("es-CL") +
        "</span>" +
        '<span class="badge-ahorro d-inline-block mt-1">Ahorra $' +
        ahorro.toLocaleString("es-CL") +
        "</span>" +
        "</div>" +
        "</div></section>"
    );
}

function crearTarjeta(p) {
    var alertaStock = p.stock <= p.stockCritico
        ? '<span class="badge bg-danger mb-2 d-inline-block">¡Últimas unidades!</span>'
        : "";
    var moods = (p.humor || []).map(chipHumor).join("");
    var enWishlist = estaEnWishlist(p.id);

    return (
        '<div class="col-12 col-md-6 col-lg-4">' +
        '<article class="card luxury-card h-100 border-0">' +
        '<span class="card-badge card-badge--left">' +
        (CONCENTRACION_LABELS[p.concentracion] || "") +
        "</span>" +
        '<span class="card-badge card-badge--right">' +
        (TIPO_LABELS[p.tipo] || "") +
        "</span>" +
        '<button type="button" class="wishlist-heart' + (enWishlist ? " activo" : "") + '" data-id="' + p.id + '" onclick="event.stopPropagation(); toggleWishlist(\'' + p.id + '\');" aria-label="Guardar en wishlist"><i class="bi ' + (enWishlist ? "bi-heart-fill" : "bi-heart") + '"></i></button>' +
        '<div class="card-img-wrapper">' +
        '<span class="card-badge card-badge--ml"><i class="bi bi-cloud-fill"></i> ' +
        p.ml +
        " ML</span>" +
        '<img src="' +
        p.imagen +
        '" class="card-img-top" alt="' +
        p.nombre +
        '"></div>' +
        '<div class="card-body text-center p-4 d-flex flex-column justify-content-between">' +
        '<div>' +
        alertaStock +
        '<span class="fs-7 text-uppercase text-gold-light tracking-wider d-block">' +
        p.estacion +
        " · " +
        (FAMILIA_LABELS[p.familia] || p.familia) +
        "</span>" +
        '<span class="card-brand d-block fs-7 text-uppercase tracking-wider">' +
        (p.marca || "") +
        "</span>" +
        '<h3 class="card-title h5 luxury-title">' +
        p.nombre +
        "</h3>" +
        '<div class="mood-chip-list justify-content-center mb-2">' +
        moods +
        "</div>" +
        "</div>" +
        '<div><span class="price d-block fs-5 my-3">$' +
        p.precio.toLocaleString("es-CL") +
        "</span>" +
        '<a href="producto.html?id=' +
        p.id +
        '" class="btn btn-luxury w-100 mb-2">Descubrir</a>' +
        '<button class="btn btn-luxury btn-luxury--primary w-100" onclick="agregarCarrito(\'' +
        p.id +
        "')\">Añadir</button></div>" +
        "</div></article></div>"
    );
}

function crearTarjetaMujer(p) {
    var alertaStock = p.stock <= p.stockCritico
        ? '<span class="badge bg-danger mb-2 d-inline-block">¡Últimas unidades!</span>'
        : "";
    var moods = (p.humor || []).map(chipHumor).join("");
    var enWishlist = estaEnWishlist(p.id);

    return (
        '<div class="col-12 col-md-6 col-lg-3">' +
        '<article class="card luxury-card h-100 border-0">' +
        '<span class="card-badge card-badge--left">' +
        (CONCENTRACION_LABELS[p.concentracion] || "") +
        "</span>" +
        '<span class="card-badge card-badge--right">' +
        (TIPO_LABELS[p.tipo] || "") +
        "</span>" +
        '<button type="button" class="wishlist-heart' + (enWishlist ? " activo" : "") + '" data-id="' + p.id + '" onclick="event.stopPropagation(); toggleWishlist(\'' + p.id + '\');" aria-label="Guardar en wishlist"><i class="bi ' + (enWishlist ? "bi-heart-fill" : "bi-heart") + '"></i></button>' +
        '<div class="card-img-wrapper">' +
        '<span class="card-badge card-badge--ml"><i class="bi bi-cloud-fill"></i> ' +
        p.ml +
        " ML</span>" +
        '<img src="' +
        p.imagen +
        '" class="card-img-top" alt="' +
        p.nombre +
        '"></div>' +
        '<div class="card-body text-center p-4 d-flex flex-column justify-content-between">' +
        '<div>' +
        alertaStock +
        '<span class="fs-7 text-uppercase text-gold-light tracking-wider d-block">' +
        p.estacion +
        " · " +
        (FAMILIA_LABELS[p.familia] || p.familia) +
        "</span>" +
        '<span class="card-brand d-block fs-7 text-uppercase tracking-wider">' +
        (p.marca || "") +
        "</span>" +
        '<h3 class="card-title h5 luxury-title">' +
        p.nombre +
        "</h3>" +
        '<div class="mood-chip-list justify-content-center mb-2">' +
        moods +
        "</div>" +
        "</div>" +
        '<div><span class="price d-block fs-5 my-3">$' +
        p.precio.toLocaleString("es-CL") +
        "</span>" +
        '<a href="producto.html?id=' +
        p.id +
        '" class="btn btn-luxury w-100 mb-2">Descubrir</a>' +
        '<button class="btn btn-luxury btn-luxury--primary w-100" onclick="agregarCarrito(\'' +
        p.id +
        "')\">Añadir</button></div>" +
        "</div></article></div>"
    );
}

function crearTarjetaHombre(p) {
    var alertaStock = p.stock <= p.stockCritico
        ? '<span class="badge bg-danger mb-2 d-inline-block">¡Últimas unidades!</span>'
        : "";
    var moods = (p.humor || []).map(chipHumor).join("");
    var enWishlist = estaEnWishlist(p.id);

    return (
        '<div class="col-12 col-md-6 col-lg-3">' +
        '<article class="card luxury-card h-100 border-0">' +
        '<span class="card-badge card-badge--left">' +
        (CONCENTRACION_LABELS[p.concentracion] || "") +
        "</span>" +
        '<span class="card-badge card-badge--right">' +
        (TIPO_LABELS[p.tipo] || "") +
        "</span>" +
        '<button type="button" class="wishlist-heart' + (enWishlist ? " activo" : "") + '" data-id="' + p.id + '" onclick="event.stopPropagation(); toggleWishlist(\'' + p.id + '\');" aria-label="Guardar en wishlist"><i class="bi ' + (enWishlist ? "bi-heart-fill" : "bi-heart") + '"></i></button>' +
        '<div class="card-img-wrapper">' +
        '<span class="card-badge card-badge--ml"><i class="bi bi-cloud-fill"></i> ' +
        p.ml +
        " ML</span>" +
        '<img src="' +
        p.imagen +
        '" class="card-img-top" alt="' +
        p.nombre +
        '"></div>' +
        '<div class="card-body text-center p-4 d-flex flex-column justify-content-between">' +
        '<div>' +
        alertaStock +
        '<span class="fs-7 text-uppercase text-gold-light tracking-wider d-block">' +
        p.estacion +
        " · " +
        (FAMILIA_LABELS[p.familia] || p.familia) +
        "</span>" +
        '<span class="card-brand d-block fs-7 text-uppercase tracking-wider">' +
        (p.marca || "") +
        "</span>" +
        '<h3 class="card-title h5 luxury-title">' +
        p.nombre +
        "</h3>" +
        '<div class="mood-chip-list justify-content-center mb-2">' +
        moods +
        "</div>" +
        "</div>" +
        '<div><span class="price d-block fs-5 my-3">$' +
        p.precio.toLocaleString("es-CL") +
        "</span>" +
        '<a href="producto.html?id=' +
        p.id +
        '" class="btn btn-luxury w-100 mb-2">Descubrir</a>' +
        '<button class="btn btn-luxury btn-luxury--primary w-100" onclick="agregarCarrito(\'' +
        p.id +
        "')\">Añadir</button></div>" +
        "</div></article></div>"
    );
}

function crearTarjetaUnisex(p) {
    var alertaStock = p.stock <= p.stockCritico
        ? '<span class="badge bg-danger mb-2 d-inline-block">¡Últimas unidades!</span>'
        : "";
    var moods = (p.humor || []).map(chipHumor).join("");
    var enWishlist = estaEnWishlist(p.id);

    return (
        '<div class="col-12 col-md-6 col-lg-3">' +
        '<article class="card luxury-card h-100 border-0">' +
        '<span class="card-badge card-badge--left">' +
        (CONCENTRACION_LABELS[p.concentracion] || "") +
        "</span>" +
        '<span class="card-badge card-badge--right">' +
        (TIPO_LABELS[p.tipo] || "") +
        "</span>" +
        '<button type="button" class="wishlist-heart' + (enWishlist ? " activo" : "") + '" data-id="' + p.id + '" onclick="event.stopPropagation(); toggleWishlist(\'' + p.id + '\');" aria-label="Guardar en wishlist"><i class="bi ' + (enWishlist ? "bi-heart-fill" : "bi-heart") + '"></i></button>' +
        '<div class="card-img-wrapper">' +
        '<span class="card-badge card-badge--ml"><i class="bi bi-cloud-fill"></i> ' +
        p.ml +
        " ML</span>" +
        '<img src="' +
        p.imagen +
        '" class="card-img-top" alt="' +
        p.nombre +
        '"></div>' +
        '<div class="card-body text-center p-4 d-flex flex-column justify-content-between">' +
        '<div>' +
        alertaStock +
        '<span class="fs-7 text-uppercase text-gold-light tracking-wider d-block">' +
        p.estacion +
        " · " +
        (FAMILIA_LABELS[p.familia] || p.familia) +
        "</span>" +
        '<span class="card-brand d-block fs-7 text-uppercase tracking-wider">' +
        (p.marca || "") +
        "</span>" +
        '<h3 class="card-title h5 luxury-title">' +
        p.nombre +
        "</h3>" +
        '<div class="mood-chip-list justify-content-center mb-2">' +
        moods +
        "</div>" +
        "</div>" +
        '<div><span class="price d-block fs-5 my-3">$' +
        p.precio.toLocaleString("es-CL") +
        "</span>" +
        '<a href="producto.html?id=' +
        p.id +
        '" class="btn btn-luxury w-100 mb-2">Descubrir</a>' +
        '<button class="btn btn-luxury btn-luxury--primary w-100" onclick="agregarCarrito(\'' +
        p.id +
        "')\">Añadir</button></div>" +
        "</div></article></div>"
    );
}

function crearTarjetaDestacado(p) {
    var alertaStock = p.stock <= p.stockCritico
        ? '<span class="badge bg-danger mb-2 d-inline-block">¡Últimas unidades!</span>'
        : "";
    var moods = (p.humor || []).map(chipHumor).join("");
    var enWishlist = estaEnWishlist(p.id);

    return (
        '<div class="col-12 col-md-6 col-lg-3">' +
        '<article class="card luxury-card h-100 border-0">' +
        '<span class="card-badge card-badge--left">' +
        (CONCENTRACION_LABELS[p.concentracion] || "") +
        "</span>" +
        '<span class="card-badge card-badge--right">' +
        (TIPO_LABELS[p.tipo] || "") +
        "</span>" +
        '<button type="button" class="wishlist-heart' + (enWishlist ? " activo" : "") + '" data-id="' + p.id + '" onclick="event.stopPropagation(); toggleWishlist(\'' + p.id + '\');" aria-label="Guardar en wishlist"><i class="bi ' + (enWishlist ? "bi-heart-fill" : "bi-heart") + '"></i></button>' +
        '<div class="card-img-wrapper">' +
        '<span class="card-badge card-badge--ml"><i class="bi bi-cloud-fill"></i> ' +
        p.ml +
        " ML</span>" +
        '<img src="' +
        p.imagen +
        '" class="card-img-top" alt="' +
        p.nombre +
        '"></div>' +
        '<div class="card-body text-center p-4 d-flex flex-column justify-content-between">' +
        '<div>' +
        alertaStock +
        '<span class="fs-7 text-uppercase text-gold-light tracking-wider d-block">' +
        p.estacion +
        " · " +
        (FAMILIA_LABELS[p.familia] || p.familia) +
        "</span>" +
        '<span class="card-brand d-block fs-7 text-uppercase tracking-wider">' +
        (p.marca || "") +
        "</span>" +
        '<h3 class="card-title h5 luxury-title">' +
        p.nombre +
        "</h3>" +
        '<div class="mood-chip-list justify-content-center mb-2">' +
        moods +
        "</div>" +
        "</div>" +
        '<div><span class="price d-block fs-5 my-3">$' +
        p.precio.toLocaleString("es-CL") +
        "</span>" +
        '<a href="producto.html?id=' +
        p.id +
        '" class="btn btn-luxury w-100 mb-2">Descubrir</a>' +
        '<button class="btn btn-luxury btn-luxury--primary w-100" onclick="agregarCarrito(\'' +
        p.id +
        "')\">Añadir</button></div>" +
        "</div></article></div>"
    );
}

function crearSlideLanzamiento(p, activo) {
    var estacionTexto = p.estacion.charAt(0).toUpperCase() + p.estacion.slice(1);

    return (
        '<div class="carousel-item' + (activo ? " active" : "") + '">' +
        '<div class="row g-0 align-items-center launch-slide">' +
        '<div class="col-md-6 launch-img-wrapper"><img src="' +
        p.imagen +
        '" alt="' +
        p.nombre +
        '" class="launch-img"></div>' +
        '<div class="col-md-6 p-4 p-lg-5">' +
        '<span class="text-gold text-uppercase fs-7 tracking-wider">Nuevo · ' +
        estacionTexto +
        "</span>" +
        '<span class="d-block fs-7 text-uppercase tracking-wider text-gold-light mt-1">' +
        (p.marca || "") +
        "</span>" +
        '<h3 class="luxury-title launch-title fst-italic display-6 mt-2">' +
        p.nombre +
        "</h3>" +
        '<p class="text-gold-light my-3">' +
        p.descripcion +
        "</p>" +
        renderInspiradoEn(p, true) +
        '<p class="fs-7 text-uppercase text-gold tracking-wider mb-3 mt-2">Familia: <span class="text-gold-light">' +
        (FAMILIA_LABELS[p.familia] || p.familia) +
        "</span></p>" +
        '<h4 class="price launch-price mb-3">$' +
        p.precio.toLocaleString("es-CL") +
        "</h4>" +
        '<a href="producto.html?id=' +
        p.id +
        '" class="btn btn-luxury me-2">Ver producto</a>' +
        '<button class="btn btn-luxury btn-luxury--fill" onclick="agregarCarrito(\'' +
        p.id +
        "')\">Añadir al carrito <i class=\"bi bi-bag ms-1\"></i></button>" +
        "</div></div></div>"
    );
}

function inicializarNuevosLanzamientos() {
    var contenedor = document.getElementById("carruselLanzamientosInner");
    if (!contenedor) return;

    var lista = obtenerLista().slice(-3);

    contenedor.innerHTML = lista
        .map(function (p, indice) {
            return crearSlideLanzamiento(p, indice === 0);
        })
        .join("");
}

function agruparEnBloques(lista, tamano) {
    var bloques = [];

    for (var i = 0; i < lista.length; i += tamano) {
        bloques.push(lista.slice(i, i + tamano));
    }

    return bloques;
}

function renderCarruselGenero(idInner, genero, maxProductos, porSlide, tarjetaFn) {
    var contenedor = document.getElementById(idInner);
    if (!contenedor) return;

    var crear = tarjetaFn || crearTarjeta;

    var lista = obtenerLista()
        .filter(function (p) {
            return p.genero === genero;
        })
        .slice(0, maxProductos);

    if (lista.length === 0) {
        contenedor.innerHTML = '<div class="carousel-item active"><p class="text-center text-gold-light py-4">Próximamente nuevos productos en esta colección.</p></div>';
        return;
    }

    var bloques = agruparEnBloques(lista, porSlide);

    contenedor.innerHTML = bloques
        .map(function (bloque, indice) {
            var tarjetas = bloque
                .map(function (p) {
                    return crear(p);
                })
                .join("");
            return '<div class="carousel-item' + (indice === 0 ? " active" : "") + '"><div class="row g-4 justify-content-center">' + tarjetas + "</div></div>";
        })
        .join("");
}

function inicializarCarruselesGenero() {
    renderCarruselGenero("carruselMujerInner", "mujer", 8, 4, crearTarjetaMujer);
    renderCarruselGenero("carruselHombreInner", "hombre", 8, 4, crearTarjetaHombre);
    renderCarruselGenero("carruselUnisexInner", "unisex", 8, 4, crearTarjetaUnisex);
}

function renderDestacados() {
    var contenedor = document.getElementById("destacadosGrid");
    if (!contenedor) return;

    var lista = obtenerLista().slice(0, 4);

    contenedor.innerHTML = lista
        .map(function (p) {
            return crearTarjetaDestacado(p);
        })
        .join("");
}


/* ==========================================================================
   CATÁLOGO Y FILTROS (página productos.html)
   ========================================================================== */
function leerFiltrosMarcados() {
    var grupos = {};

    document.querySelectorAll(".filtro-check-list").forEach(function (lista) {
        var grupo = lista.dataset.grupo;
        var checks = lista.querySelectorAll("input[type=checkbox]:checked");
        grupos[grupo] = Array.from(checks, function (input) {
            return input.value;
        });
    });

    return grupos;
}

function ordenarProductos(lista, orden) {
    var copia = lista.slice();

    if (orden === "precio-asc") {
        copia.sort(function (a, b) {
            return a.precio - b.precio;
        });
    } else if (orden === "precio-desc") {
        copia.sort(function (a, b) {
            return b.precio - a.precio;
        });
    } else if (orden === "nombre-az") {
        copia.sort(function (a, b) {
            return a.nombre.localeCompare(b.nombre, "es");
        });
    }

    return copia;
}

function renderProductosFiltrados() {
    var contenedor = document.getElementById("productosGrid");
    var resultado = document.getElementById("productosResultado");
    var lista = obtenerLista();

    var genero = new URLSearchParams(window.location.search).get("genero");
    if (genero) {
        lista = lista.filter(function (p) {
            return p.genero === genero;
        });
    }

    var buscar = new URLSearchParams(window.location.search).get("buscar");
    if (buscar) {
        var textoBuscar = buscar.trim().toLowerCase();
        lista = lista.filter(function (p) {
            return (p.nombre + " " + p.marca).toLowerCase().indexOf(textoBuscar) !== -1;
        });
    }

    var filtros = leerFiltrosMarcados();

    ["humor", "estacion", "tipo", "concentracion", "familia", "ml"].forEach(function (grupo) {
        var seleccion = filtros[grupo];
        if (seleccion && seleccion.length > 0) {
            lista = lista.filter(function (p) {
                var valor = grupo === "ml" ? String(p.ml) : p[grupo];
                if (Array.isArray(valor)) {
                    return seleccion.some(function (v) {
                        return valor.indexOf(v) !== -1;
                    });
                }
                return seleccion.indexOf(valor) !== -1;
            });
        }
    });

    var ordenarSelect = document.getElementById("ordenarSelect");
    lista = ordenarProductos(lista, ordenarSelect ? ordenarSelect.value : "destacados");

    contenedor.innerHTML = "";
    lista.forEach(function (p) {
        contenedor.innerHTML += crearTarjeta(p);
    });

    if (resultado) {
        resultado.textContent = lista.length + (lista.length === 1 ? " producto encontrado" : " productos encontrados");
    }
}

function inicializarFiltrosProductos() {
    var parametros = new URLSearchParams(window.location.search);
    var estacionUrl = parametros.get("estacion");

    if (estacionUrl) {
        var checkEstacion = document.querySelector('.filtro-check-list[data-grupo="estacion"] input[value="' + estacionUrl + '"]');
        if (checkEstacion) checkEstacion.checked = true;
    }

    document.querySelectorAll(".filtro-check-list input[type=checkbox]").forEach(function (input) {
        input.addEventListener("change", renderProductosFiltrados);
    });

    var ordenarSelect = document.getElementById("ordenarSelect");
    if (ordenarSelect) {
        ordenarSelect.addEventListener("change", renderProductosFiltrados);
    }

    var limpiar = document.getElementById("limpiarFiltros");
    if (limpiar) {
        limpiar.addEventListener("click", function () {
        document.querySelectorAll(".filtro-check-list input[type=checkbox]").forEach(function (input) {
            input.checked = false;
        });
        if (ordenarSelect) ordenarSelect.value = "destacados";
    
        var generoActual = new URLSearchParams(window.location.search).get("genero");
        var nuevaUrl = window.location.pathname + (generoActual ? "?genero=" + generoActual : "");
        history.replaceState(null, "", nuevaUrl);
    
        renderProductosFiltrados();
    });
    }

    renderProductosFiltrados();
}


/* ==========================================================================
    DETALLE DE PRODUCTO (página producto.html)
   ========================================================================== */
function mostrarDetalle() {
    var id = new URLSearchParams(window.location.search).get("id");
    var producto = obtenerLista().find(function (p) {
        return p.id === id;
    });

    if (!producto) {
        var maridajeElVacio = document.getElementById("maridajeProducto");
        if (maridajeElVacio) maridajeElVacio.innerHTML = '<div class="container"><div class="alert alert-luxury">Producto no encontrado.</div></div>';
        return;
    }

    var tema = temaDeProducto(producto);
    document.body.classList.add("tema-" + tema);

    var navClaro = (typeof producto.navClaro === "boolean")
        ? producto.navClaro
        : (tema === "verano" || tema === "primavera");

    if (navClaro) {
        document.body.classList.add("nav-claro");
    }

    if (producto.colores) {
        Object.keys(producto.colores).forEach(function (key) {
            document.body.style.setProperty("--" + key, producto.colores[key]);
        });
    }

    var breadcrumbNombre = document.getElementById("breadcrumbActual");
    if (breadcrumbNombre) breadcrumbNombre.textContent = producto.nombre;

    var heroEl = document.getElementById("heroProducto");
    if (heroEl) heroEl.innerHTML = renderHero(producto);

    var piramideEl = document.getElementById("piramideProducto");
    if (piramideEl) piramideEl.innerHTML = renderPiramideOlfativa(producto);

    var maridajeEl = document.getElementById("maridajeProducto");
    if (maridajeEl) maridajeEl.innerHTML = renderMaridaje(producto);

    var historiaEl = document.getElementById("historiaProducto");
    if (historiaEl) historiaEl.innerHTML = renderHistoria(producto);

    var reviewsEl = document.getElementById("reviewsProducto");
    if (reviewsEl) reviewsEl.innerHTML = renderReviews(producto);

    var ctaEl = document.getElementById("ctaProducto");
    if (ctaEl) ctaEl.innerHTML = renderCTA(producto);

    if (producto.fondoPagina) {
        ["piramideProducto", "maridajeProducto", "reviewsProducto"].forEach(function (idSeccion) {
            var el = document.getElementById(idSeccion);
            if (!el) return;
            el.style.backgroundImage = "url('" + producto.fondoPagina + "')";
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
            el.style.backgroundRepeat = "no-repeat";
        });

        // La historia solo recibe el fondo general si el producto no trae su propia imagen de historia
        if (historiaEl && !producto.historiaImagen) {
            historiaEl.style.backgroundImage = "url('" + producto.fondoPagina + "')";
            historiaEl.style.backgroundSize = "cover";
            historiaEl.style.backgroundPosition = "center";
            historiaEl.style.backgroundRepeat = "no-repeat";
        }
    }

    llenarModalCompra(producto);
}

function renderHero(producto) {
    if (producto.heroFondo) {
        if (producto.heroAjuste === "contain") {
            return (
                '<div class="hero-producto hero-producto--contain">' +
                '<img src="' + producto.heroFondo + '" alt="' + producto.nombre + '" class="hero-producto--contain-img">' +
                '<a href="#piramideProducto" class="hero-scroll-btn">Descubrir el aroma ↓</a>' +
                "</div>"
            );
        }
        return (
            '<div class="hero-producto hero-producto--imagen" style="background-image:url(\'' +
            producto.heroFondo +
            '\')">' +
            '<a href="#piramideProducto" class="hero-scroll-btn">Descubrir el aroma ↓</a>' +
            "</div>"
        );
    }

    return (
        '<div class="hero-producto hero-producto--fallback">' +
        '<img src="' +
        producto.imagen +
        '" alt="' +
        producto.nombre +
        '">' +
        '<h1 class="hero-nombre">' +
        producto.nombre +
        "</h1>" +
        '<p class="hero-tagline">' +
        (producto.descripcion || "") +
        "</p>" +
        '<a href="#piramideProducto" class="hero-scroll-btn">Descubrir el aroma ↓</a>' +
        "</div>"
    );
}

function renderHistoria(producto) {
    var titulo = producto.historiaTitulo || "Nuestra Historia";
    var texto =
        producto.historia ||
        producto.descripcion ||
        "Una fragancia pensada para acompañar cada momento, elaborada con ingredientes cuidadosamente seleccionados para dejar una impresión inolvidable.";

    var conImagen = !!producto.historiaImagen;

    return (
        '<div class="historia-producto' +
        (conImagen ? "" : " historia-producto--fallback") +
        '"' +
        (conImagen ? ' style="background-image:url(\'' + producto.historiaImagen + '\')"' : "") +
        ">" +
        '<div class="historia-contenido">' +
        '<span class="text-tema-dorado text-uppercase tracking-wider fs-7">Nuestra Historia</span>' +
        '<h3 class="titulo mt-2">' +
        titulo +
        "</h3>" +
        "<p>" +
        texto +
        "</p>" +
        "</div>" +
        "</div>"
    );
}

function renderReviews(producto) {
    var elegidas = resenasDeProducto(producto.id);
    var promedio = (elegidas.reduce(function (acc, r) { return acc + r.estrellas; }, 0) / elegidas.length).toFixed(1);

    var cards = elegidas
        .map(function (r) {
            return (
                '<div class="col-md-4">' +
                '<div class="review-card">' +
                '<span class="estrellas">' +
                estrellasHtml(r.estrellas) +
                "</span>" +
                "<p>“" +
                r.texto +
                "”</p>" +
                '<div class="d-flex align-items-center gap-2 mt-3">' +
                '<span class="review-avatar">' +
                iniciales(r.nombre) +
                "</span>" +
                '<span class="review-nombre">' +
                r.nombre +
                "</span>" +
                "</div>" +
                "</div>" +
                "</div>"
            );
        })
        .join("");

    return (
        '<section class="reviews-section">' +
        '<div class="container">' +
        '<div class="text-center mb-4">' +
        '<span class="text-tema-dorado text-uppercase tracking-wider fs-7">Reseñas</span>' +
        '<h3 class="luxury-title fst-italic mb-1">' +
        promedio +
        ' <span class="estrellas">★</span></h3>' +
        "</div>" +
        '<div class="row g-4">' +
        cards +
        "</div>" +
        "</div>" +
        "</section>"
    );
}

function renderCTA(producto) {
    var titulo = producto.ctaTitulo || "Vive la experiencia " + producto.nombre;
    var texto = producto.ctaTexto || "Eleva tu presencia con una fragancia que habla por ti.";
    var conImagen = !!producto.ctaFondo;

    return (
        '<div class="cta-producto' +
        (conImagen ? "" : " cta-producto--fallback") +
        '"' +
        (conImagen ? ' style="background-image:url(\'' + producto.ctaFondo + '\')"' : "") +
        ">" +
        '<div class="cta-contenido">' +
        "<h3>" +
        titulo +
        "</h3>" +
        "<p>" +
        texto +
        "</p>" +
        '<button class="btn btn-outline-luxury" data-bs-toggle="modal" data-bs-target="#modalCompra">Comprar Ahora</button>' +
        "</div>" +
        "</div>"
    );
}

function llenarModalCompra(producto) {
    var modal = document.getElementById("modalCompra");
    if (!modal) return;

    var agotado = producto.stock <= 0;
    var opcionesCantidad = "";
    for (var i = 1; i <= Math.min(producto.stock, 10); i++) {
        opcionesCantidad += '<option value="' + i + '">' + i + "</option>";
    }

    modal.querySelector(".modal-compra-nombre").textContent = producto.nombre;
    modal.querySelector(".modal-compra-marca").textContent = producto.marca || "";
    modal.querySelector(".modal-compra-precio").textContent = "$" + producto.precio.toLocaleString("es-CL");
    modal.querySelector(".modal-compra-imagen").src = producto.imagen;
    modal.querySelector(".modal-compra-imagen").alt = producto.nombre;

    var cuerpo = modal.querySelector(".modal-compra-cuerpo");
    cuerpo.innerHTML = agotado
        ? '<button class="btn btn-luxury w-100" disabled>Sin stock</button>'
        : '<div class="d-flex align-items-center gap-3 mb-3 flex-wrap">' +
          '<label class="fs-7 text-uppercase text-gold-light mb-0">Cantidad</label>' +
          '<select id="cantidadProducto" class="form-select form-luxury w-auto">' +
          opcionesCantidad +
          "</select>" +
          '<span class="fs-7 text-gold-light">Stock: ' +
          producto.stock +
          " uds.</span>" +
          "</div>" +
          '<button class="btn btn-luxury w-100" data-bs-dismiss="modal" onclick="agregarCarritoConCantidad(\'' +
          producto.id +
          "')\">Añadir al carrito</button>";
}

function renderPiramideOlfativa(producto) {
    if (!producto.notas) return "";

    var etapas = [
        { key: "salida", label: "Notas de Salida", texto: "Una apertura vibrante que despierta los sentidos." },
        { key: "corazon", label: "Notas de Corazón", texto: "Un corazón cálido que revela su verdadero carácter." },
        { key: "fondo", label: "Notas de Fondo", texto: "Una base envolvente que deja huella duradera." },
    ];

    var imagenes = producto.notasImagenes || {};

    var cards = etapas
        .map(function (e) {
            var img = imagenes[e.key]
                ? '<img src="' + imagenes[e.key] + '" alt="' + e.label + '" class="piramide-etapa-img">'
                : "";
            return (
                '<div class="col-md-4">' +
                '<div class="piramide-etapa-card piramide-etapa-card--' +
                e.key +
                '">' +
                img +
                "</div>" +
                "</div>"
            );
        })
        .join("");

    var fondoAttr = producto.piramideFondo
        ? ' style="background-image:url(\'' + producto.piramideFondo + '\')"'
        : "";

    return (
        '<div class="piramide-section"' +
        fondoAttr +
        ">" +
        '<div class="container">' +
        '<div class="text-center mb-5">' +
        '<span class="text-tema-dorado text-uppercase tracking-wider fs-7">La Fragancia</span>' +
        '<h3 class="luxury-title fst-italic mb-0">Un viaje sensorial a través de la noche</h3>' +
        "</div>" +
        '<div class="row g-4">' +
        cards +
        "</div>" +
        "</div>" +
        "</div>"
    );
}

function renderMaridaje(producto) {
    var ocasiones = (producto.maridaje || []).map(chipOcasion).join("");
    var moods = (producto.humor || []).map(chipHumor).join("");
    if (!ocasiones && !moods) return "";

    return (
        '<div class="maridaje-section">' +
        '<div class="maridaje-contenido">' +
        '<span class="text-tema-dorado text-uppercase tracking-wider fs-7">Maridaje</span>' +
        '<h3 class="luxury-title fst-italic mb-4">Ideal Para</h3>' +
        (ocasiones ? '<div class="occasion-chip-list mb-3 justify-content-center">' + ocasiones + "</div>" : "") +
        (moods ? '<div class="mood-chip-list justify-content-center">' + moods + "</div>" : "") +
        "</div>" +
        "</div>"
    );
}


/* ==========================================================================
   WISHLIST
   ========================================================================== */
function obtenerWishlist() {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

function estaEnWishlist(id) {
    return obtenerWishlist().indexOf(id) !== -1;
}

function toggleWishlist(id) {
    var lista = obtenerWishlist();
    var indice = lista.indexOf(id);

    if (indice === -1) {
        lista.push(id);
    } else {
        lista.splice(indice, 1);
    }

    localStorage.setItem("wishlist", JSON.stringify(lista));
    actualizarContadorWishlist();

    var activo = estaEnWishlist(id);
    document.querySelectorAll('.wishlist-heart[data-id="' + id + '"]').forEach(function (boton) {
        boton.classList.toggle("activo", activo);
        boton.innerHTML = '<i class="bi ' + (activo ? "bi-heart-fill" : "bi-heart") + '"></i>';
    });

    if (document.getElementById("wishlistGrid")) {
        mostrarWishlist();
    }
}

function actualizarContadorWishlist() {
    var cantidad = obtenerWishlist().length;
    document.querySelectorAll(".wishlist-count").forEach(function (elemento) {
        elemento.textContent = cantidad;
    });
}

function mostrarWishlist() {
    var contenedor = document.getElementById("wishlistGrid");
    var vacio = document.getElementById("wishlistVacio");
    if (!contenedor) return;

    var ids = obtenerWishlist();
    var lista = obtenerLista().filter(function (p) { return ids.indexOf(p.id) !== -1; });

    if (lista.length === 0) {
        contenedor.innerHTML = "";
        contenedor.classList.add("d-none");
        if (vacio) vacio.classList.remove("d-none");
        return;
    }

    contenedor.classList.remove("d-none");
    if (vacio) vacio.classList.add("d-none");

    contenedor.innerHTML = "";
    lista.forEach(function (p) {
        contenedor.innerHTML += crearTarjeta(p);
    });
}


/* ==========================================================================
   CARRITO Y CUPONES
   ========================================================================== */
function actualizarContador() {
    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    var cantidad = 0;
    carrito.forEach(function (p) {
        cantidad += p.cantidad;
    });

    document.querySelectorAll(".cart-count").forEach(function (elemento) {
        elemento.textContent = cantidad;
    });
}

function agregarCarrito(id) {
    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    var producto = obtenerLista().find(function (p) {
        return p.id === id;
    });

    if (!producto) return;

    var existente = carrito.find(function (p) {
        return p.id === id;
    });

    if (existente) {
        if (existente.cantidad < producto.stock) {
            existente.cantidad++;
        } else {
            alert("No hay más stock disponible.");
            return;
        }
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1,
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();

    var cantidadEnCarrito = existente ? existente.cantidad : 1;
    var stockRestante = producto.stock - cantidadEnCarrito;

    if (stockRestante <= producto.stockCritico) {
        mostrarToast("Producto agregado al carrito. Quedan pocas unidades.", "aviso");
    } else {
        mostrarToast("Producto agregado al carrito.");
    }
}

function agregarCarritoConCantidad(id) {
    var selector = document.getElementById("cantidadProducto");
    var cantidad = selector ? parseInt(selector.value, 10) : 1;
    if (!cantidad || cantidad < 1) cantidad = 1;

    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    var producto = obtenerLista().find(function (p) {
        return p.id === id;
    });
    if (!producto) return;

    var existente = carrito.find(function (p) {
        return p.id === id;
    });
    var totalDeseado = (existente ? existente.cantidad : 0) + cantidad;

    if (totalDeseado > producto.stock) {
        alert("No hay stock suficiente. Disponible: " + producto.stock + " uds.");
        return;
    }

    if (existente) {
        existente.cantidad = totalDeseado;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad,
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();

    var stockRestante = producto.stock - totalDeseado;
    if (stockRestante <= producto.stockCritico) {
        mostrarToast("Producto agregado al carrito. Quedan pocas unidades.", "aviso");
    } else {
        mostrarToast("Producto agregado al carrito.");
    }
}

function mostrarCarrito() {
    var lista = document.getElementById("carritoLista");
    var totalElemento = document.getElementById("carritoTotal");
    var subtotalElemento = document.getElementById("carritoSubtotal");
    var lineaDescuento = document.getElementById("carritoDescuentoLinea");
    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    if (carrito.length === 0) {
        lista.innerHTML = '<p class="text-center text-gold-light py-5">Tu carrito está vacío.</p>';
        totalElemento.textContent = "$0";
        subtotalElemento.textContent = "$0";
        lineaDescuento.style.display = "none";
        return;
    }

    var subtotal = 0;
    lista.innerHTML = "";

    carrito.forEach(function (p, indice) {
        var importe = p.precio * p.cantidad;
        subtotal += importe;

                lista.innerHTML +=
            '<div class="cart-item">' +
            '<div class="cart-item-img"><img src="' +
            p.imagen +
            '" alt="' +
            p.nombre +
            '"></div>' +
            '<div class="cart-item-info"><h3 class="cart-item-name">' +
            p.nombre +
            '</h3><span class="cart-item-price">$' +
            p.precio.toLocaleString("es-CL") +
            " c/u</span></div>" +
            '<div class="cart-item-qty"><button class="qty-btn" onclick="cambiarCantidad(' +
            indice +
            ',-1)">-</button><span class="qty-value">' +
            p.cantidad +
            '</span><button class="qty-btn" onclick="cambiarCantidad(' +
            indice +
            ',1)">+</button></div>' +
            '<div class="cart-item-subtotal">$' +
            importe.toLocaleString("es-CL") +
            "</div>" +
            '<button class="cart-item-remove" onclick="eliminarCarrito(' +
            indice +
            ')" aria-label="Eliminar"><i class="bi bi-trash"></i></button></div>';
    });

    var cuponCodigo = localStorage.getItem("cuponAplicado");
    var descuento = cuponCodigo && CUPONES[cuponCodigo] ? subtotal * CUPONES[cuponCodigo] : 0;
    var total = subtotal - descuento;

    subtotalElemento.textContent = "$" + subtotal.toLocaleString("es-CL");

    if (descuento > 0) {
        document.getElementById("carritoDescuento").textContent = "-$" + descuento.toLocaleString("es-CL");
        lineaDescuento.style.display = "flex";
    } else {
        lineaDescuento.style.display = "none";
    }

    totalElemento.textContent = "$" + total.toLocaleString("es-CL");
}

function cambiarCantidad(indice, cambio) {
    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    var item = carrito[indice];
    if (!item) return;

    if (cambio > 0) {
        var producto = obtenerLista().find(function (p) {
            return p.id === item.id;
        });
        var stockDisponible = producto ? producto.stock : Infinity;

        if (item.cantidad >= stockDisponible) {
            mostrarToast("No hay más stock disponible de " + item.nombre + ".", "aviso");
            return;
        }
    }

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContador();
}

function eliminarCarrito(indice) {
    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    carrito.splice(indice, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContador();
}

var CUPONES = {
    LUXURY10: 0.1,
    BIENVENIDO15: 0.15,
};

function aplicarCupon() {
    var input = document.getElementById("cuponInput");
    var mensaje = document.getElementById("cuponMensaje");
    var codigo = input.value.trim().toUpperCase();

    if (!codigo) {
        mensaje.textContent = "Ingresa un código de cupón.";
        mensaje.className = "d-block mt-1 text-danger";
        return;
    }

    if (!CUPONES.hasOwnProperty(codigo)) {
        localStorage.removeItem("cuponAplicado");
        mensaje.textContent = "Cupón no válido.";
        mensaje.className = "d-block mt-1 text-danger";
        mostrarCarrito();
        return;
    }

    localStorage.setItem("cuponAplicado", codigo);
    mensaje.textContent = "Cupón aplicado: " + CUPONES[codigo] * 100 + "% de descuento.";
    mensaje.className = "d-block mt-1 text-success";
    mostrarCarrito();
}

function irAPagar() {
    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    window.location.href = "pago.html";
}


/* ==========================================================================
   PASARELA DE PAGO (simulada)
   ========================================================================== */
function inicializarPago() {
    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    if (carrito.length === 0) {
        window.location.href = "carrito.html";
        return;
    }

    renderResumenPago();

    var form = document.getElementById("pagoForm");
    form.addEventListener("submit", procesarPago);
    activarValidacionEnVivo(form);

    var inputTarjeta = document.getElementById("numeroTarjeta");
    if (inputTarjeta) {
        inputTarjeta.addEventListener("input", function () {
            var limpio = inputTarjeta.value.replace(/\D/g, "").slice(0, 19);
            inputTarjeta.value = limpio.replace(/(.{4})/g, "$1 ").trim();
        });
    }

    var inputVencimiento = document.getElementById("vencimiento");
    if (inputVencimiento) {
        inputVencimiento.addEventListener("input", function () {
            var limpio = inputVencimiento.value.replace(/\D/g, "").slice(0, 4);
            inputVencimiento.value = limpio.length > 2 ? limpio.slice(0, 2) + "/" + limpio.slice(2) : limpio;
        });
    }

    var inputCvv = document.getElementById("cvv");
    if (inputCvv) {
        inputCvv.addEventListener("input", function () {
            inputCvv.value = inputCvv.value.replace(/\D/g, "").slice(0, 4);
        });
    }
}

function renderResumenPago() {
    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    var lista = document.getElementById("resumenLista");
    if (!lista) return;

    var subtotalElemento = document.getElementById("resumenSubtotal");
    var lineaDescuento = document.getElementById("resumenDescuentoLinea");
    var totalElemento = document.getElementById("resumenTotal");

    var subtotal = 0;
    lista.innerHTML = "";

    carrito.forEach(function (p) {
        var importe = p.precio * p.cantidad;
        subtotal += importe;
        lista.innerHTML +=
            '<div class="resumen-item">' +
            '<span class="resumen-item-nombre">' + p.nombre + ' <span class="text-gold-light">x' + p.cantidad + '</span></span>' +
            '<span class="resumen-item-precio">$' + importe.toLocaleString("es-CL") + '</span>' +
            '</div>';
    });

    var cuponCodigo = localStorage.getItem("cuponAplicado");
    var descuento = cuponCodigo && CUPONES[cuponCodigo] ? subtotal * CUPONES[cuponCodigo] : 0;
    var total = subtotal - descuento;

    subtotalElemento.textContent = "$" + subtotal.toLocaleString("es-CL");

    if (descuento > 0) {
        document.getElementById("resumenDescuento").textContent = "-$" + descuento.toLocaleString("es-CL");
        lineaDescuento.style.display = "flex";
    } else {
        lineaDescuento.style.display = "none";
    }

    totalElemento.textContent = "$" + total.toLocaleString("es-CL");

    var cuponInput = document.getElementById("cuponInputPago");
    if (cuponInput && cuponCodigo) cuponInput.value = cuponCodigo;
}

function aplicarCuponPago() {
    var input = document.getElementById("cuponInputPago");
    var mensaje = document.getElementById("cuponMensajePago");
    var codigo = input.value.trim().toUpperCase();

    if (!codigo) {
        mensaje.textContent = "Ingresa un código de cupón.";
        mensaje.className = "d-block mt-1 text-danger";
        return;
    }

    if (!CUPONES.hasOwnProperty(codigo)) {
        localStorage.removeItem("cuponAplicado");
        mensaje.textContent = "Cupón no válido.";
        mensaje.className = "d-block mt-1 text-danger";
        renderResumenPago();
        return;
    }

    localStorage.setItem("cuponAplicado", codigo);
    mensaje.textContent = "Cupón aplicado: " + CUPONES[codigo] * 100 + "% de descuento.";
    mensaje.className = "d-block mt-1 text-success";
    renderResumenPago();
}

function procesarPago(evento) {
    evento.preventDefault();

    var formulario = evento.target;
    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        window.location.href = "productos.html";
        return;
    }

    var camposValidos = true;
    Array.prototype.forEach.call(formulario.querySelectorAll("input, select"), function (campo) {
        if (reglasCampos[campo.name] && !validarCampo(campo)) {
            camposValidos = false;
        }
    });

    if (!camposValidos) return;

    var subtotal = carrito.reduce(function (suma, p) {
        return suma + p.precio * p.cantidad;
    }, 0);
    var cuponCodigo = localStorage.getItem("cuponAplicado");
    var descuento = cuponCodigo && CUPONES[cuponCodigo] ? subtotal * CUPONES[cuponCodigo] : 0;
    var total = subtotal - descuento;

    var ordenes = JSON.parse(localStorage.getItem("ordenes") || "[]");
    var numeroTarjeta = formulario.numeroTarjeta.value.replace(/\s+/g, "");

    var orden = {
        id: ordenes.length + 1,
        fecha: new Date().toLocaleString("es-CL"),
        productos: carrito,
        subtotal: subtotal,
        descuento: descuento,
        cupon: cuponCodigo || null,
        total: total,
        estado: "Pagado",
        envio: {
            region: formulario.region.value,
            comuna: formulario.comuna.value,
            direccion: formulario.direccion.value.trim(),
        },
        pago: {
            metodo: "Tarjeta",
            tarjetaFinal: numeroTarjeta.slice(-4),
        },
    };

    ordenes.push(orden);
    localStorage.setItem("ordenes", JSON.stringify(ordenes));
    localStorage.setItem("ultimaOrden", JSON.stringify(orden));
    localStorage.removeItem("carrito");
    localStorage.removeItem("cuponAplicado");

    window.location.href = "pago-confirmado.html";
}

function mostrarConfirmacionPago() {
    var orden = JSON.parse(localStorage.getItem("ultimaOrden") || "null");

    if (!orden) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("confNumeroOrden").textContent = "#LUX-" + String(orden.id).padStart(4, "0");
    document.getElementById("confFecha").textContent = orden.fecha;
    document.getElementById("confTotal").textContent = "$" + orden.total.toLocaleString("es-CL");
    document.getElementById("confDireccion").textContent =
        orden.envio.direccion + ", " + orden.envio.comuna + ", " + orden.envio.region;
    document.getElementById("confTarjeta").textContent = "•••• •••• •••• " + orden.pago.tarjetaFinal;

    var lista = document.getElementById("confLista");
    lista.innerHTML = "";
    orden.productos.forEach(function (p) {
        lista.innerHTML +=
            '<div class="resumen-item">' +
            '<span class="resumen-item-nombre">' + p.nombre + ' <span class="text-gold-light">x' + p.cantidad + '</span></span>' +
            '<span class="resumen-item-precio">$' + (p.precio * p.cantidad).toLocaleString("es-CL") + '</span>' +
            '</div>';
    });
}


/* ==========================================================================
   AUTENTICACIÓN Y USUARIOS (registro, login, validación de RUN/correo)
   ========================================================================== */
function validarCorreo(correo) {
    return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo);
}

function calcularDigitoVerificador(cuerpoRun) {
    var suma = 0;
    var multiplo = 2;

    for (var i = cuerpoRun.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpoRun.charAt(i), 10) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    var resto = 11 - (suma % 11);
    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return String(resto);
}

function validarRun(run) {
    run = run.toUpperCase().replace(/\./g, "").replace(/-/g, "");
    if (!/^[0-9]{7,8}[0-9K]$/.test(run)) return false;

    var cuerpo = run.slice(0, -1);
    var dv = run.slice(-1);
    return calcularDigitoVerificador(cuerpo) === dv;
}

function cargarRegiones(idRegion, idComuna) {
    var region = document.getElementById(idRegion);
    var comuna = document.getElementById(idComuna);

    region.innerHTML = '<option value="">Seleccione región</option>';

    regiones.forEach(function (r) {
        region.innerHTML += '<option value="' + r.nombre + '">' + r.nombre + "</option>";
    });

    region.addEventListener("change", function () {
        comuna.innerHTML = '<option value="">Seleccione comuna</option>';

        var seleccion = regiones.find(function (r) {
            return r.nombre === region.value;
        });

        if (seleccion) {
            seleccion.comunas.forEach(function (c) {
                comuna.innerHTML += '<option value="' + c + '">' + c + "</option>";
            });
        }
    });
}

function registrarUsuario(evento) {
    evento.preventDefault();

    var formulario = evento.target;
    var esValido = true;

    Array.prototype.forEach.call(formulario.querySelectorAll("input[name]"), function (input) {
        if (reglasCampos[input.name] && !validarCampo(input)) esValido = false;
    });

    if (!esValido) return;

    var run = formulario.run.value.toUpperCase().replace(/\./g, "").replace(/-/g, "");
    var correo = formulario.correo.value.trim();
    var nombre = formulario.nombre.value.trim();
    var apellidos = formulario.apellidos.value.trim();
    var direccion = formulario.direccion.value.trim();
    var password = formulario.password.value;

    var lista = JSON.parse(localStorage.getItem("usuarios") || "[]");
    lista.push({
        run: run,
        nombre: nombre,
        apellidos: apellidos,
        correo: correo,
        password: password,
        fechaNacimiento: formulario.fechaNacimiento.value,
        tipo: "Cliente",
        region: formulario.region.value,
        comuna: formulario.comuna.value,
        direccion: direccion,
    });

    localStorage.setItem("usuarios", JSON.stringify(lista));
    alert("Usuario registrado correctamente.");
    formulario.reset();
}

function iniciarSesion(evento) {
    evento.preventDefault();

    var formulario = evento.target;
    var esValido = true;

    Array.prototype.forEach.call(formulario.querySelectorAll("input[name]"), function (input) {
        if (reglasCampos[input.name] && !validarCampo(input)) esValido = false;
    });

    if (!esValido) return;

    var correo = formulario.correo.value.trim();
    var password = formulario.password.value;

    var lista = JSON.parse(localStorage.getItem("usuarios") || "[]");
    var usuario = lista.find(function (u) {
        return u.correo.toLowerCase() === correo.toLowerCase();
    });

    if (!usuario) {
        mostrarError(formulario.correo, "Usuario no encontrado.");
        return;
    }

    if (usuario.password !== password) {
        mostrarError(formulario.password, "Contraseña incorrecta.");
        return;
    }

    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    alert("Inicio de sesión correcto.");

    if (usuario.tipo === "Administrador" || usuario.tipo === "Vendedor") {
        window.location.href = "admin/index.html";
    } else {
        window.location.href = "index.html";
    }
}


/* ==========================================================================
   VALIDACIÓN GENÉRICA DE FORMULARIOS (reglas, errores, validación en vivo)
   ========================================================================== */
var reglasCampos = {
    run: function (valor) {
        if (!valor) return "El RUN es obligatorio.";
        if (!validarRun(valor.toUpperCase().replace(/\./g, "").replace(/-/g, "")))
            return "RUN inválido. Verifica el dígito verificador (sin puntos ni guion, ej: 19011022K).";
        return "";
    },
    nombre: function (valor) {
        if (!valor) return "El nombre es obligatorio.";
        if (valor.length > 50) return "Máximo 50 caracteres.";
        return "";
    },
    apellidos: function (valor) {
        if (!valor) return "Los apellidos son obligatorios.";
        if (valor.length > 100) return "Máximo 100 caracteres.";
        return "";
    },
    correo: function (valor) {
        if (!valor) return "El correo es obligatorio.";
        if (valor.length > 100) return "Máximo 100 caracteres.";
        if (!validarCorreo(valor)) return "Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        return "";
    },
    password: function (valor) {
        if (valor.length < 4 || valor.length > 10) return "Entre 4 y 10 caracteres.";
        return "";
    },
    passwordConfirm: function (valor, formulario) {
        if (valor !== formulario.password.value) return "Las contraseñas no coinciden.";
        return "";
    },
    direccion: function (valor) {
        if (!valor) return "La dirección es obligatoria.";
        if (valor.length > 300) return "Máximo 300 caracteres.";
        return "";
    },
    region: function (valor) {
        if (!valor) return "Selecciona una región.";
        return "";
    },
    comuna: function (valor) {
        if (!valor) return "Selecciona una comuna.";
        return "";
    },
    numeroTarjeta: function (valor) {
        var limpio = valor.replace(/\s+/g, "");
        if (!limpio) return "El número de tarjeta es obligatorio.";
        if (!/^[0-9]{13,19}$/.test(limpio)) return "Ingresa un número de tarjeta válido.";
        return "";
    },
    nombreTarjeta: function (valor) {
        if (!valor) return "El nombre en la tarjeta es obligatorio.";
        if (valor.length > 100) return "Máximo 100 caracteres.";
        return "";
    },
    vencimiento: function (valor) {
        if (!valor) return "La fecha de vencimiento es obligatoria.";
        if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(valor)) return "Formato inválido. Usa MM/AA.";
        return "";
    },
    cvv: function (valor) {
        if (!valor) return "El CVV es obligatorio.";
        if (!/^[0-9]{3,4}$/.test(valor)) return "El CVV debe tener 3 o 4 dígitos.";
        return "";
    },
};

function mostrarError(input, mensaje) {
    input.classList.add("is-invalid");
    var contenedor = input.closest("div");
    var error = contenedor ? contenedor.querySelector(".error") : null;

    if (!error) {
        error = document.createElement("div");
        error.className = "error";
        contenedor.appendChild(error);
    }

    error.textContent = mensaje;
    error.style.display = "block";
}

function limpiarError(input) {
    input.classList.remove("is-invalid");
    var contenedor = input.closest("div");
    var error = contenedor ? contenedor.querySelector(".error") : null;
    if (error) error.style.display = "none";
}

function validarCampo(input) {
    var regla = reglasCampos[input.name];
    if (!regla) return true;

    var mensaje = regla(input.value.trim(), input.form);

    if (mensaje) {
        mostrarError(input, mensaje);
        return false;
    }

    limpiarError(input);
    return true;
}

function activarValidacionEnVivo(formulario) {
    if (!formulario) return;

    Array.prototype.forEach.call(formulario.querySelectorAll("input, textarea, select"), function (input) {
        input.addEventListener("blur", function () {
            validarCampo(input);
        });
        input.addEventListener("input", function () {
            if (input.classList.contains("is-invalid")) validarCampo(input);
        });
    });
}


/* ==========================================================================
   CONTACTO Y NEWSLETTER
   ========================================================================== */
function enviarContacto(evento) {
    evento.preventDefault();

    var formulario = evento.target;
    var nombre = formulario.nombre;
    var correo = formulario.correo;
    var comentario = formulario.comentario;
    var esValido = true;

    if (!nombre.value.trim() || nombre.value.trim().length > 100) {
        mostrarError(nombre, "El nombre es obligatorio y permite máximo 100 caracteres.");
        esValido = false;
    } else {
        limpiarError(nombre);
    }

    if (!validarCorreo(correo.value.trim()) || correo.value.trim().length > 100) {
        mostrarError(correo, "Ingrese un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).");
        esValido = false;
    } else {
        limpiarError(correo);
    }

    if (!comentario.value.trim() || comentario.value.trim().length > 500) {
        mostrarError(comentario, "El comentario es obligatorio y permite máximo 500 caracteres.");
        esValido = false;
    } else {
        limpiarError(comentario);
    }

    if (!esValido) return;

    var mensajes = JSON.parse(localStorage.getItem("mensajes") || "[]");
    mensajes.push({
        nombre: nombre.value.trim(),
        correo: correo.value.trim(),
        comentario: comentario.value.trim(),
        fecha: new Date().toLocaleString("es-CL"),
    });
    localStorage.setItem("mensajes", JSON.stringify(mensajes));

    alert("Mensaje enviado correctamente.");
    formulario.reset();
}

function inicializarNewsletter() {
    var form = document.getElementById("newsletterForm");
    if (!form) return;

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();
        var email = document.getElementById("newsletterEmail").value.trim();
        var mensaje = document.getElementById("newsletterMensaje");

        if (!validarCorreo(email)) {
            mensaje.textContent = "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).";
            mensaje.className = "d-block mt-2 text-danger";
            return;
}

        mensaje.textContent = "¡Gracias por suscribirte!";
        mensaje.className = "d-block mt-2 text-success";
        form.reset();
    });
}


/* ==========================================================================
   BÚSQUEDA EN EL NAV
   ========================================================================== */
function inicializarBusquedaNav() {
    var boton = document.getElementById("btnBuscarNav");
    var caja = document.getElementById("navSearchBox");
    var form = document.getElementById("navSearchForm");
    var input = document.getElementById("navSearchInput");
    if (!boton || !caja || !form || !input) return;

    var cajaBS = new bootstrap.Collapse(caja, { toggle: false });

    boton.addEventListener("click", function () {
        cajaBS.toggle();
        var expandido = boton.getAttribute("aria-expanded") === "true";
        boton.setAttribute("aria-expanded", String(!expandido));
        if (!expandido) {
            setTimeout(function () {
                input.focus();
            }, 150);
        }
    });

    var textoUrl = new URLSearchParams(window.location.search).get("buscar");
    if (textoUrl) input.value = textoUrl;

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();
        var texto = input.value.trim();
        window.location.href = "productos.html" + (texto ? "?buscar=" + encodeURIComponent(texto) : "");
    });
}


/* ==========================================================================
   DICCIONARIO OLFATIVO (modal de búsqueda)
   ========================================================================== */
function inicializarDiccionario() {
    var buscador = document.getElementById("diccionarioBuscador");
    if (!buscador) return;

    buscador.addEventListener("input", function () {
        var texto = buscador.value.trim().toLowerCase();
        document.querySelectorAll(".diccionario-item").forEach(function (item) {
            var coincide = item.textContent.toLowerCase().indexOf(texto) !== -1;
            item.style.display = coincide ? "" : "none";
        });
    });

}


/* ==========================================================================
   NOTIFICACIONES (toast genérico usado por carrito y wishlist)
   ========================================================================== */
function mostrarToast(mensaje, tipo) {
    var contenedor = document.getElementById("toastContenedor");
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "toastContenedor";
        contenedor.style.position = "fixed";
        contenedor.style.bottom = "20px";
        contenedor.style.right = "20px";
        contenedor.style.zIndex = "9999";
        document.body.appendChild(contenedor);
    }

    var toast = document.createElement("div");
    toast.className = "toast-luxury" + (tipo === "aviso" ? " toast-luxury--aviso" : "");
    toast.textContent = mensaje;
    contenedor.appendChild(toast);

    setTimeout(function () {
        toast.remove();
    }, 3000);
}

/* ==========================================================================
   Validacion usuario actual
   ========================================================================== */


function obtenerUsuarioActual() {
    return JSON.parse(localStorage.getItem("usuarioActual") || "null");
}

function actualizarNavbarSesion() {
    var contenedor = document.getElementById("navAuth");
    if (!contenedor) return;

    var usuario = obtenerUsuarioActual();

    if (!usuario) {
        contenedor.innerHTML = '<a class="nav-icon-btn" href="login.html" aria-label="Ingresar" title="Ingresar"><i class="bi bi-person"></i></a>';
        return;
    }

    var nombre = usuario.nombre || usuario.correo || "Mi cuenta";

    contenedor.innerHTML =
        '<a class="nav-icon-btn dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="' + nombre + '" title="' + nombre + '">' +
            '<i class="bi bi-person-fill"></i>' +
        '</a>' +
        '<ul class="dropdown-menu dropdown-menu-luxury dropdown-menu-end">' +
            '<li><span class="dropdown-item-text fs-7 text-gold-light">' + nombre + '</span></li>' +
            (usuario.tipo === "Administrador" || usuario.tipo === "Vendedor"
                ? '<li><a class="dropdown-item" href="admin/index.html">Panel Admin</a></li>'
                : "") +
            '<li><a class="dropdown-item" href="#" onclick="cerrarSesion(); return false;">Cerrar sesión</a></li>' +
        '</ul>';
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    window.location.href = "index.html";
}