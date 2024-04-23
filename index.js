async function getCursos() {
  try {
    const response = await fetch("http://127.0.0.1:80/api/cursos");

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

async function populateTableGeral() {
  const cursos = await getCursos();
  const tableBody = document.querySelector("#tableGeral tbody");

  if (!cursos) {
    console.log("No cursos data available");
    return;
  }

  cursos.forEach((curso) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${curso.id}</td>
    <td>${curso.nome}</td>
    <td>${curso.tipo}</td>
  `;

    let disciplinas = "";
    curso.disciplinas.forEach((disciplina, index) => {
      if (index === 0) {
        disciplinas += disciplina.nome;
      } else {
        disciplinas += ", " + disciplina.nome;
      }
    });

    row.innerHTML += `
    <td>${disciplinas}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Populate the table when the page loads
document.addEventListener("DOMContentLoaded", populateTableGeral);
