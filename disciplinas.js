function clearFields() {
  document.querySelector("#nome").value = "";
  document.querySelector("#tipo").value = "";
  document.querySelector("#etcs").value = "";
}

document.querySelector("#disciplina").addEventListener("submit", (e) => {
  e.preventDefault();

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
});

async function createDisciplina() {
  const apiUrl = "http://127.0.0.1:8000/api/disciplinas";

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
    const response = await fetch("http://127.0.0.1:8000/api/disciplinas");

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

  if (!disciplinas) {
    console.log("No disciplinas data available");
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
            <a href="" class="w-100 mb-2 btn btn-warning btn-sm edit" >Editar</a>
            <a href="" class="w-100 mb-2 btn btn-danger btn-sm delete">Apagar</a>
        </td>
      `;
    tableBody.appendChild(row);
  });
}

// Populate the table when the page loads
document.addEventListener("DOMContentLoaded", populateTableDisciplinas);
