import React, { useState } from 'react';
import '../../styles/ClientsPage.styles.css';
import { useAppContext } from '../../context/AppContext';

const ClientsPage: React.FC = () => {
  // 1. Conexión al Cerebro Global
  const { clientes, setClientes } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado temporal para el formulario
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
  });

  // Filtro de búsqueda
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 2. Crear el nuevo objeto cliente
    const clienteFinal = {
      id: Date.now(), // ID único basado en tiempo
      nombre: nuevoCliente.nombre,
      empresa: nuevoCliente.empresa || 'Particular',
      email: nuevoCliente.email,
      telefono: nuevoCliente.telefono,
      estado: 'Activo' as const // Forzamos el tipo literal
    };

    // 3. Guardar en el contexto (esto dispara el guardado en LocalStorage)
    setClientes([...clientes, clienteFinal]);
    
    // Limpieza
    setIsModalOpen(false);
    setNuevoCliente({ nombre: '', empresa: '', email: '', telefono: '' });
  };

  const deleteCliente = (id: number) => {
    if(window.confirm('¿Estás seguro de eliminar este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  return (
    <div className="clients-container">
      <div className="clients-header">
        <div>
          <h1 className="page-title">Gestión de Clientes</h1>
          <p className="page-subtitle">Base de datos centralizada de contactos.</p>
        </div>
        <button className="add-client-btn" onClick={() => setIsModalOpen(true)}>
          + Nuevo Cliente
        </button>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Buscar por nombre o empresa..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- MODAL DE REGISTRO --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content technical-modal"> {/* Usamos technical-modal para mantener estilo de Orders */}
            <h2>Registrar Nuevo Cliente</h2>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez"
                    value={nuevoCliente.nombre}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Empresa (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Taller Central"
                    value={nuevoCliente.empresa}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, empresa: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={nuevoCliente.email}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 56912345678"
                    value={nuevoCliente.telefono}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TABLA DE CLIENTES --- */}
      <div className="table-wrapper">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td><strong>{cliente.nombre}</strong></td>
                  <td>{cliente.empresa}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>
                    <span className={`status-pill ${cliente.estado.toLowerCase()}`}>
                      {cliente.estado}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn edit">Editar</button>
                    <button 
                      className="action-btn delete" 
                      onClick={() => deleteCliente(cliente.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;