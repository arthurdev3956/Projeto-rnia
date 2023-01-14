const modal = document.getElementById("modal");
const form = document.getElementById("subscribe");
const buttonConfirm = document.getElementById("confirm-delete");
let currentTask = null;

const openModal = () => { //função para abrir o modal
  modal.style.display = "block";
};

const closeModal = () => { //função para fechar o modal e devolver valores vazios
  modal.style.display = "none";
  document.getElementById("number").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  document.getElementById("option").value = "";
};

const openAlert = (id) => { //função para abrir o modal de delete
  const alert = document.getElementById("alert");
  alert.style.display = "block";
  alert.setAttribute('data-id', id)
};
const closeAlert = () => { //função para fechar o modal de delete
  const close = document.getElementById("alert");
  close.style.display = "none";
};
const getTasks = async () => { //função para buscar a lista de tarefa na api
  const apiResponse = await fetch("json-server-production-185b.up.railway.app/Posts");
  const resultTask = await apiResponse.json();
  return resultTask;
};
const getTask = async (id) => { //função para buscar uma tarefa específica na ap
  const apiResponse = await fetch(`json-server-production-185b.up.railway.app/Posts/${id}`);
  const resultTasks = await apiResponse.json();
  return resultTasks;
};
const saveTask = async (tasks) => { //função para salvar uma tarefa
  if (currentTask === null) {
    await createTask(tasks);
  } else {
    await updateTask(currentTask.id, tasks);
    currentTask = null;
  }
  closeModal();
  loadTask();
};

window.addEventListener("click", (event) => { //um evento que quando se ouve um clique é usado para executar duas coisas diferemtes
  
  if (event.target === modal) {
    closeModal();
  }
  if (event.target.id === "confirm-delete" ){
    const alert = document.getElementById("alert");
   const taskid = alert.getAttribute('data-id')
   deleteTasks(taskid)
  }
});

form.addEventListener("submit", (event) => { //evento de submit que salva os dados recebidos em variaveis 
                                             //e depois forma um objeto e salva em uma unica variavel
  event.preventDefault();

  const number = form.elements["number"].value;
  const description = form.elements["description"].value;
  const date = form.elements["date"].value;
  const option = form.elements["option"].value;

  const tasks = {
    number,
    description,
    date,
    option,
  };

  saveTask(tasks);
});

const createTask = async (tasks) => { //função que cria a tarefa
  await fetch("json-server-production-185b.up.railway.app/Posts", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tasks),
  });
};
const updateTask = async (id, tasks) => { //essa função é para editar a tarefa
  await fetch(`json-server-production-185b.up.railway.app/Posts/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tasks),
  });
  loadTask();
};
const deleteTasks = async (id) => { //funçao para deletar tarefa

  await fetch(`json-server-production-185b.up.railway.app/Posts/${id}`, {
    method: "DELETE",
  });
  closeAlert();
  loadTask();
};
const renderTask = (resultTask) => { //essa função renderiza na tela em html os dados recebidos pelo js
  const tasktable = document.getElementById("tableid");
  tasktable.innerHTML = "";

  resultTask.forEach((tasks) => {
    if (tasks.option === "Concluído") {
      cor = "green";
    } else if (tasks.option === "Em andamento") {
      cor = "orange";
    } else if (tasks.option === "Pausado") {
      cor = "red";
    }
    const taskid = tasks.id
    
    tasktable.innerHTML =
      tasktable.innerHTML +
      `
                <tr class="edit-tr">
                    <td>${tasks.number}</td>
                    <td>${tasks.description}</td>
                    <td>${tasks.date.split('-').reverse().join('/')}</td>
                    <td class="${cor}">${tasks.option}</td>
                    <td>
                    <button class="delete-button" type="button" onclick="editTask(${taskid})" ><img src="./imagens/Vector (3).png" height ="20" width="20" /></button>

                    <button class="delete-button" data-id="${taskid}" id="button-delete-task-${taskid}" onclick="openAlert(${taskid})"><img src="./imagens/Vector (2).png" height ="20" width="20" /></button>
                    
                
                    </td>
                    
                </tr>
                
    
        
  `;
  });
};
const loadTask = async () => { //essa função busca as coisas na api e depois é chamada para renderizar na tela
  const newtask = await getTasks();
  renderTask(newtask);
};

const editTask = async (id) => { //essa função edita as tarefas já existentes
  currentTask = await getTask(id);
  document.getElementById("number").value = currentTask.number;
  document.getElementById("description").value = currentTask.description;
  document.getElementById("date").value = currentTask.date;
  document.getElementById("option").value = currentTask.option;
  openModal();
};
loadTask();
