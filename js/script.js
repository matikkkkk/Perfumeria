/* ==========================================================================
   INICIALIZACIÓN GENERAL
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
    actualizarContador();
    actualizarContadorWishlist();
    inicializarDiccionario();
    inicializarNewsletter();

    if (document.getElementById("productosGrid")) {
        inicializarFiltrosProductos();
    }

    if (document.getElementById("detalleProducto")) {
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
        '<span class="fs-7 text-gold text-uppercase tracking-wider d-block">Nuestra versión</span>' +
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
        '<div class="col-12 col-md-6 col-lg-3">' +
        '<article class="card luxury-card h-100 border-0">' +
        '<div class="card-img-wrapper">' +
        '<span class="card-badge card-badge--left">' +
        (CONCENTRACION_LABELS[p.concentracion] || "") +
        "</span>" +
        '<span class="card-badge card-badge--right">' +
        (TIPO_LABELS[p.tipo] || "") +
        "</span>" +
        '<span class="card-badge card-badge--ml"><i class="bi bi-cloud-fill"></i> ' +
        p.ml +
        " ML</span>" +
        '<button type="button" class="wishlist-heart' + (enWishlist ? " activo" : "") + '" data-id="' + p.id + '" onclick="event.stopPropagation(); toggleWishlist(\'' + p.id + '\');" aria-label="Guardar en wishlist"><i class="bi ' + (enWishlist ? "bi-heart-fill" : "bi-heart") + '"></i></button>' +
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
        '<h3 class="luxury-title fst-italic display-6 mt-2">' +
        p.nombre +
        "</h3>" +
        '<p class="text-gold-light my-3">' +
        p.descripcion +
        "</p>" +
        renderInspiradoEn(p, true) +
        '<p class="fs-7 text-uppercase text-gold tracking-wider mb-3 mt-2">Familia: <span class="text-gold-light">' +
        (FAMILIA_LABELS[p.familia] || p.familia) +
        "</span></p>" +
        '<h4 class="price mb-3">$' +
        p.precio.toLocaleString("es-CL") +
        "</h4>" +
        '<a href="producto.html?id=' +
        p.id +
        '" class="btn btn-luxury me-2">Ver producto</a>' +
        '<button class="btn btn-outline-light" onclick="agregarCarrito(\'' +
        p.id +
        "')\">Añadir</button>" +
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

function renderCarruselGenero(idInner, genero, maxProductos, porSlide) {
    var contenedor = document.getElementById(idInner);
    if (!contenedor) return;

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
                    return crearTarjeta(p);
                })
                .join("");
            return '<div class="carousel-item' + (indice === 0 ? " active" : "") + '"><div class="row g-4 justify-content-center">' + tarjetas + "</div></div>";
        })
        .join("");
}

function inicializarCarruselesGenero() {
    renderCarruselGenero("carruselMujerInner", "mujer", 8, 4);
    renderCarruselGenero("carruselHombreInner", "hombre", 8, 4);
    renderCarruselGenero("carruselUnisexInner", "unisex", 8, 4);
}

function renderDestacados() {
    var contenedor = document.getElementById("destacadosGrid");
    if (!contenedor) return;

    var lista = obtenerLista().slice(0, 3);

    contenedor.innerHTML = lista
        .map(function (p) {
            return crearTarjeta(p);
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
        var marcados = Array.prototype.slice
            .call(lista.querySelectorAll("input[type=checkbox]:checked"))
            .map(function (input) {
                return input.value;
            });
        grupos[grupo] = marcados;
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
            history.replaceState(null, "", window.location.pathname);
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
    var contenedor = document.getElementById("detalleProducto");

    if (!producto) {
        contenedor.innerHTML = '<div class="alert alert-luxury">Producto no encontrado.</div>';
        return;
    }

    var breadcrumbNombre = document.getElementById("breadcrumbActual");
    if (breadcrumbNombre) breadcrumbNombre.textContent = producto.nombre;

    var agotado = producto.stock <= 0;
    var alertaStock = agotado
        ? '<div class="alert alert-luxury py-2 px-3 mb-3 d-inline-block">Producto agotado por el momento.</div>'
        : producto.stock <= producto.stockCritico
        ? '<div class="alert alert-luxury py-2 px-3 mb-3 d-inline-block">Quedan pocas unidades disponibles.</div>'
        : "";

    var opcionesCantidad = "";
    for (var i = 1; i <= Math.min(producto.stock, 10); i++) {
        opcionesCantidad += '<option value="' + i + '">' + i + "</option>";
    }

    var moods = (producto.humor || []).map(chipHumor).join("");
    var notas = notasPlanas(producto).map(chipNota).join("");

    contenedor.innerHTML =
        '<div class="row g-5">' +
        '<div class="col-md-6">' +
        '<div class="product-gallery-main"><img src="' +
        producto.imagen +
        '" class="img-fluid rounded" alt="' +
        producto.nombre +
        '"></div>' +
        "</div>" +
        '<div class="col-md-6">' +
        '<div class="mb-2">' +
        '<span class="text-gold text-uppercase tracking-wider fs-7">' +
        producto.estacion.toUpperCase() +
        "</span> " +
        '<span class="badge-pill-luxury">' +
        (CONCENTRACION_LABELS[producto.concentracion] || "") +
        "</span> " +
        '<span class="badge-pill-luxury badge-pill-luxury--muted">' +
        (TIPO_LABELS[producto.tipo] || "") +
        "</span> " +
        '<span class="badge-pill-luxury"><i class="bi bi-cloud-fill"></i> ' +
        producto.ml +
        " ML</span>" +
        "</div>" +
        '<span class="d-block fs-7 text-uppercase tracking-wider text-gold-light">' +
        (producto.marca || "") +
        "</span>" +
        '<h1 class="display-5 luxury-title mt-1">' +
        producto.nombre +
        "</h1>" +
        '<h2 class="price">$' +
        producto.precio.toLocaleString("es-CL") +
        "</h2>" +
        '<div class="mood-chip-list mb-3">' +
        moods +
        "</div>" +
        alertaStock +
        '<p class="text-gold-light">' +
        producto.descripcion +
        "</p>" +
        (notas
            ? '<h6 class="fs-7 text-uppercase text-gold tracking-wider mt-4 mb-2">Notas olfativas</h6><div class="nota-chip-list mb-4">' +
              notas +
              "</div>"
            : "") +
        (agotado
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
              '<button class="btn btn-luxury w-100" onclick="agregarCarritoConCantidad(\'' +
              producto.id +
              "')\">Añadir al carrito</button>") +
        "</div>" +
        "</div>" +
        renderInspiradoEn(producto, false) +
        renderPiramideOlfativa(producto) +
        renderMaridaje(producto);
}

function renderPiramideOlfativa(producto) {
    if (!producto.notas) return "";

    var etapas = [
        { key: "salida", label: "Salida", tiempo: "Primeras 15 min", ancho: 55 },
        { key: "corazon", label: "Corazón", tiempo: "15 min – 4 horas", ancho: 78 },
        { key: "fondo", label: "Fondo", tiempo: "4+ horas", ancho: 100 },
    ];

    var visual = etapas
        .map(function (e) {
            return '<div class="piramide-nivel" style="width:' + e.ancho + '%">' + e.label.toUpperCase() + "</div>";
        })
        .join("");

    var info = etapas
        .map(function (e) {
            var chips = (producto.notas[e.key] || []).map(chipNota).join("");
            return (
                '<div class="piramide-etapa-card">' +
                '<span class="fs-7 text-uppercase text-gold tracking-wider">' +
                e.label.toUpperCase() +
                '<span class="text-gold-light text-lowercase ms-2">' +
                e.tiempo +
                "</span></span>" +
                '<div class="nota-chip-list mt-2">' +
                chips +
                "</div>" +
                "</div>"
            );
        })
        .join("");

    return (
        '<section class="piramide-section mt-5 pt-5 border-top border-secondary border-opacity-25">' +
        '<div class="row g-5">' +
        '<div class="col-md-5">' +
        '<span class="text-gold text-uppercase tracking-wider fs-7">Pirámide olfativa</span>' +
        '<h3 class="luxury-title fst-italic mb-4">Arquitectura del Aroma</h3>' +
        '<div class="piramide-visual">' +
        visual +
        "</div>" +
        "</div>" +
        '<div class="col-md-7 d-flex flex-column gap-3 justify-content-center">' +
        info +
        "</div>" +
        "</div></section>"
    );
}

function renderMaridaje(producto) {
    var ocasiones = (producto.maridaje || []).map(chipOcasion).join("");
    var moods = (producto.humor || []).map(chipHumor).join("");
    if (!ocasiones && !moods) return "";

    return (
        '<section class="maridaje-section mt-5 pt-5 border-top border-secondary border-opacity-25">' +
        '<span class="text-gold text-uppercase tracking-wider fs-7">Maridaje</span>' +
        '<h3 class="luxury-title fst-italic mb-4">Ideal Para</h3>' +
        '<div class="occasion-chip-list mb-3">' +
        ocasiones +
        "</div>" +
        '<div class="mood-chip-list">' +
        moods +
        "</div>" +
        "</section>"
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

function finalizarCompra() {
    var carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    var ordenes = JSON.parse(localStorage.getItem("ordenes") || "[]");
    ordenes.push({
        id: ordenes.length + 1,
        fecha: new Date().toLocaleString("es-CL"),
        productos: carrito,
        total: carrito.reduce(function (suma, p) {
            return suma + p.precio * p.cantidad;
        }, 0),
        estado: "Pendiente",
    });

    localStorage.setItem("ordenes", JSON.stringify(ordenes));
    localStorage.removeItem("carrito");
    localStorage.removeItem("cuponAplicado");
    alert("Compra registrada correctamente.");
    window.location.href = "index.html";
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
    var run = formulario.run.value.toUpperCase().replace(/\./g, "").replace(/-/g, "");
    var correo = formulario.correo.value.trim();
    var nombre = formulario.nombre.value.trim();
    var apellidos = formulario.apellidos.value.trim();
    var direccion = formulario.direccion.value.trim();
    var password = formulario.password.value;
    var passwordConfirm = formulario.passwordConfirm.value;

    if (!validarRun(run)) {
        alert("El RUN no es válido (verifica el dígito verificador). Formato sin puntos ni guion, por ejemplo 19011022K.");
        return;
    }

    if (!validarCorreo(correo)) {
        alert("El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        return;
    }

    if (!nombre || nombre.length > 50 || !apellidos || apellidos.length > 100) {
        alert("Revise nombre y apellidos.");
        return;
    }

    if (password.length < 4 || password.length > 10) {
        alert("La contraseña debe tener entre 4 y 10 caracteres.");
        return;
    }

    if (password !== passwordConfirm) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    if (!direccion || direccion.length > 300) {
        alert("La dirección es obligatoria y permite máximo 300 caracteres.");
        return;
    }

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

    var correo = evento.target.correo.value.trim();
    var password = evento.target.password.value;

    if (!correo || correo.length > 100 || !validarCorreo(correo)) {
        alert("Ingrese un correo válido.");
        return;
    }

    if (password.length < 4 || password.length > 10) {
        alert("La contraseña debe tener entre 4 y 10 caracteres.");
        return;
    }

    var lista = JSON.parse(localStorage.getItem("usuarios") || "[]");
    var usuario = lista.find(function (u) {
        return u.correo.toLowerCase() === correo.toLowerCase();
    });

    if (!usuario) {
        alert("Usuario no encontrado.");
        return;
    }

    if (usuario.password !== password) {
        alert("Contraseña incorrecta.");
        return;
    }

    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    alert("Inicio de sesión correcto.");
    window.location.href = "index.html";
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

    Array.prototype.forEach.call(formulario.querySelectorAll("input, textarea"), function (input) {
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

    var nombre = evento.target.nombre.value.trim();
    var correo = evento.target.correo.value.trim();
    var comentario = evento.target.comentario.value.trim();

    if (!nombre || nombre.length > 100) {
        alert("El nombre es obligatorio y permite máximo 100 caracteres.");
        return;
    }

    if (!validarCorreo(correo) || correo.length > 100) {
        alert("Ingrese un correo válido.");
        return;
    }

    if (!comentario || comentario.length > 500) {
        alert("El comentario es obligatorio y permite máximo 500 caracteres.");
        return;
    }

    var mensajes = JSON.parse(localStorage.getItem("mensajes") || "[]");
    mensajes.push({
        nombre: nombre,
        correo: correo,
        comentario: comentario,
        fecha: new Date().toLocaleString("es-CL"),
    });
    localStorage.setItem("mensajes", JSON.stringify(mensajes));

    alert("Mensaje enviado correctamente.");
    evento.target.reset();
}

function inicializarNewsletter() {
    var form = document.getElementById("newsletterForm");
    if (!form) return;

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();
        var email = document.getElementById("newsletterEmail").value.trim();
        var mensaje = document.getElementById("newsletterMensaje");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mensaje.textContent = "Ingresa un correo válido.";
            mensaje.className = "d-block mt-2 text-danger";
            return;
        }

        mensaje.textContent = "¡Gracias por suscribirte!";
        mensaje.className = "d-block mt-2 text-success";
        form.reset();
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