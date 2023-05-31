const newTaskInput = document.querySelector(".new-task-text-input");
const newTaskDescriptionInput = document.querySelector(".new-task-description-input");
const btnAdd = document.querySelector("#btn-add");
const btnSave = document.querySelector("#btn-save");
const tasksRow = document.querySelector('.tasks-row');
const btnDeleteSelected = document.querySelector(".btn-delete-selected");
const chackedTasksId = new Set();

initTasks();

class Task {
    constructor(text, description){
        this.text = text.trim();
        this.description = description.trim();
        this.id = Task.getUniqueId();
    }
    static getUniqueId(){
        return Math.random().toString(36) + Math.random().toString(36);
    }
}

function deleteTask(taskId){
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    taskElement.remove();

    const tasks = getTasksFromStorage();
    const foundTaskIndex = tasks.findIndex(task => task.id === taskId);

    tasks.splice(foundTaskIndex, 1);

    if(tasks.length === 0) {
        btnDeleteSelected.classList.add("btn-hide");
    }

    saveTasksToStorage(tasks);
}

function addCheckedTasksId(taskId) {
    if(chackedTasksId.has(taskId)) {
        chackedTasksId.delete(taskId);
        btnDeleteSelected.classList.add("btn-disabled");
    }
    else {
        chackedTasksId.add(taskId);
        btnDeleteSelected.classList.remove("btn-disabled");
    }
}

function addNewTask(){
    const text = newTaskInput.value;
    const description = newTaskDescriptionInput.value;

    if(!text || !description){
        return;
    }

    const task = new Task(text, description);
    newTaskInput.value = '';
    newTaskDescriptionInput.value = '';
    tasksRow.innerHTML += getTaskTemplate(task);

    const tasks = getTasksFromStorage();
    tasks.push(task);

    saveTasksToStorage(tasks);
}

newTaskInput.onkeydown = (event)=>{
    if(event.code === 'Enter'){
        addNewTask();
    }
}

newTaskDescriptionInput.onkeydown = (event)=>{
    if(event.code === 'Enter'){
        addNewTask();
    }
}

btnAdd.onclick = ()=>{
    addNewTask();
    const tasks = getTasksFromStorage();
    if(tasks.length > 0) {
        btnDeleteSelected.classList.remove("btn-hide");
    }
};

btnDeleteSelected.onclick = () => {
    chackedTasksId.forEach(id => {
        deleteTask(id);
    });
    chackedTasksId.clear();
    btnDeleteSelected.classList.add("btn-disabled");
}

function editTask(taskText, taskDescription, taskId) {
    newTaskInput.value = taskText;
    newTaskDescriptionInput.value = taskDescription;
    btnAdd.classList.add("btn-hide");
    btnSave.classList.remove("btn-hide");

    btnSave.onclick = () => {
        const tasks = getTasksFromStorage();
        const foundTaskIndex = tasks.findIndex(task => task.id === taskId);

        tasks[foundTaskIndex].text = newTaskInput.value;
        tasks[foundTaskIndex].description = newTaskDescriptionInput.value;

        const taskElement = document.querySelector(`[data-task-text-id="${taskId}"]`);
        taskElement.innerText = tasks[foundTaskIndex].text;

        const taskTitle = document.querySelector(`[data-task-title-id="${taskId}"]`);
        taskTitle.innerText = tasks[foundTaskIndex].description;

        newTaskInput.value = "";
        newTaskDescriptionInput.value = "";

        btnSave.classList.add("btn-hide");
        btnAdd.classList.remove("btn-hide");
        saveTasksToStorage(tasks);
    }
}

function getTasksFromStorage(){
    const tasksStr = localStorage.getItem('tasks');
    if(!tasksStr){
        return [];
    }
    const tasks = JSON.parse(tasksStr);
    if(tasks.length > 0) {
        btnDeleteSelected.classList.remove ("btn-hide");
    }
    return tasks;
}

function saveTasksToStorage(tasks){
    const tasksStr = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasksStr);
}

function getTaskTemplate(task){

    const newTaskTemplate = `
        <div class="col-lg-4 col-md-8 col-10 justify-content-center mt-3" data-task-id='${task.id}'>
            <div class="card task">
                <div class="card-body ">
                    <div class="title-checkbox-wrapper mb-2">
                        <h5 class="card-title" data-task-title-id='${task.id}'>${task.description}</h5></h5>
                        <input class="form-check-input fa-xl checkbox-style border-dark task-checkbox" 
                        type="checkbox" 
                        value="" id="flexCheckDefault"
                        onclick="addCheckedTasksId('${task.id}')">
                    </div>
                
                    <p class="card-text overflow-y-auto task-inner-text" data-task-text-id='${task.id}'>${task.text}</p>

                    <div class="icons-wrapper mt-2">
                        <i class="fas fa-edit edit-icon"
                        onclick="editTask('${task.text}' , '${task.description}', '${task.id}')"></i>
                        <i class="fa-solid fa-box-archive fa-xl mt-1 mb-3 archive-icon"
                        onclick="deleteTask('${task.id}')"></i>
                    </div>
                    
                </div>
            </div>
        </div>
    `;

return newTaskTemplate;
}

function initTasks(){
    const tasks = getTasksFromStorage();
    tasks.forEach((task)=>{
    tasksRow.innerHTML += getTaskTemplate(task);
});
}








