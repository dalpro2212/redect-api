const $ = (id) => document.getElementById(id);

async function cargarEquipos() {
  const res = await fetch('/api/equipos?estado=Disponible', {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  });
  if (res.status === 401) return cerrarSesion();
  const equipos = await res.json();

  $('lista').innerHTML = '';
  equipos.forEach((e) => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    const card = document.createElement('div');
    card.className = 'card p-3 h-100';
    const titulo = document.createElement('h5');
    titulo.textContent = e.nombre;          // textContent evita XSS
    const cat = document.createElement('span');
    cat.className = 'badge bg-primary mb-2';
    cat.textContent = e.categoria;
    const desc = document.createElement('p');
    desc.textContent = e.descripcion || '';
    card.append(titulo, cat, desc);
    col.append(card);
    $('lista').append(col);
  });
}

function mostrarApp() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  $('saludo').textContent = 'Hola, ' + usuario.nombre + ' (' + usuario.rol + ')';
  $('loginBox').classList.add('d-none');
  $('appBox').classList.remove('d-none');
  cargarEquipos();
}

function cerrarSesion() {
  localStorage.clear();
  $('appBox').classList.add('d-none');
  $('loginBox').classList.remove('d-none');
}

$('btnLogin').addEventListener('click', async () => {
  $('error').textContent = '';
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: $('email').value, password: $('password').value })
  });
  const data = await res.json();
  if (!res.ok) {
    $('error').textContent = data.mensaje || 'Error al iniciar sesión';
    return;
  }
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  mostrarApp();
});

$('btnLogout').addEventListener('click', cerrarSesion);

if (localStorage.getItem('token')) mostrarApp();