var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

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

}

var createTaskEl = function(taskDataObj) {
        //Create list item
        var listItemEl = document.createElement("li");

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
        listItemEl.className = "task-item";
        listItemEl.appendChild(taskInfoEl);
        tasksToDoEl.appendChild(listItemEl);

}

formEl.addEventListener("submit", taskFormHandler);
