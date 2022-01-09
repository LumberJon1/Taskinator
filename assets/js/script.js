var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var taskIDCounter = 0;

var taskFormHandler = function(event) {

    event.preventDefault(); //Prevents the browser from clearing form submissions

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    var isEdit = formEl.hasAttribute("data-task-id");
    console.log(isEdit);

    //Handler if we are dealing with an edit to an existing task
    if (isEdit) {
        var taskID = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskID);
    }
    else {
        //package data as a new object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        }

        //call the createTaskEl function
        createTaskEl(taskDataObj);
    }

    formEl.reset();

};

var completeEditTask = function(taskName, taskType, taskID) {
    //Find the correct list item
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskID+"']");

    //Set the new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("task updated!");

    //Reset form for user and clear ID
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

}

var createTaskEl = function(taskDataObj) {
        //Create list item
        var listItemEl = document.createElement("li");
        listItemEl.setAttribute("data-task-id", taskIDCounter);

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

var taskButtonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches(".delete-btn")) {
        var taskID = targetEl.getAttribute("data-task-id");
        //Remove the task
        deleteTask(taskID);
    }
    else if (targetEl.matches(".edit-btn")) {
        var taskID = targetEl.getAttribute("data-task-id");
        //Edit the task
        editTask(taskID);
    }
};

var deleteTask = function(taskID) {
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskID+"']");
    taskSelected.remove();
};

var editTask = function(taskID) {

    //Pull data from the selected task to load into the form
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskID+"']");
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    //Pull the values into the form input to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    //Change the form input button so it prompts user to submit changes
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskID);
}

var taskStatusChangeHandler = function(event) {

    //Find the item's ID
    var taskID = event.target.getAttribute("data-task-id");

    //Get current status value from select element and use to place in proper list
    console.log("event.target:", event.target);
    console.log("event.target.value: ", event.target.value);
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskID+"']");

    //Because we did not make a document.createElement() for the task item, we will append it to
    //a new corresponding ul element.
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

};

//Event listeners
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
