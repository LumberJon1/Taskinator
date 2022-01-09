var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var taskIDCounter = 0;

//Storage array for the task objects
var tasks = [];

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
            type: taskTypeInput,
            status: "to do"
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

    //Set values in the tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskID)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    saveTasks();

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

        //Add the object info to the tasks array for local storage
        taskDataObj.id = taskIDCounter;
        tasks.push(taskDataObj);

        //Create the task actions and append to the task element
        var taskActionsEl = createTaskActions(taskIDCounter);
        listItemEl.appendChild(taskActionsEl);

        //Append the entire task to the to-do element
        tasksToDoEl.appendChild(listItemEl);

        saveTasks();

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

    //Create a new copy of the Tasks array to update
    updatedTasks = [];

    //Loop through the array and compare each task to the current ID for the one to be deleted,
    //only pushing ones that are not being deleted.
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i] !== parseInt(taskID)) {
            updatedTasks.push(tasks[i]);
        }
    }

    //Update the tasks array with the new values
    tasks = updatedTasks;

    saveTasks();
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

    // update task status in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskID)) {
            tasks[i].status = statusValue;
        }
    };

    saveTasks();

};

var saveTasks = function() {
    //Stringify the objects and throw them in local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    //Get tasks from localStorage
    tasks = localStorage.getItem("tasks");
    console.log(tasks);

    if (tasks === null) {
        tasks = [];
        return false;
    }

    //Convert from string back to objects array
    tasks = JSON.parse(tasks);

    //Iterate through tasks and create elements on the page from them
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].id = taskIDCounter;

        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id);

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>"+tasks[i].name+"</h3><span class='task-type'>"+tasks[i].type+"</span>";
    
        listItemEl.appendChild(taskInfoEl);

        taskActionsEl = createTaskActions(tasks[i].id);

        listItemEl.appendChild(taskActionsEl);

        console.log(listItemEl);

        if (tasks[i].status === "to do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "in progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "completed") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        }

        taskIDCounter++;
    }

}

//Event listeners
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
