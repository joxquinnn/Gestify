import React, { useState } from 'react';
import '../../styles/ClientsPage.styles.css';

interface Cliente {
  id: number;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
}

const ClientsPage: React.FC = () => {
  // Datos de ejemplo (Mock Data)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nombre: 'Juan Pérez', empresa: 'Talleres Pérez', email: 'juan@taller.com', telefono: '123-456-789', estado: 'Activo' },
    { id: 2, nombre: 'María García', empresa: 'Logística Sur', email: 'm.garcia@logsur.cl', telefono: '987-654-321', estado: 'Activo' },
    { id: 3, nombre: 'Carlos Ruiz', empresa: 'Constructora RC', email: 'carlos@rc.com', telefono: '555-012-345', estado: 'Inactivo' },
  ]);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
  });

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = clientes.length + 1;
    setClientes([...clientes, { ...nuevoCliente, id, estado: 'Activo' }]);
    setIsModalOpen(false); // Cerrar modal
    setNuevoCliente({ nombre: '', empresa: '', email: '', telefono: '' }); // Limpiar
  };

  return (
    <div className="clients-container">
      <div className="clients-header">
        <div>
          <h1 className="page-title">Gestión de Clientes</h1>
          <p className="page-subtitle">Administra la información de tus clientes y sus contactos.</p>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Registrar Nuevo Cliente</h2>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input 
                    type="text" 
                    required 
                    value={nuevoCliente.nombre}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Empresa</label>
                  <input 
                    type="text" 
                    value={nuevoCliente.empresa}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, empresa: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    required 
                    value={nuevoCliente.email}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input 
                    type="text" 
                    value={nuevoCliente.telefono}
                    onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
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
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td><strong>{cliente.nombre}</strong></td>
                <td>{cliente.empresa}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>
                  <span className={`status-badge ${cliente.estado.toLowerCase()}`}>
                    {cliente.estado}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit">Editar</button>
                  <button className="action-btn delete">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;