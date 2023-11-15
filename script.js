let todos = [];
let showFilter = 0;

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


btnShowAll.onclick = function () {
    showFilter = 0;
    render();
};

btnShowUncomplete.onclick = function () {
    showFilter = 1;
    render();
};

btnShowCompleted.onclick = function () {
    showFilter = 2;
    render();
};

btnClearCompleted.onclick = function () {
    todos = todos.filter(td => td.completed === false);
    render();
};

btnCompleteAll.onclick = function () {
    todos.forEach(td => td.completed = true);
    render();
};

btnAddTodo.onclick = function () {

    const todoName = txtAddTodo.value;

    if (!todoName) {
        alert('Please enter todo name');
        return;
    }

    const newTodo = { name: todoName, completed: false };

    txtAddTodo.value = '';

    todos.unshift(newTodo);

    render();

};


function render() {

    [btnShowAll, btnShowUncomplete, btnShowCompleted].forEach(btn => btn.classList.remove('txt-black'));

    btns.children[showFilter].classList.add('txt-black');

    const noOfLeftTodos = todos.filter(td => td.completed === false).reduce((total) => ++total, 0);

    divTasksLeft.innerText = `${noOfLeftTodos === 0 ? 'No' : noOfLeftTodos} tasks left`;

    ulTodoList.innerHTML = '';

    const filtered = showFilter === 0 ? todos : showFilter === 1 ? todos.filter(td => td.completed === false) : todos.filter(td => td.completed === true);

    for (let todo of filtered) {
        const li = getTodoLiElement(todo);
        ulTodoList.appendChild(li);
    }

    synchronize();

}


function synchronize() {
    localStorage.clear();
    localStorage.setItem('data', JSON.stringify(todos));
}


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


function loadData() {
    const data = localStorage.getItem('data');
    todos = data ? JSON.parse(data) : [];
    render();
}

loadData();