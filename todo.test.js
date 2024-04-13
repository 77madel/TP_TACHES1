const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Lire le contenu du fichier HTML
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

// Créer une instance JSDOM
const dom = new JSDOM(html);

// Extraire window et document de l'instance JSDOM
global.window = dom.window;
global.document = dom.window.document;



const { dateStringToDate, formatDate } = require('./js/app.js');

// Importez les fonctions à tester
const { saveTodos, getTodos } = require('./js/app.js');

// Mock localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};

// Importez les fonctions à tester
const { addTodoBtn } = require('./js/app.js');

// Définissez un test pour la fonction addTodoBtn.addEventListener
test('Test de la fonction addTodoBtn.addEventListener', () => {
  // Créez un faux DOM avec jsdom
  const dom = new JSDOM('<!DOCTYPE html><div><input id="todo-text" value="Faire les courses"/><input id="todo-date" value="2024-04-15"/><button id="add-todo-btn">Ajouter une tâche</button></div>');

  // Définissez window et document à partir du DOM simulé
  global.document = dom.window.document;

  // Sélectionnez le bouton à partir du DOM simulé
  const addTodoBtn = document.getElementById('add-todo-btn');

  // Vérifiez si le bouton existe
  expect(addTodoBtn).toBeDefined();

  // Appelez la fonction à tester
  addTodoBtn.click();
});


// Importez les fonctions à tester
const { loadTodos } = require('./js/app.js');

// Définissez un test pour la fonction loadTodos
test('Test de la fonction loadTodos', () => {
  // Créez un faux DOM avec jsdom
  const dom = new JSDOM('<!DOCTYPE html><div id="todos-list"></div>');

  // Définissez document à partir du DOM simulé
  global.document = dom.window.document;

  // Définissez un exemple de données de tâches
  const mockTodos = [
    { id: 1,  date: '2024-04-15', state: 'enattend' },
    { id: 2,  date: '2024-04-16', state: 'complete' }
  ];

  // Appelez la fonction à tester avec les données de tâches simulées
  loadTodos(null, mockTodos);

  // Vérifiez si les tâches ont été correctement chargées dans le DOM
  const todoList = document.getElementById('todos-list');
  expect(todoList.children.length).toBe(mockTodos.length);

  // Vérifiez si les tâches ont été correctement ajoutées avec les bonnes classes et attributs
  mockTodos.forEach((todo, index) => {
    const todoItem = todoList.children[index];
    expect(todoItem.dataset.id).toBe(todo.id.toString());
    expect(todoItem.classList.contains(todo.state)).toBe(true);
  });
});

