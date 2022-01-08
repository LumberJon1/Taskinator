var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskIDCounter = 0;

var taskFormHandler = function(event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //package data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    }

    //call the createTaskEl function
    createTaskEl(taskDataObj);

    formEl.reset();

};

var createTaskEl = function(taskDataObj) {
        //Create list item
        var listItemEl = document.createElement("li");
        listItemEl.setAttribute("data-task-id", taskIDCounter);
        console.log(listItemEl.getAttribute("data-task-id"));

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
        listItemEl.className = "task-item";
        listItemEl.appendChild(taskInfoEl);

        //Create the task actions and append to the task element
        var taskActionsEl = createTaskActions(taskIDCounter);
        listItemEl.appendChild(taskActionsEl);

        //Append the entire task to the to-do element
        tasksToDoEl.appendChild(listItemEl);

        taskIDCounter++;

};

var createTaskActions = function(taskID) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskID);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskID);

    actionContainerEl.appendChild(deleteButtonEl);

    //Create status dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskID);

    //Array to hold possible option children for the select dropdown
    var statusChoices = ["To Do", "In Progress", "Completed"];

    //Add each to the parent select element
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);
