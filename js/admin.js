document.addEventListener("DOMContentLoaded", function () {
    protegerAdmin();

    if (document.getElementById("adminProductos")) listarProductosAdmin();
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