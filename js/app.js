/* elements et variables global  */
const addTodoBtn = document.getElementById('add-todo-btn');
const todosNav = document.getElementById('todos-nav');
let todoListArray = [];
let todosFilter = 'tout';
let filteredTodos = [];

/*functions  localStorage */
const saveTodos = () => {
  const todoListJson = JSON.stringify(todoListArray);
  localStorage.setItem('todoList', todoListJson);
};

const getTodos = () => JSON.parse(localStorage.getItem('todoList')) || [];

// Ajouter une nouvelle taches
addTodoBtn.addEventListener('click', (event) => {
  event.preventDefault();

  // recuperer les elements d'input
  const todoText = document.getElementById('todo-text').value;
  const todoDate = document.getElementById('todo-date').value;

  // si le texte et la date ne sont pas vides.
  if (todoText && todoDate) {
    // Créez un nouvel objet Todo.
    const todo = {
      text: todoText,
      date: todoDate,
      state: 'enattend',
      id: new Date().getTime(),
    };

    //Ajoutez la tâche au tableau.
    todoListArray = [...todoListArray, todo];

    //Enregistrez et chargez les tâches.
    saveTodos();
    if (todosFilter === 'tout') {
      loadTodos();
    } else {
      filterTodos(todosFilter);
    }

    // Réinitialisez le formulaire.
    document.getElementById('todo-text').value = '';
    document.getElementById('todo-date').value = '';
  }
});

// Chargez les tâches. 
const loadTodos = (filter, filteredTodos) => {
  const todosList = sortTodos(filteredTodos);
  const todoList = document.getElementById('todos-list');
  todoList.innerHTML = '';

  if (todosList.length === 0) {
    // S'il n'y a pas de tâches, affichez un message de liste vide.
    const emptyListString = filter
      ? `Pas des taches ${filter} !`
      : `Pas de taches disponibles!`;
    todoList.innerHTML = `<p style="text-align:center;">${emptyListString}</p>`;
  } else {
    // Si la liste n'est pas vide, parcourez chaque tâche.
    todosList.forEach((todo) => {
      // Créez un élément de liste et définissez son ID  et sa classe.
      const todoItem = document.createElement('li');
      todoItem.dataset.id = todo.id;
      todoItem.classList = todo.state;

      // Créez le code HTML de la tâche et ajoutez-le à l'élément de liste.
      const todoElement = createTodoElement(todo);
      todoItem.innerHTML = todoElement;
      todoList.appendChild(todoItem);
    });
  }
};

// Trier les tâches par date.
const sortTodos = (filteredTodos) => {
  const todoList = filteredTodos ? filteredTodos : getTodos();
  todoListArray = getTodos();

  todoList.sort((a, b) => {
    // Comparez les États.
    if (a.state === b.state) {
      // Si les États sont les mêmes, comparez les dates. 
      return new Date(a.date) - new Date(b.date);
    } else {
      // Si les états sont différents, les tâches terminées viennent en dernier.
      return a.state === 'complete' ? 1 : -1;
    }
  });

  return todoList;
};

//   Créez l'élément Todo.
const createTodoElement = (todo) => {
  const aujourdhui = new Date().setHours(0, 0, 0, 0);
  const enretard =
    dateStringToDate(formatDate(todo.date)) < aujourdhui && todo.state === 'enattend';
  const todoDateClass = enretard ? 'todo-date enretard' : 'todo-date';
  const todoButtonIconClass =
    todo.state === 'enattend' ? 'fa-circle' : 'fa-circle-check';

  return `
    <div class="todo">
      <button class="todo-btn"><i class="fa-regular ${todoButtonIconClass}"></i></button>
      <div>
        <p class="todo-text">${todo.text}</p>
        <span class="${todoDateClass}">${formatDate(todo.date)}</span>
      </div>
    </div>
    <button style="color:red"; class="delete-btn"><i class="fa-solid fa-trash"></i></button>
  `;
};

 /* Gestion des tâches */
// Vérifiez l'état Todo ou supprimez le clic button.
document.body.addEventListener('click', (event) => {
  if (event.target.closest('.todo-btn')) {
    const todoItem = event.target.closest('li');
    toggleTodoState(todoItem);
  }

  if (event.target.closest('.delete-btn')) {
    const todoItem = event.target.closest('li');
    deleteTodo(todoItem);
  }
});

// Basculer l'état Todo.
const toggleTodoState = (todoItem) => {
  const todo = todoListArray.find(
    (todo) => todo.id === Number(todoItem.dataset.id)
  );

  // Basculez l'état.
  if (todo.state === 'enattend') {
    todo.state = 'complete';
    todoItem.classList = 'complete';
    todoItem.querySelector('.fa-regular').classList =
      'fa-regular fa-circle-check';
  } else if (todo.state === 'complete') {
    todo.state = 'enattend';
    todoItem.classList = 'enattend';
    todoItem.querySelector('.fa-regular').classList = 'fa-regular fa-circle';
  }

  saveTodos();
};

const deleteTodo = (todoItem) => {
  let todos = filteredTodos.length > 0 ? filteredTodos : todoListArray;

  // Supprimez la tâche de la liste filtrée et de la liste principale.
  todos = todos.filter((todo) => todo.id !== Number(todoItem.dataset.id));
  todoListArray = todoListArray.filter(
    (todo) => todo.id !== Number(todoItem.dataset.id)
  );

  saveTodos();
  loadTodos(todosFilter, todos);
};

 /* filtrer les tâches */
todosNav.addEventListener('click', (event) => {
  const navButtons = todosNav.querySelectorAll('button');

  // Supprimez la classe active de tous les boutons.
  navButtons.forEach((button) => (button.classList = ''));

  // Ajoutez la classe active au bouton sur lequel vous avez cliqué.
  const button = event.target.closest('button');
  if (button) {
    button.classList = 'active';
    const filter = button.dataset.filter;
    filterTodos(filter);
  }
});

const filterTodos = (filter) => {
  todosFilter = filter;
  const aujourdhui = new Date().setHours(0, 0, 0, 0);

  switch (filter) {
    case 'aujourdhui':
      filteredTodos = getAujourdhuiTodos(aujourdhui);
      loadTodos(filter, filteredTodos);
      break;

    case 'enretard':
      filteredTodos = getEnretardTodos(aujourdhui);
      loadTodos(filter, filteredTodos);
      break;

    case 'programmer':
      filteredTodos = getProgrammerTodos(aujourdhui);
      loadTodos(filter, filteredTodos);
      break;

    case 'enattend':
      filteredTodos = getStateTodos('enattend');
      loadTodos(filter, filteredTodos);
      break;

    case 'complete':
      filteredTodos = getStateTodos('complete');
      loadTodos(filter, filteredTodos);
      break;

    case 'tout':
    default:
      filteredTodos = [];
      loadTodos();
      break;
  }
};

const getAujourdhuiTodos = (aujourdhui) => {
  const todayFormatted = formatDate(aujourdhui);
  const todayTodos = todoListArray.filter(
    (todo) =>
      formatDate(todo.date) === todayFormatted && todo.state === 'enattend'
  );

  return todayTodos;
};

const getEnretardTodos = (aujourdhui) => {
  const enretardTodos = todoListArray.filter(
    (todo) =>
      dateStringToDate(formatDate(todo.date)) < aujourdhui &&
      todo.state === 'enattend'
  );

  return enretardTodos;
};

const getProgrammerTodos = (aujourdhui) => {
  const programmerTodos = todoListArray.filter(
    (todo) =>
      dateStringToDate(formatDate(todo.date)) > aujourdhui &&
      todo.state === 'enattend'
  );

  return programmerTodos;
};

const getStateTodos = (state) => {
  const stateTodos = todoListArray.filter((todo) => todo.state === state);
  return stateTodos;
};

 /* Fonctions utilitaires */
// Convertissez la chaîne de date en objet de date à des fins de comparaison.
const dateStringToDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day);
};

//  Formater la date de fin en jj/mm/aaaa
const formatDate = (todoDate) => {
  const date = new Date(todoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

//   Charger les tâches lors du chargement de la page
loadTodos();



                