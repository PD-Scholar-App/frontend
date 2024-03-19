document.querySelector("#curso").addEventListener("submit", (e) => {
  e.preventDefault();

  let nome = document.querySelector("#nome").value;
  let anos = document.querySelector("#anos").value;
  let coordenador = document.querySelector("#coordenador").value;
  let tipo = document.querySelector("#tipo").value;
  let disciplinas = $("#disciplinasSelect")
    .select2("data")
    .map((disciplina) => disciplina.id);

  if (
    nome == "" ||
    anos == "" ||
    coordenador == "" ||
    tipo == "" ||
    disciplinas == []
  ) {
    Swal.fire({
      icon: "error",
      title: "Erro no Formulário",
      text: "Preenche os campos",
    });
  } else {
    const isNomeValid = typeof nome === "string";
    const isAnosValid = !isNaN(Number(anos));
    const isCoordenadorValid = typeof coordenador === "string";
    const isTipoValid = typeof tipo === "string";
    const isDisciplinasValid = typeof disciplinas === "object";

    if (
      !isNomeValid ||
      !isAnosValid ||
      !isCoordenadorValid ||
      !isTipoValid ||
      !isDisciplinasValid
    ) {
      Swal.fire({
        icon: "error",
        title: "Erro no Formulário",
        text: "Preencha os campos corretamente",
      });
    } else {
      createCurso();
    }
  }
});

async function createCurso() {
  const apiUrl = "http://127.0.0.1:8000/api/cursos";

  let nome = document.querySelector("#nome").value;
  let anos = Number(document.querySelector("#anos").value);
  let coordenador = document.querySelector("#coordenador").value;
  let tipo = document.querySelector("#tipo").value;
  let disciplinas = $("#disciplinasSelect")
    .select2("data")
    .map((disciplina) => disciplina.id);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if required
      },
      body: JSON.stringify({
        nome: nome,
        anos: anos,
        coordenador: coordenador,
        tipo: tipo,
        disciplina: disciplinas,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      populateTableCursos();
      Swal.fire({
        icon: "success",
        title: "Criada",
        text: "Disciplina criada com sucesso",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao criar a disciplina",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro ao criar a disciplina",
    });
  }
}

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

function populateSelect() {
  fetch("http://127.0.0.1:8000/api/disciplinas")
    .then((response) => response.json())
    .then((data) => {
      const selectElement = document.getElementById("disciplinasSelect");
      selectElement.innerHTML = "";

      data.forEach((item) => {
        const option = document.createElement("option");
        option.textContent = item.nome;
        option.value = item.id;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

document.addEventListener("DOMContentLoaded", populateSelect);
