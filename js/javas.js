document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("productosGrid")) {
        inicializarFiltrosProductos();
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
});



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