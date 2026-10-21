const $ = (id) => document.getElementById(id);
const ICONOS = { audiovisual: '🎥', herramienta: '🛠️', laptop: '💻' };
const COLORES = { audiovisual: 'bg-primary-subtle', herramienta: 'bg-warning-subtle', laptop: 'bg-success-subtle' };

const token = () => localStorage.getItem('token');
const usuario = () => JSON.parse(localStorage.getItem('usuario') || 'null');

async function api(url, opciones = {}) {
  const res = await fetch(url, {
    method: opciones.method || 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token() },
    body: opciones.body ? JSON.stringify(opciones.body) : undefined
  });
  if (res.status === 401) cerrarSesion();
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

function aviso(texto, tipo = 'success') {
  const div = document.createElement('div');
  div.className = 'alert alert-' + tipo;
  div.textContent = texto;
  $('avisos').append(div);
  setTimeout(() => div.remove(), 4000);
}

const mensajeDe = (data) => (data.errores ? data.errores.join(', ') : data.mensaje) || 'Error';

function imagen(e) {
  const placeholder = () => {
    const d = document.createElement('div');
    d.className = 'd-flex align-items-center justify-content-center fs-1 ' + (COLORES[e.categoria] || '');
    d.style.height = '180px';
    d.textContent = ICONOS[e.categoria] || '📦';
    return d;
  };
  if (!e.foto) return placeholder();
  const img = document.createElement('img');
  img.src = e.foto;
  img.alt = e.nombre;
  img.className = 'card-img-top object-fit-cover';
  img.style.height = '180px';
  img.addEventListener('error', () => img.replaceWith(placeholder()));
  return img;
}

async function cargarEquipos() {
  const { ok, data } = await api('/api/equipos?estado=Disponible');
  if (!ok) return;
  $('lista').replaceChildren();
  if (data.length === 0) {
    $('lista').textContent = 'No hay equipos disponibles por ahora.';
    return;
  }
  data.forEach((e) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';
    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm';

    const body = document.createElement('div');
    body.className = 'card-body d-flex flex-column';
    const titulo = document.createElement('h5');
    titulo.textContent = e.nombre;
    const cat = document.createElement('span');
    cat.className = 'badge bg-primary align-self-start mb-2';
    cat.textContent = e.categoria;
    const desc = document.createElement('p');
    desc.className = 'text-muted';
    desc.textContent = e.descripcion || '';
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary mt-auto';
    btn.textContent = 'Pedir prestado (7 días)';
    btn.addEventListener('click', () => pedir(e.id));

    body.append(titulo, cat, desc, btn);
    card.append(imagen(e), body);
    col.append(card);
    $('lista').append(col);
  });
}

async function pedir(equipoId) {
  const devolucion = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { ok, data } = await api('/api/prestamos', {
    method: 'POST',
    body: { equipoId, fechaDevolucionEsperada: devolucion }
  });
  aviso(ok ? '¡Préstamo registrado! Devuélvelo en 7 días.' : mensajeDe(data), ok ? 'success' : 'danger');
  if (ok) refrescar();
}

async function devolver(id) {
  const { ok, data } = await api('/api/prestamos/' + id + '/devolver', { method: 'PUT' });
  aviso(ok ? 'Equipo devuelto. ¡Gracias!' : mensajeDe(data), ok ? 'success' : 'danger');
  if (ok) refrescar();
}

async function cargarPrestamos() {
  const { ok, data } = await api('/api/prestamos');
  const lista = $('prestamos');
  lista.replaceChildren();
  if (!ok || data.length === 0) {
    lista.textContent = 'Todavía no hay préstamos.';
    return;
  }
  const esAdmin = usuario().rol === 'admin';
  data.forEach((p) => {
    const vencido = p.estado === 'Activo' && new Date(p.fechaDevolucionEsperada) < new Date();
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    const info = document.createElement('span');
    const quien = esAdmin && p.usuario ? p.usuario.nombre + ' · ' : '';
    info.textContent = quien + p.equipo.nombre + ' — vence ' + new Date(p.fechaDevolucionEsperada).toLocaleDateString();

    const derecha = document.createElement('span');
    const badge = document.createElement('span');
    badge.className = 'badge me-2 ' + (vencido ? 'bg-danger' : p.estado === 'Activo' ? 'bg-primary' : 'bg-secondary');
    badge.textContent = vencido ? 'Vencido' : p.estado;
    derecha.append(badge);

    if (p.estado === 'Activo') {
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-success';
      btn.textContent = 'Devolver';
      btn.addEventListener('click', () => devolver(p.id));
      derecha.append(btn);
    }
    li.append(info, derecha);
    lista.append(li);
  });
}

function refrescar() {
  cargarEquipos();
  cargarPrestamos();
}

function mostrarApp() {
  const u = usuario();
  $('saludo').textContent = u.nombre + ' (' + u.rol + ')';
  $('tituloPrestamos').textContent = u.rol === 'admin' ? 'Todos los préstamos' : 'Mis préstamos';
  $('adminBox').classList.toggle('d-none', u.rol !== 'admin');
  $('loginBox').classList.add('d-none');
  $('appBox').classList.remove('d-none');
  refrescar();
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
    $('error').textContent = mensajeDe(data);
    return;
  }
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  mostrarApp();
});

$('btnLogout').addEventListener('click', cerrarSesion);
$('btnPassword').addEventListener('click', () => $('passwordBox').classList.toggle('d-none'));

$('btnGuardarPass').addEventListener('click', async () => {
  const { ok, data } = await api('/api/auth/password', {
    method: 'PUT',
    body: { actual: $('passActual').value, nueva: $('passNueva').value }
  });
  aviso(ok ? 'Contraseña actualizada' : mensajeDe(data), ok ? 'success' : 'danger');
  if (ok) {
    $('passActual').value = '';
    $('passNueva').value = '';
    $('passwordBox').classList.add('d-none');
  }
});

$('btnAgregar').addEventListener('click', async () => {
  const body = {
    nombre: $('nuevoNombre').value,
    categoria: $('nuevaCategoria').value,
    descripcion: $('nuevaDescripcion').value,
    foto: $('nuevaFoto').value
  };
  const { ok, data } = await api('/api/equipos', { method: 'POST', body });
  aviso(ok ? 'Equipo agregado' : mensajeDe(data), ok ? 'success' : 'danger');
  if (ok) {
    ['nuevoNombre', 'nuevaDescripcion', 'nuevaFoto'].forEach((id) => ($(id).value = ''));
    cargarEquipos();
  }
});

if (token()) mostrarApp();