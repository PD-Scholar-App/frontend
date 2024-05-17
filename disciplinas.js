async function createDisciplina() {
  const apiUrl = "http://127.0.0.1:80/api/disciplinas";

  let nome = document.querySelector("#nome").value;
  let tipo = document.querySelector("#tipo").value;
  let etcs = Number(document.querySelector("#etcs").value);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if required
      },
      body: JSON.stringify({
        nome: nome,
        tipo: tipo,
        etcs: etcs,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      populateTableDisciplinas();
      Swal.fire({
        icon: "success",
        title: "Criada",
        text: "Disciplina criada com sucesso",
      });
      $("#adicionarDisciplina").modal("hide");
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

async function getDisciplinas() {
  try {
    const response = await fetch("http://127.0.0.1:80/api/disciplinas");

    if (!response.ok) {
      throw new Error("Failed to fetch disciplinas");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching disciplinas:", error);
    return null;
  }
}

async function populateTableDisciplinas() {
  const disciplinas = await getDisciplinas();
  const tableBody = document.querySelector("#tabelaDisciplinas tbody");

  tableBody.innerHTML = "";

  if (!disciplinas) {
    console.log("No disciplinas data available");
    const row = document.createElement("tr");
    row.innerHTML = `Sem resultados`;
    tableBody.appendChild(row);

    return;
  }

  disciplinas.forEach((disciplinas) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${disciplinas.id}</td>
        <td>${disciplinas.nome}</td>
        <td>${disciplinas.tipo}</td>
        <td>${disciplinas.etcs}</td>
        <td> 
            <button class="w-100 mb-2 btn btn-warning btn-sm edit-disciplina" data-bs-toggle="modal" data-bs-target="#adicionarDisciplina" data-disciplina="${disciplinas.id}">Editar</button>
            <button class="w-100 mb-2 btn btn-danger btn-sm delete" data-disciplina="${disciplinas.id}">Apagar</button>
        </td>
      `;
    tableBody.appendChild(row);
  });
}

// add a click event listener to the document
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("create")) {
    event.preventDefault();

    let nome = document.querySelector("#nome").value;
    let tipo = document.querySelector("#tipo").value;
    let etcs = document.querySelector("#etcs").value;

    if (nome == "" || tipo == "" || etcs == "") {
      Swal.fire({
        icon: "error",
        title: "Erro no Formulário",
        text: "Preenche os campos",
      });
    } else {
      const isNomeValid = typeof nome === "string";
      const isTipoValid = typeof tipo === "string";
      const isEtcsValid = !isNaN(Number(etcs));

      if (!isNomeValid || !isTipoValid || !isEtcsValid) {
        Swal.fire({
          icon: "error",
          title: "Erro no Formulário",
          text: "Preencha os campos corretamente",
        });
      } else {
        createDisciplina();
      }
    }
  }

  if (event.target.classList.contains("edit")) {
    event.preventDefault();

    let nome = document.querySelector("#nome").value;
    let tipo = document.querySelector("#tipo").value;
    let etcs = document.querySelector("#etcs").value;

    if (nome == "" || tipo == "" || etcs == "") {
      Swal.fire({
        icon: "error",
        title: "Erro no Formulário",
        text: "Preenche os campos",
      });
    } else {
      const isNomeValid = typeof nome === "string";
      const isTipoValid = typeof tipo === "string";
      const isEtcsValid = !isNaN(Number(etcs));

      if (!isNomeValid || !isTipoValid || !isEtcsValid) {
        Swal.fire({
          icon: "error",
          title: "Erro no Formulário",
          text: "Preencha os campos corretamente",
        });
      } else {
        const disciplinaId = event.target.getAttribute("data-disciplina");
        updateDisciplina(disciplinaId);
      }
    }
  }

  if (event.target.classList.contains("delete")) {
    const disciplinaId = event.target.getAttribute("data-disciplina");
    deleteDisciplina(disciplinaId);
  }

  if (event.target.classList.contains("edit-disciplina")) {
    const disciplinaId = event.target.getAttribute("data-disciplina");
    populateInputsForEdit(disciplinaId);
  }
});

async function deleteDisciplina(disciplinaId) {
  const apiUrl = `http://127.0.0.1:80/api/disciplinas/${disciplinaId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      populateTableDisciplinas();
      Swal.fire({
        icon: "success",
        title: "Eliminada",
        text: "Disciplina eliminada com sucesso",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro a eliminar a disciplina",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro a eliminar a disciplina",
    });
  }
}

async function getDisciplinaById(disciplinaId) {
  try {
    const response = await fetch(
      `http://127.0.0.1:80/api/disciplinas/${disciplinaId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch disciplina by id");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching disciplina by id:", error);
    return null;
  }
}

async function populateInputsForEdit(disciplinaId) {
  const disciplina = await getDisciplinaById(disciplinaId);

  if (!disciplina) {
    throw new Error("Failed to fetch disciplina data");
  }

  document.querySelector("#nome").value = disciplina.nome;
  document.querySelector("#tipo").value = disciplina.tipo;
  document.querySelector("#etcs").value = disciplina.etcs;

  // Add data-disciplina attribute to the submit button
  const submitButton = document.querySelector('input[type="submit"]');
  submitButton.setAttribute("data-disciplina", disciplinaId);

  // Change button text and add class for edit mode
  submitButton.value = "Guardar";
  submitButton.classList.add("edit");
  submitButton.classList.remove("create");
}

async function updateDisciplina(disciplinaId) {
  const apiUrl = `http://127.0.0.1:80/api/disciplinas/${disciplinaId}`;

  let nome = document.querySelector("#nome").value;
  let tipo = document.querySelector("#tipo").value;
  let etcs = Number(document.querySelector("#etcs").value);

  console.log(nome, tipo, etcs, apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nome,
        tipo: tipo,
        etcs: etcs,
      }),
    });

    console.log(
      response,
      JSON.stringify({
        nome: nome,
        tipo: tipo,
        etcs: etcs,
      })
    );

    if (response.ok) {
      populateTableDisciplinas(); // Assuming this function reloads the table data
      Swal.fire({
        icon: "success",
        title: "Atualizada",
        text: "Disciplina atualizada com sucesso",
      });
      $("#adicionarDisciplina").modal("hide");
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao atualizar a disciplina",
      });
    }
    document.getElementById("adicionarDisciplina").style.display = "none";
  } catch (error) {
    console.log("Error updating disciplina:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro ao atualizar a disciplina",
    });
  }
}

// Populate the table when the page loads
document.addEventListener("DOMContentLoaded", populateTableDisciplinas);
