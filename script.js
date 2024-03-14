var selectRow = null;

function showAlert(message, className) {
  const div = document.createElement("div");
  div.className = "alert alert-${className}";

  div.appendChild(document.createTextNode(message));
  const container = document.querySelector(".container");
  const main = document.querySelector(".main");
  container.insertBefore(div, main);
}

function clearFields() {
  document.querySelector("#nome").value = "";
  document.querySelector("#anos").value = "";
  document.querySelector("#coordenador").value = "";
  document.querySelector("#tipo").value = "";
}

document.querySelector("#curso").addEventListener("submit", (e) => {
  e.preventDefault();

  let nome = document.querySelector("#nome").value;
  let anos = document.querySelector("#anos").value;
  let coordenador = document.querySelector("#coordenador").value;
  let tipo = document.querySelector("#tipo").value;

  if (nome == "" || anos == "" || coordenador == "" || tipo == "") {
    Swal.fire({
      icon: "error",
      title: "Erro no Formulário",
      text: "Preenche os campos",
    });
  } else {
    if (selectRow == null) {
    }
  }
});

async function getCursos() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/cursos");

    if (!response.ok) {
      throw new Error("Failed to fetch cursos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cursos:", error);
    return null;
  }
}

async function populateTableCursos() {
  const cursos = await getCursos();
  const tableBody = document.querySelector("#tabelaCursos tbody");

  if (!cursos) {
    console.log("No cursos data available");
    return;
  }

  cursos.forEach((curso) => {
    console.log(curso);
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${curso.id}</td>
        <td>${curso.nome}</td>
        <td>${curso.anos}</td>
        <td>${curso.coordenador}</td>
        <td>${curso.tipo}</td>
        <td>
            <a href="" class="w-100 mb-2 btn btn-warning btn-sm edit">Editar</a>
            <a href="" class="w-100 mb-2 btn btn-danger btn-sm delete">Apagar</a>
        </td>
      `;
    tableBody.appendChild(row);
  });
}

// Populate the table when the page loads
document.addEventListener("DOMContentLoaded", populateTableCursos);
