const $ = (id) => document.getElementById(id);
const ICONOS = { audiovisual: '🎥', herramienta: '🛠️', laptop: '💻' };
const COLORES = { audiovisual: 'bg-primary-subtle', herramienta: 'bg-warning-subtle', laptop: 'bg-success-subtle' };
const COLOR_ESTADO = { Disponible: 'bg-success', Prestado: 'bg-secondary', 'En mantenimiento': 'bg-warning text-dark' };

let editandoId = null;

const token = () => localStorage.getItem('token');
const usuario = () => JSON.parse(localStorage.getItem('usuario') || 'null');
const esAdmin = () => usuario() && usuario().rol === 'admin';

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

// Caja de imagen con proporción fija 4:3; si no hay foto (o falla) muestra un ícono
function imagen(e) {
  const caja = document.createElement('div');
  caja.className = 'ratio ratio-4x3 bg-white border-bottom';

  const placeholder = () => {
    const d = document.createElement('div');
    d.className = 'd-flex align-items-center justify-content-center display-3 ' + (COLORES[e.categoria] || '');
    d.textContent = ICONOS[e.categoria] || '📦';
    return d;
  };

  if (!e.foto) {
    caja.append(placeholder());
    return caja;
  }
  const img = document.createElement('img');
  img.src = e.foto;
  img.alt = e.nombre;
  img.className = 'object-fit-contain p-2';
  img.addEventListener('error', () => caja.replaceChildren(placeholder()));
  caja.append(img);
  return caja;
}

async function cargarEquipos() {
  // El admin ve todo el inventario; el usuario solo los disponibles
  const url = esAdmin() ? '/api/equipos' : '/api/equipos?estado=Disponible';
  const { ok, data } = await api(url);
  if (!ok) return;

  $('lista').replaceChildren();
  if (data.length === 0) {
    $('lista').textContent = 'No hay equipos para mostrar.';
    return;
  }

  data.forEach((e) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';
    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm overflow-hidden';

    const body = document.createElement('div');
    body.className = 'card-body d-flex flex-column';

    const titulo = document.createElement('h5');
    titulo.textContent = e.nombre;

    const etiquetas = document.createElement('div');
    etiquetas.className = 'mb-2';
    const cat = document.createElement('span');
    cat.className = 'badge bg-primary me-1';
    cat.textContent = e.categoria;
    etiquetas.append(cat);
    if (esAdmin()) {
      const est = document.createElement('span');
      est.className = 'badge ' + (COLOR_ESTADO[e.estado] || 'bg-secondary');
      est.textContent = e.estado;
      etiquetas.append(est);
    }

    const desc = document.createElement('p');
    desc.className = 'text-muted';
    desc.textContent = e.descripcion || '';

    body.append(titulo, etiquetas, desc);

    if (esAdmin()) {
      const fila = document.createElement('div');
      fila.className = 'd-flex gap-2 mt-auto';
      const btnEditar = document.createElement('button');
      btnEditar.className = 'btn btn-outline-primary btn-sm flex-fill';
      btnEditar.textContent = '✏️ Editar';
      btnEditar.addEventListener('click', () => editar(e));
      const btnEliminar = document.createElement('button');
      btnEliminar.className = 'btn btn-outline-danger btn-sm flex-fill';
      btnEliminar.textContent = '🗑️ Eliminar';
      btnEliminar.addEventListener('click', () => eliminar(e));
      fila.append(btnEditar, btnEliminar);
      body.append(fila);
    } else {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline-primary mt-auto';
      btn.textContent = 'Pedir prestado (7 días)';
      btn.addEventListener('click', () => pedir(e.id));
      body.append(btn);
    }

    card.append(imagen(e), body);
    col.append(card);
    $('lista').append(col);
  });
}

function editar(e) {
  editandoId = e.id;
  $('formNombre').value = e.nombre;
  $('formCategoria').value = e.categoria;
  $('formDescripcion').value = e.descripcion || '';
  $('formFoto').value = e.foto || '';
  // Un equipo prestado no puede cambiar de estado a mano
  const sel = $('formEstado');
  sel.classList.toggle('d-none', e.estado === 'Prestado');
  sel.value = e.estado === 'Prestado' ? 'Disponible' : e.estado;
  $('tituloForm').textContent = 'Editar equipo #' + e.id;
  $('btnGuardarEquipo').textContent = 'Guardar cambios';
  $('btnCancelar').classList.remove('d-none');
  $('adminBox').scrollIntoView({ behavior: 'smooth' });
}

function limpiarForm() {
  editandoId = null;
  ['formNombre', 'formDescripcion', 'formFoto'].forEach((id) => ($(id).value = ''));
  $('formCategoria').value = 'audiovisual';
  $('formEstado').classList.add('d-none');
  $('tituloForm').textContent = 'Agregar equipo';
  $('btnGuardarEquipo').textContent = 'Agregar equipo';
  $('btnCancelar').classList.add('d-none');
}

async function eliminar(e) {
  if (!confirm('¿Eliminar "' + e.nombre + '"? Esta acción no se puede deshacer.')) return;
  const { ok, data } = await api('/api/equipos/' + e.id, { method: 'DELETE' });
  aviso(ok ? 'Equipo eliminado' : mensajeDe(data), ok ? 'success' : 'danger');
  if (ok) {
    if (editandoId === e.id) limpiarForm();
    cargarEquipos();
  }
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
  data.forEach((p) => {
    const vencido = p.estado === 'Activo' && new Date(p.fechaDevolucionEsperada) < new Date();
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    const info = document.createElement('span');
    const quien = esAdmin() && p.usuario ? p.usuario.nombre + ' · ' : '';
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
  $('tituloEquipos').textContent = esAdmin() ? 'Inventario de equipos' : 'Equipos disponibles';
  $('tituloPrestamos').textContent = esAdmin() ? 'Todos los préstamos' : 'Mis préstamos';
  $('adminBox').classList.toggle('d-none', !esAdmin());
  $('loginBox').classList.add('d-none');
  $('appBox').classList.remove('d-none');
  limpiarForm();
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

$('btnGuardarEquipo').addEventListener('click', async () => {
  const body = {
    nombre: $('formNombre').value,
    categoria: $('formCategoria').value,
    descripcion: $('formDescripcion').value,
    foto: $('formFoto').value
  };
  if (editandoId && !$('formEstado').classList.contains('d-none')) {
    body.estado = $('formEstado').value;
  }
  const url = editandoId ? '/api/equipos/' + editandoId : '/api/equipos';
  const { ok, data } = await api(url, { method: editandoId ? 'PUT' : 'POST', body });
  aviso(ok ? (editandoId ? 'Equipo actualizado' : 'Equipo agregado') : mensajeDe(data), ok ? 'success' : 'danger');
  if (ok) {
    limpiarForm();
    cargarEquipos();
  }
});

$('btnCancelar').addEventListener('click', limpiarForm);

if (token()) mostrarApp();