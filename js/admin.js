document.addEventListener("DOMContentLoaded", function () {
    protegerAdmin();

    if (document.getElementById("adminProductos")) listarProductosAdmin();
    if (document.getElementById("adminUsuarios")) listarUsuariosAdmin();
    if (document.getElementById("adminOrdenes")) listarOrdenesAdmin();

    var formProducto = document.getElementById("productoForm");
    if (formProducto) {
        formProducto.addEventListener("submit", guardarProducto);
    }

    var formUsuario = document.getElementById("usuarioAdminForm");
    if (formUsuario) {
        cargarRegiones("region", "comuna");
        formUsuario.addEventListener("submit", guardarUsuarioAdmin);
        cargarUsuarioEditar();
    }

    if (document.getElementById("productoDetalleAdmin")) mostrarProductoDetalleAdmin();
    if (document.getElementById("usuarioDetalle")) mostrarUsuarioDetalle();
});

function protegerAdmin() {
    var usuario = JSON.parse(localStorage.getItem("usuarioActual") || "null");

    if (!usuario || (usuario.tipo !== "Administrador" && usuario.tipo !== "Vendedor")) {
        alert("Debe iniciar sesión como administrador o vendedor.");
        window.location.href = "../login.html";
        return;
    }

    var enlaces = document.querySelectorAll(".admin-menu a");
    if (usuario.tipo === "Vendedor") {
        enlaces.forEach(function (enlace) {
            var texto = enlace.textContent.trim();
            if (texto === "Nuevo producto" || texto === "Usuarios" || texto === "Nuevo usuario") {
                enlace.style.display = "none";
            }
        });

        var paginaRestringida =
            document.getElementById("productoForm") ||
            document.getElementById("adminUsuarios") ||
            document.getElementById("usuarioAdminForm") ||
            document.getElementById("usuarioDetalle");

        if (paginaRestringida) {
            alert("Tu perfil de Vendedor no tiene acceso a esta sección.");
            window.location.href = "productos.html";
        }
    }
}

function listarProductosAdmin() {
    var tabla = document.getElementById("adminProductos");
    var lista = obtenerProductos();
    var usuario = JSON.parse(localStorage.getItem("usuarioActual") || "null");
    var esVendedor = usuario && usuario.tipo === "Vendedor";
    tabla.innerHTML = "";

    lista.forEach(function (p) {
        var alerta = p.stock <= p.stockCritico ? '<span class="badge bg-danger">Stock crítico</span>' : '<span class="badge-luxury">Stock OK</span>';
        var acciones = esVendedor
            ? '<a class="btn btn-sm btn-outline-light" href="producto-detalle.html?id=' + p.id + '">Ver</a>'
            : '<a class="btn btn-sm btn-outline-light me-1" href="producto-detalle.html?id=' + p.id + '">Ver</a> <a class="btn btn-sm btn-luxury" href="nuevo-producto.html?id=' + p.id + '">Editar</a> <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(\'' + p.id + '\')">Eliminar</button>';
        tabla.innerHTML += '<tr><td>' + p.codigo + '</td><td>' + (p.marca || "—") + '</td><td>' + p.nombre + '</td><td>$' + p.precio.toLocaleString("es-CL") + '</td><td>' + p.stock + '</td><td>' + alerta + '</td><td>' + acciones + '</td></tr>';
    });
}


function guardarProducto(evento) {
    evento.preventDefault();

    var f = evento.target;
    var lista = obtenerProductos();
    var id = f.idProducto.value || String(Date.now());

    var producto = {
        id:id,
        codigo:f.codigo.value.trim(),
        marca:f.marca.value.trim(),
        nombre:f.nombre.value.trim(),
        descripcion:f.descripcion.value.trim(),
        precio:Number(f.precio.value),
        stock:Number(f.stock.value),
        stockCritico:Number(f.stockCritico.value || 0),
        categoria:f.categoria.value,
        familia:f.familia.value,
        estacion:f.estacion.value,
        genero:f.genero.value,
        tipo:f.tipo.value,
        concentracion:f.concentracion.value,
        humor:f.humor.value.split(",").map(function (h) { return h.trim().toLowerCase(); }).filter(function (h) { return h.length > 0; }),
        maridaje:f.maridaje.value.split(",").map(function (h) { return h.trim().toLowerCase(); }).filter(function (h) { return h.length > 0; }),
        notas:{
            salida:f.notasSalida.value.split(",").map(function (n) { return n.trim(); }).filter(function (n) { return n.length > 0; }),
            corazon:f.notasCorazon.value.split(",").map(function (n) { return n.trim(); }).filter(function (n) { return n.length > 0; }),
            fondo:f.notasFondo.value.split(",").map(function (n) { return n.trim(); }).filter(function (n) { return n.length > 0; })
        },
        imagen:f.imagen.value || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
    };

    var inspMarca = f.inspiradoMarca.value.trim();
    var inspNombre = f.inspiradoNombre.value.trim();
    var inspPrecio = Number(f.inspiradoPrecio.value);

    if (producto.tipo === "arabe" && inspMarca && inspNombre && inspPrecio > 0) {
        producto.inspiradoEn = { marca:inspMarca, nombre:inspNombre, precioOriginal:inspPrecio };
    }

    if (producto.codigo.length < 3 || !producto.marca || !producto.nombre || producto.nombre.length > 100) {
        alert("Revise código, marca y nombre.");
        return;
    }

    if (producto.precio < 0 || producto.stock < 0 || producto.stockCritico < 0) {
        alert("Precio y stock no pueden ser negativos.");
        return;
    }

    var posicion = lista.findIndex(function (p) { return p.id === id; });

    if (posicion >= 0) lista[posicion] = producto;
    else lista.push(producto);

    localStorage.setItem("productos", JSON.stringify(lista));
    alert("Producto guardado correctamente.");
    window.location.href = "productos.html";
}

function cargarProductoEditar() {
    var id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;

    var producto = obtenerProductos().find(function (p) { return p.id === id; });
    if (!producto) return;

    var f = document.getElementById("productoForm");
    f.idProducto.value = producto.id;
    f.codigo.value = producto.codigo;
    f.marca.value = producto.marca || "";
    f.nombre.value = producto.nombre;
    f.descripcion.value = producto.descripcion;
    f.precio.value = producto.precio;
    f.stock.value = producto.stock;
    f.stockCritico.value = producto.stockCritico;
    f.categoria.value = producto.categoria;
    f.familia.value = producto.familia;
    f.estacion.value = producto.estacion;
    f.genero.value = producto.genero || "unisex";
    f.tipo.value = producto.tipo || "disenador";
    f.concentracion.value = producto.concentracion || "edt";
    f.humor.value = (producto.humor || []).join(", ");
    f.maridaje.value = (producto.maridaje || []).join(", ");
    f.notasSalida.value = ((producto.notas && producto.notas.salida) || []).join(", ");
    f.notasCorazon.value = ((producto.notas && producto.notas.corazon) || []).join(", ");
    f.notasFondo.value = ((producto.notas && producto.notas.fondo) || []).join(", ");
    f.inspiradoMarca.value = (producto.inspiradoEn && producto.inspiradoEn.marca) || "";
    f.inspiradoNombre.value = (producto.inspiradoEn && producto.inspiradoEn.nombre) || "";
    f.inspiradoPrecio.value = (producto.inspiradoEn && producto.inspiradoEn.precioOriginal) || "";
    f.imagen.value = producto.imagen;
}

function eliminarProducto(id) {
    if (!confirm("¿Eliminar este producto?")) return;

    var lista = obtenerProductos().filter(function (p) { return p.id !== id; });
    localStorage.setItem("productos", JSON.stringify(lista));
    listarProductosAdmin();
}

function mostrarProductoDetalleAdmin() {
    var id = new URLSearchParams(window.location.search).get("id");
    var producto = obtenerProductos().find(function (p) { return p.id === id; });
    var contenedor = document.getElementById("productoDetalleAdmin");
    if (!contenedor) return;

    if (!producto) {
        contenedor.innerHTML = '<div class="alert alert-luxury">Producto no encontrado.</div>';
        return;
    }

    var alerta = producto.stock <= producto.stockCritico ? '<span class="badge bg-danger">Stock crítico</span>' : '<span class="badge-luxury">Stock OK</span>';

    contenedor.innerHTML =
        '<div class="row g-4 align-items-center">' +
        '<div class="col-md-4"><img src="' + producto.imagen + '" class="img-fluid rounded" alt="' + producto.nombre + '"></div>' +
        '<div class="col-md-8">' +
        '<dl class="row mb-0">' +
        '<dt class="col-sm-3">Código</dt><dd class="col-sm-9">' + producto.codigo + '</dd>' +
        '<dt class="col-sm-3">Marca</dt><dd class="col-sm-9">' + (producto.marca || "—") + '</dd>' +
        '<dt class="col-sm-3">Nombre</dt><dd class="col-sm-9">' + producto.nombre + '</dd>' +
        '<dt class="col-sm-3">Descripción</dt><dd class="col-sm-9">' + (producto.descripcion || "—") + '</dd>' +
        '<dt class="col-sm-3">Precio</dt><dd class="col-sm-9">$' + producto.precio.toLocaleString("es-CL") + '</dd>' +
        '<dt class="col-sm-3">Stock</dt><dd class="col-sm-9">' + producto.stock + ' ' + alerta + '</dd>' +
        '<dt class="col-sm-3">Stock crítico</dt><dd class="col-sm-9">' + producto.stockCritico + '</dd>' +
        '<dt class="col-sm-3">Categoría</dt><dd class="col-sm-9">' + producto.categoria + '</dd>' +
        '<dt class="col-sm-3">Estación</dt><dd class="col-sm-9">' + producto.estacion + '</dd>' +
        '<dt class="col-sm-3">Estado de ánimo</dt><dd class="col-sm-9">' + ((producto.humor || []).join(", ") || "—") + '</dd>' +
        '<dt class="col-sm-3">Maridaje</dt><dd class="col-sm-9">' + ((producto.maridaje || []).join(", ") || "—") + '</dd>' +
        '<dt class="col-sm-3">Notas (S/C/F)</dt><dd class="col-sm-9">' +
        (producto.notas
            ? (producto.notas.salida || []).join(", ") + " / " + (producto.notas.corazon || []).join(", ") + " / " + (producto.notas.fondo || []).join(", ")
            : "—") +
        '</dd>' +
        '<dt class="col-sm-3">Inspirado en</dt><dd class="col-sm-9">' +
        (producto.inspiradoEn
            ? producto.inspiradoEn.marca + " — " + producto.inspiradoEn.nombre + " ($" + producto.inspiradoEn.precioOriginal.toLocaleString("es-CL") + ")"
            : "—") +
        '</dd>' +
        '</dl></div></div>';
}
function listarUsuariosAdmin() {
    var tabla = document.getElementById("adminUsuarios");
    var lista = JSON.parse(localStorage.getItem("usuarios") || "[]");
    tabla.innerHTML = "";

    lista.forEach(function (u) {
        tabla.innerHTML +=
            '<tr><td>' + u.run + '</td><td>' + u.nombre + ' ' + u.apellidos + '</td><td>' + u.correo + '</td><td>' + u.tipo + '</td><td>' + u.region + '</td><td>' + u.comuna + '</td>' +
            '<td><a class="btn btn-sm btn-outline-light me-1" href="usuario-detalle.html?run=' + u.run + '">Ver</a> <a class="btn btn-sm btn-luxury" href="nuevo-usuario.html?run=' + u.run + '">Editar</a></td></tr>';
    });
}

function mostrarUsuarioDetalle() {
    var run = new URLSearchParams(window.location.search).get("run");
    var lista = JSON.parse(localStorage.getItem("usuarios") || "[]");
    var usuario = lista.find(function (u) { return u.run === run; });
    var contenedor = document.getElementById("usuarioDetalle");
    if (!contenedor) return;

    if (!usuario) {
        contenedor.innerHTML = '<div class="alert alert-luxury">Usuario no encontrado.</div>';
        return;
    }

    contenedor.innerHTML =
        '<dl class="row mb-0">' +
        '<dt class="col-sm-3">RUN</dt><dd class="col-sm-9">' + usuario.run + '</dd>' +
        '<dt class="col-sm-3">Nombre</dt><dd class="col-sm-9">' + usuario.nombre + ' ' + usuario.apellidos + '</dd>' +
        '<dt class="col-sm-3">Correo</dt><dd class="col-sm-9">' + usuario.correo + '</dd>' +
        '<dt class="col-sm-3">Fecha nacimiento</dt><dd class="col-sm-9">' + (usuario.fechaNacimiento || "—") + '</dd>' +
        '<dt class="col-sm-3">Tipo</dt><dd class="col-sm-9">' + usuario.tipo + '</dd>' +
        '<dt class="col-sm-3">Región</dt><dd class="col-sm-9">' + usuario.region + '</dd>' +
        '<dt class="col-sm-3">Comuna</dt><dd class="col-sm-9">' + usuario.comuna + '</dd>' +
        '<dt class="col-sm-3">Dirección</dt><dd class="col-sm-9">' + usuario.direccion + '</dd>' +
        '</dl>';
}

function cargarUsuarioEditar() {
    var run = new URLSearchParams(window.location.search).get("run");
    if (!run) return;

    var lista = JSON.parse(localStorage.getItem("usuarios") || "[]");
    var usuario = lista.find(function (u) { return u.run === run; });
    if (!usuario) return;

    var f = document.getElementById("usuarioAdminForm");
    f.runOriginal.value = usuario.run;
    f.run.value = usuario.run;
    f.run.readOnly = true;
    f.nombre.value = usuario.nombre;
    f.apellidos.value = usuario.apellidos;
    f.correo.value = usuario.correo;
    f.fechaNacimiento.value = usuario.fechaNacimiento || "";
    f.tipo.value = usuario.tipo;

    var aplicarComuna = function () {
        f.region.value = usuario.region;
        f.region.dispatchEvent(new Event("change"));
        setTimeout(function () { f.comuna.value = usuario.comuna; }, 0);
    };
    setTimeout(aplicarComuna, 0);

    f.direccion.value = usuario.direccion;

    document.querySelector("h1.luxury-title").textContent = "Editar usuario";
    var boton = f.querySelector("button[type=submit]");
    if (boton) boton.textContent = "Guardar cambios";
}

function guardarUsuarioAdmin(evento) {
    evento.preventDefault();

    var f = evento.target;
    var runOriginal = f.runOriginal ? f.runOriginal.value : "";
    var esEdicion = Boolean(runOriginal);
    var run = f.run.value.toUpperCase().replace(/\./g, "").replace(/-/g, "");

    if (!validarRun(run)) {
        alert("RUN inválido.");
        return;
    }

    if (!validarCorreo(f.correo.value)) {
        alert("Correo inválido.");
        return;
    }

    var lista = JSON.parse(localStorage.getItem("usuarios") || "[]");
    var identificadorBusqueda = esEdicion ? runOriginal : run;

    if (!esEdicion && lista.some(function (u) { return u.run === run; })) {
        alert("Ya existe un usuario registrado con ese RUN.");
        return;
    }

    var usuario = {
        run:run,
        nombre:f.nombre.value.trim(),
        apellidos:f.apellidos.value.trim(),
        correo:f.correo.value.trim(),
        fechaNacimiento:f.fechaNacimiento.value,
        tipo:f.tipo.value,
        region:f.region.value,
        comuna:f.comuna.value,
        direccion:f.direccion.value.trim()
    };

    var posicion = lista.findIndex(function (u) { return u.run === identificadorBusqueda; });

    if (posicion >= 0) {
        lista[posicion] = usuario;
    } else {
        lista.push(usuario);
    }

    localStorage.setItem("usuarios", JSON.stringify(lista));
    alert(esEdicion ? "Usuario actualizado correctamente." : "Usuario creado correctamente.");
    window.location.href = "usuarios.html";
}

function listarOrdenesAdmin() {
    var tabla = document.getElementById("adminOrdenes");
    var lista = JSON.parse(localStorage.getItem("ordenes") || "[]");
    tabla.innerHTML = "";

    if (lista.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" class="text-center text-gold-light">No existen órdenes registradas.</td></tr>';
        return;
    }

    lista.forEach(function (o) {
        tabla.innerHTML += '<tr><td>#' + o.id + '</td><td>' + o.fecha + '</td><td>' + o.productos.length + '</td><td>$' + o.total.toLocaleString("es-CL") + '</td><td>' + o.estado + '</td></tr>';
    });
}
