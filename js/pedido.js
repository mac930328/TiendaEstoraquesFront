const baseUrl = "http://168.138.128.187:8080";
const pathPedido = "/api/pedido";
const pathProductoXPedido = "/api/producto-x-pedido";
const pathCliente = "/api/cliente";
const pathProducto = "/api/producto";

let productos = [];

$(document).ready(function () {
  obtenerClientes();
  obtenerProductos();
});

function obtenerClientes() {
  $.ajax({
    type: "GET",
    url: baseUrl + pathCliente + "/all",
    dataType: "json",
    success: function (response) {
      if (response.length > 0) {
        //productos = response;
        armarSelectCliente(response);
      } else {
        noHayRegistrosSelectCliente();
      }
    },
  });
}

function noHayRegistrosSelectCliente() {
  let contenido = "<option selected>No hay registros</option>";
  $("#selectCliente").html(contenido);
}

function armarSelectCliente(array) {
  let contenido = "<option selected>Seleccione un cliente</option>";
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    contenido +=
      '<option value="' +
      element.id +
      '">' +
      element.nombre +
      " " +
      element.apellido +
      "</option>";
  }
  $("#selectCliente").html(contenido);
}

function obtenerProductos() {
  $.ajax({
    type: "GET",
    url: baseUrl + pathProducto + "/all",
    dataType: "json",
    success: function (response) {
      if (response.length > 0) {
        //productos = response;
        armarSelectProducto(response);
      } else {
        noHayRegistrosSelectProducto();
      }
    },
  });
}

function noHayRegistrosSelectProducto() {
  let contenido = "<option selected>No hay registros</option>";
  $("#selectProducto").html(contenido);
}

function armarSelectProducto(array) {
  let contenido = "<option selected>Seleccione un producto</option>";
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    contenido +=
      '<option value="' + element.id + '">' + element.nombre + "</option>";
  }
  $("#selectProducto").html(contenido);
}

function agregarProducto() {
  let idProducto = $("#selectProducto").val();

  $.ajax({
    type: "GET",
    url: baseUrl + pathProducto + "/" + idProducto,
    dataType: "json",
    success: function (response) {
      if (response !== null) {
        let cantidad = $("#cantidad").val();
        response.cantidad = cantidad;
        productos.push(response);
      }
      if (productos.length > 0) {
        armarTabla(productos);
      } else {
        noHayRegistros();
      }
      $("#codigo").val("");
    },
  });
}

function armarTabla(array) {
  let tabla =
    '<thead><tr><th scope="col">Nombre</th><th scope="col">Precio</th><th scope="col">Cantidad</th><th scope="col">Acciones</th></tr></thead>';
  tabla += "<tbody>";
  let cantidad = $("#cantidad").val();
  for (let i = 0; i < array.length; i++) {
    tabla += "<tr>";
    tabla += "<td>" + array[i].nombre + "</td>";
    tabla += "<td>" + array[i].precio + "</td>";
    tabla += "<td>" + array[i].cantidad + "</td>";
    tabla += "<td>";
    tabla +=
      '<button id="btnActualizar" type="button" class="btn btn-primary" onclick="mostrarProducto(' +
      i +
      ')">Actualizar</button>';
    tabla +=
      '<button id="btnEliminar" type="button" class="btn btn-primary" onclick="eliminarProducto(' +
      array[i].id +
      ')">Eliminar</button>';
    tabla += "</td>";
    tabla += "</tr>";
  }
  tabla += "</tbody>";
  $("#tablaProductos").html(tabla);
}

function noHayRegistros() {
  let tabla =
    '<thead><tr><th scope="col"></th></tr></thead><tbody><tr><td>NO HAY REGISTROS</td></tr></tbody>';
  $("#tablaProductos").html(tabla);
}

function agregarPedido() {
  let fecha = new Date().toISOString();
  let idCliente = $("#selectCliente").val();

  let objeto = {
    fecha: fecha,
    cliente: {
      id: idCliente,
    },
  };

  $.ajax({
    type: "POST",
    url: baseUrl + pathPedido + "/save",
    data: JSON.stringify(objeto),
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    success: function (response) {
      let idPedido = response.id;
      for (let index = 0; index < productos.length; index++) {
        const element = productos[index];
        guardarProductoXPedido(element, idPedido);
      }
    },
  });

  
}

function guardarProductoXPedido(producto, idPedido) {
  let objeto = {
    cantidad: producto.cantidad,
    pedido: {
      id: idPedido,
    },
    producto: {
      id: producto.id,
    },
  };

  $.ajax({
    type: "POST",
    url: baseUrl + pathProductoXPedido + "/save",
    data: JSON.stringify(objeto),
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    success: function (response) {
      alert("Pedido guardado satisfactoriamente!");
    },
  });
}
