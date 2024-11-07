import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CrearProyecto = ({ onProyectoCreado, proyectoEditado, onCancelarEdicion, onGuardarEdicion }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [completada, setCompletada] = useState(false);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [prioridad, setPrioridad] = useState('media');
  const [asignadoA, setAsignadoA] = useState('');
  const [categoria, setCategoria] = useState('');
  const [costoProyecto, setCostoProyecto] = useState('');
  const [pagado, setPagado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (proyectoEditado) {
      setTitulo(proyectoEditado.titulo || '');
      setDescripcion(proyectoEditado.descripcion || '');
      setCompletada(proyectoEditado.completada || false);
      setFechaVencimiento(proyectoEditado.fecha_vencimiento || '');
      setPrioridad(proyectoEditado.prioridad || 'media');
      setAsignadoA(proyectoEditado.asignado_a || '');
      setCategoria(proyectoEditado.categoria || '');
      setCostoProyecto(proyectoEditado.Costo_proyecto || '');
      setPagado(proyectoEditado.Pagado || false);
    } else {
      resetForm();
    }
  }, [proyectoEditado]);

  const resetForm = () => {
    setTitulo('');
    setDescripcion('');
    setCompletada(false);
    setFechaVencimiento('');
    setPrioridad('media');
    setAsignadoA('');
    setCategoria('');
    setCostoProyecto('');
    setPagado(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoProyecto = {
      titulo,
      descripcion,
      completada,
      fecha_vencimiento: fechaVencimiento,
      prioridad,
      asignado_a: asignadoA,
      categoria,
      Costo_proyecto: parseFloat(costoProyecto),
      Pagado: pagado,
    };

    if (proyectoEditado) {
      onGuardarEdicion({ ...proyectoEditado, ...nuevoProyecto });
    } else {
      try {
        const response = await fetch('https://examenfinalapi-uqeu.onrender.com/api/proyectos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoProyecto),
        });
        const data = await response.json();
        if (response.ok) {
          setMensaje('Proyecto creado con éxito');
          setError(false);
          resetForm();
          onProyectoCreado(data.proyecto); // Asegúrate de que `data.proyecto` sea el proyecto nuevo
        } else {
          setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
          setError(true);
        }
      } catch (error) {
        setMensaje('Error al crear el proyecto');
        setError(true);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2>{proyectoEditado ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Título:</label>
          <input type="text" className="form-control" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción:</label>
          <textarea className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Completada:</label>
          <input type="checkbox" checked={completada} onChange={(e) => setCompletada(e.target.checked)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Vencimiento:</label>
          <input type="datetime-local" className="form-control" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Prioridad:</label>
          <select className="form-control" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Asignado a:</label>
          <input type="text" className="form-control" value={asignadoA} onChange={(e) => setAsignadoA(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoría:</label>
          <input type="text" className="form-control" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Costo del Proyecto:</label>
          <input type="number" className="form-control" value={costoProyecto} onChange={(e) => setCostoProyecto(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Pagado:</label>
          <input type="checkbox" checked={pagado} onChange={(e) => setPagado(e.target.checked)} />
        </div>
        <button type="submit" className="btn btn-primary">
          {proyectoEditado ? 'Guardar Cambios' : 'Crear Proyecto'}
        </button>
        {proyectoEditado && (
          <button type="button" className="btn btn-secondary ms-2" onClick={onCancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

const MostrarProyectos = ({ proyectos, onEliminarProyecto, onEditarProyecto }) => {
  return (
    <div className="container my-4">
      <h2>Lista de Proyectos</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Completada</th>
            <th>Fecha de Vencimiento</th>
            <th>Prioridad</th>
            <th>Pagado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.length > 0 ? (
            proyectos.map((proyecto) => (
              <tr key={proyecto.id}>
                <td>{proyecto.titulo}</td>
                <td>{proyecto.descripcion}</td>
                <td>{proyecto.completada ? 'Sí' : 'No'}</td>
                <td>{proyecto.fecha_vencimiento || 'No asignada'}</td>
                <td>{proyecto.prioridad}</td>
                <td>{proyecto.Pagado ? 'Sí' : 'No'}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEditarProyecto(proyecto)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => onEliminarProyecto(proyecto.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay proyectos registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Crud = () => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoEditado, setProyectoEditado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const obtenerProyectos = async () => {
    try {
      const response = await fetch('https://examenfinalapi-uqeu.onrender.com/api/proyectos/all');
      const data = await response.json();
      if (response.ok) {
        setProyectos(data.proyectos || data);
        setMensaje('Proyectos obtenidos con éxito');
        setError(false);
      } else {
        setMensaje('Error al obtener los proyectos');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }
  };

  useEffect(() => {
    obtenerProyectos();
  }, []);

  const agregarProyecto = (nuevoProyecto) => {
    console.log("Nuevo proyecto creado:", nuevoProyecto); // Verificar valores
    setProyectos((prevProyectos) => [...prevProyectos, nuevoProyecto]);
  };

  const eliminarProyecto = async (id) => {
    try {
      const response = await fetch(`https://examenfinalapi-uqeu.onrender.com/api/proyectos/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProyectos((prevProyectos) => prevProyectos.filter((proyecto) => proyecto.id !== id));
        setMensaje('Proyecto eliminado con éxito');
        setError(false);
      } else {
        setMensaje('Error al eliminar el proyecto');
        setError(true);
      }
    } catch (error) {
      setMensaje('Error al comunicarse con la API');
      setError(true);
    }
  };

  const iniciarEdicionProyecto = (proyecto) => {
    setProyectoEditado(proyecto);
  };

  const cancelarEdicion = () => {
    setProyectoEditado(null);
  };

 const guardarEdicionProyecto = async (proyectoActualizado) => {
    try {
      const response = await fetch(`https://examenfinalapi-uqeu.onrender.com/api/proyectos/update/${proyectoActualizado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proyectoActualizado),
      });
      const data = await response.json();

      if (response.ok) {
        setProyectos((prevProyectos) =>
          prevProyectos.map((proyecto) => (proyecto.id === proyectoActualizado.id ? data.proyecto : proyecto))
        );
        setMensaje('Proyecto editado con éxito');
        setError(false);
      } else {
        setMensaje(`Error: ${data.message || 'Ocurrió un error inesperado'}`);
        setError(true);
      }
    } catch (error) {
      setMensaje('Error en la comunicación con la API');
      setError(true);
    }

    setProyectoEditado(null);
  };


  return (
    <div>
      <CrearProyecto
        onProyectoCreado={agregarProyecto}
        proyectoEditado={proyectoEditado}
        onCancelarEdicion={cancelarEdicion}
        onGuardarEdicion={guardarEdicionProyecto}
      />
      <MostrarProyectos proyectos={proyectos} onEliminarProyecto={eliminarProyecto} onEditarProyecto={iniciarEdicionProyecto} />
      {mensaje && (
        <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Crud;
