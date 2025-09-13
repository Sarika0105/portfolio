// Responsive nav toggle
const menuBtns = document.querySelectorAll('.menu-btn');
menuBtns.forEach(btn =>
  btn.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'flex' ? '' : 'flex';
  })
);

// ---------------- Contact Form ----------------
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('contact-msg').textContent =
      '✅ Thanks! Your message has been sent.';
    contactForm.reset();
  });
}

// ---------------- To-Do App ----------------
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const taskList = document.getElementById('task-list');
const search = document.getElementById('search');
const filterPriority = document.getElementById('filter-priority');
const sortBy = document.getElementById('sort-by');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function priorityRank(p) {
  return p === 'high' ? 3 : p === 'medium' ? 2 : 1;
}

function escapeHtml(s) {
  return s.replace(/[&<>\"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function renderTasks() {
  if (!taskList) return;
  let visible = tasks.slice();

  if (search && search.value) {
    const q = search.value.toLowerCase();
    visible = visible.filter(t => t.text.toLowerCase().includes(q));
  }

  if (filterPriority && filterPriority.value !== 'all') {
    visible = visible.filter(t => t.priority === filterPriority.value);
  }

  if (sortBy) {
    if (sortBy.value === 'created-desc')
      visible.sort((a, b) => b.created - a.created);
    if (sortBy.value === 'created-asc')
      visible.sort((a, b) => a.created - b.created);
    if (sortBy.value === 'priority-desc')
      visible.sort(
        (a, b) => priorityRank(b.priority) - priorityRank(a.priority)
      );
  }

  taskList.innerHTML = '';
  visible.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task';
    li.innerHTML = `
      <div>
        <input type="checkbox" data-id="${t.id}" class="toggle" ${
      t.done ? 'checked' : ''
    } />
        <span style="text-decoration:${t.done ? 'line-through' : 'none'}">
          ${escapeHtml(t.text)}
        </span>
        <span class="badge ${t.priority}">${t.priority}</span>
      </div>
      <button data-id="${t.id}" class="del">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

if (todoForm) {
  todoForm.addEventListener('submit', e => {
    e.preventDefault();
    tasks.push({
      id: Date.now(),
      text: taskInput.value.trim(),
      priority: prioritySelect.value,
      done: false,
      created: Date.now()
    });
    saveTasks();
    renderTasks();
    todoForm.reset();
  });

  taskList.addEventListener('click', e => {
    if (e.target.classList.contains('del')) {
      tasks = tasks.filter(t => t.id != e.target.dataset.id);
      saveTasks();
      renderTasks();
    }
    if (e.target.classList.contains('toggle')) {
      const t = tasks.find(t => t.id == e.target.dataset.id);
      t.done = e.target.checked;
      saveTasks();
      renderTasks();
    }
  });

  [search, filterPriority, sortBy].forEach(el => {
    if (el) el.addEventListener('input', renderTasks);
  });

  renderTasks();
}

// ---------------- Products Page ----------------
const products = [
  { id: 1, name: 'Smartphone', price: 12000, category: 'electronics', rating: 4.6 },
  { id: 2, name: 'Laptop', price: 55000, category: 'electronics', rating: 4.8 },
  { id: 3, name: 'Novel Book', price: 400, category: 'books', rating: 4.3 },
  { id: 4, name: 'T-shirt', price: 700, category: 'clothing', rating: 4.1 },
  { id: 5, name: 'Headphones', price: 2500, category: 'electronics', rating: 4.4 },
  { id: 6, name: 'Textbook', price: 1800, category: 'books', rating: 4.7 },
  { id: 7, name: 'Jeans', price: 1600, category: 'clothing', rating: 4.0 }
];

const grid = document.getElementById('grid');
const q = document.getElementById('q');
const category = document.getElementById('category');
const priceRange = document.getElementById('price-range');
const sort = document.getElementById('sort');

function renderProducts() {
  if (!grid) return;
  let visible = products.slice();

  if (q && q.value) {
    const term = q.value.toLowerCase();
    visible = visible.filter(p => p.name.toLowerCase().includes(term));
  }

  if (category && category.value !== 'all') {
    visible = visible.filter(p => p.category === category.value);
  }

  if (priceRange && priceRange.value !== 'all') {
    const [min, max] = priceRange.value.split('-').map(Number);
    visible = visible.filter(p => p.price >= min && p.price <= max);
  }

  if (sort) {
    if (sort.value === 'rating-desc')
      visible.sort((a, b) => b.rating - a.rating);
    if (sort.value === 'price-asc')
      visible.sort((a, b) => a.price - b.price);
    if (sort.value === 'price-desc')
      visible.sort((a, b) => b.price - a.price);
  }

  grid.innerHTML = '';
  visible.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p class="price">₹${p.price}</p>
      <p>⭐ ${p.rating}</p>
      <small>${p.category}</small>
    `;
    grid.appendChild(card);
  });
}

if (grid) {
  [q, category, priceRange, sort].forEach(el => {
    if (el) el.addEventListener('input', renderProducts);
  });
  renderProducts();
}
