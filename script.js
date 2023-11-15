// array of todos
let todos = [];

// filter option -> 0 for all, 1 for uncomplete and 2 for complete
let showFilter = 0;


// dom elements reference
const divAddTodo = document.querySelector('#add-todo');
const btnAddTodo = divAddTodo.querySelector('button');
const txtAddTodo = divAddTodo.querySelector('input[type=text]');
const ulTodoList = document.querySelector('#todo-list');
const btnCompleteAll = document.querySelector('#complete-all');
const btnClearCompleted = document.querySelector('#clear-completed');
const btns = document.querySelector('#btns');
const btnShowAll = document.querySelector('#show-all');
const btnShowUncomplete = document.querySelector('#show-uncomplete');
const btnShowCompleted = document.querySelector('#show-completed');
const divTasksLeft = document.querySelector('#tasks-left');

// event handlers =============================

// all todos are shown, when clicked
btnShowAll.onclick = function () {
    showFilter = 0;
    render();
};

// only uncomplete todos are shown, when clicked
btnShowUncomplete.onclick = function () {
    showFilter = 1;
    render();
};

// only completed todos are shown, when clicked
btnShowCompleted.onclick = function () {
    showFilter = 2;
    render();
};

// completed todos are deleted, when clicked
btnClearCompleted.onclick = function () {
    todos = todos.filter(td => td.completed === false);
    render();
};

// all todos are marked as completed, when clicked
btnCompleteAll.onclick = function () {
    todos.forEach(td => td.completed = true);
    render();
};

// adds a new todo, when clicked
btnAddTodo.onclick = () => addTodo();


// adds a new todo, when 'enter' key is pressed
txtAddTodo.onkeypress = function (event) {
    if (event.keyCode !== 13) return;
    addTodo();
};

// function to add a new todo in the todos array
function addTodo() {

    const todoName = txtAddTodo.value;

    if (!todoName) {
        alert('Please enter todo name');
        return;
    }

    const newTodo = { name: todoName, completed: false };

    txtAddTodo.value = '';

    todos.unshift(newTodo);

    render();
}


// the sole purpose of this function is to render the UI, whenever
// state changes, influenced by React
function render() {

    [btnShowAll, btnShowUncomplete, btnShowCompleted].forEach(btn => btn.classList.remove('txt-black'));

    btns.children[showFilter].classList.add('txt-black');

    const noOfTodos = todos.reduce((total) => ++total, 0);

    divTasksLeft.innerText = `${noOfTodos === 0 ? 'No' : noOfTodos} tasks left`;

    ulTodoList.innerHTML = '';

    const filtered = showFilter === 0 ? todos : showFilter === 1 ? todos.filter(td => td.completed === false) : todos.filter(td => td.completed === true);

    for (let todo of filtered) {
        const li = getTodoLiElement(todo);
        ulTodoList.appendChild(li);
    }

    synchronizeToStorage();

}

// Whenever UI rendering happens, 
// application state is stored in localStorage
function synchronizeToStorage() {
    localStorage.clear();
    localStorage.setItem('data', JSON.stringify(todos));
}

// UI element that corresponds to each todo
function getTodoLiElement(todo) {

    const li = document.createElement('li');

    li.innerHTML = `<label class="form-control">
                        <input type="checkbox" name="checkbox" />
                        ${todo.name}
                    </label>
                    <img src="assets/close.png" alt="close-btn" class="delete-todo">`;

    const checkbox = li.querySelector('input');
    const img = li.querySelector('img');

    checkbox.checked = todo.completed;

    checkbox.onclick = function () {
        todo.completed = !todo.completed;
        render();
    };

    img.onclick = function () {
        todos = todos.filter(t => t !== todo);
        render();
    };

    return li;

}

// When page loads, todos are fetched from localStorage
// and initial UI rendering occurs.
function loadData() {
    const data = localStorage.getItem('data');
    todos = data ? JSON.parse(data) : [];
    render();
}

loadData();