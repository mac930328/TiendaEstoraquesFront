const baseUrl = "http://168.138.128.187:8080";
const path = "/api/producto";
let productos = [];

$(document).ready(function () {
  mostrarAgregar();
  obtenerProductos();
});

function mostrarAgregar() {
  $("#btnAgregar").show();
  $("#btnActualizar").hide();
}

function obtenerProductos() {
  $.ajax({
    type: "GET",
    url: baseUrl + path + "/all",
    dataType: "json",
    success: function (response) {
      if (response.length > 0) {
        productos = response;
        armarTabla(response);
      } else {
        noHayRegistros();
      }
    },
  });
}

function armarTabla(array) {
  let tabla =
    '<thead><tr><th scope="col">Nombre</th><th scope="col">Precio</th><th scope="col">Cantidad</th><th scope="col">Acciones</th></tr></thead>';
  tabla += "<tbody>";
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

function agregarProducto() {
  let objeto = {
    nombre: $("#nombre").val(),
    precio: parseInt($("#precio").val()),
    cantidad: parseInt($("#cantidad").val()),
  };

  $.ajax({
    type: "POST",
    url: baseUrl + path + "/save",
    data: JSON.stringify(objeto),
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    success: function (response) {
      obtenerProductos();
      limpiarInput();
    },
  });
}

function limpiarInput() {
  $("#nombre").val("");
  $("#precio").val("");
  $("#cantidad").val("");
}

function mostrarProducto(indice) {
  let objeto = productos[indice];
  $("#nombre").val(objeto.nombre);
  $("#precio").val(objeto.precio);
  $("#cantidad").val(objeto.cantidad);

  $("#btnAgregar").hide();
  $("#btnActualizar").show();
  $("#btnActualizar").click(function () {
    actualizarProducto(objeto.id);
  });
}

function actualizarProducto(id) {
  let objeto = {
    id: id,
    nombre: $("#nombre").val(),
    precio: parseInt($("#precio").val()),
    cantidad: parseInt($("#cantidad").val()),
  };

  $.ajax({
    type: "PUT",
    url: baseUrl + path + "/update",
    data: JSON.stringify(objeto),
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    success: function (response) {
      obtenerProductos();
      limpiarInput();
      mostrarAgregar();
    },
  });
}

function eliminarProducto(id) {
  $.ajax({
    type: "DELETE",
    url: baseUrl + path + "/" + id,
    dataType: "json",
    success: function (response) {
      obtenerProductos();
    },
  });
}

function buscarProducto() {
  let id = $("#codigo").val();
  if (id !== "") {
    $.ajax({
      type: "GET",
      url: baseUrl + path + "/" + id,
      dataType: "json",
      success: function (response) {
        let array = [];
        if (response !== null) {
          array.push(response);
        }
        if (array.length > 0) {
          productos = array;
          armarTabla(array);
        } else {
          noHayRegistros();
        }
        $("#codigo").val("");
      },
    });
  }else{
    alert("Debe ingresar un codigo a buscar")
  }
}
