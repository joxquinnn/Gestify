import React, { useState } from 'react';
import '../../styles/ClientsPage.styles.css';
import { useAppContext } from '../../context/AppContext';

const ClientsPage: React.FC = () => {
  const { clientes, agregarCliente, eliminarCliente } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  //  GUARDAR CLIENTE EN BACKEND (PostgreSQL)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const clienteFinal = {
        nombre: nuevoCliente.nombre,
        empresa: nuevoCliente.empresa || 'Particular',
        email: nuevoCliente.email,
        telefono: nuevoCliente.telefono,
        estado: 'Activo' as const
      };

      console.log('💾 Guardando cliente en PostgreSQL...');
      await agregarCliente(clienteFinal);
      
      // Limpiar formulario
      setIsModalOpen(false);
      setNuevoCliente({ nombre: '', empresa: '', email: '', telefono: '' });
      
      alert('✅ Cliente guardado exitosamente en la base de datos');
    } catch (error) {
      console.error('❌ Error al guardar cliente:', error);
      alert('Error al guardar el cliente. Por favor intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  //  ELIMINAR CLIENTE DEL BACKEND (PostgreSQL)
  const deleteCliente = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) {
      return;
    }

    try {
      console.log('🗑️ Eliminando cliente de PostgreSQL...');
      await eliminarCliente(id);
      alert('✅ Cliente eliminado correctamente');
    } catch (error) {
      console.error('❌ Error al eliminar cliente:', error);
      alert('Error al eliminar el cliente. Por favor intenta nuevamente.');
    }
  };

  return (
    <div className="clients-container">
      <div className="clients-header">
        <div>
          <h1 className="page-title">Gestión de Clientes</h1>
          <p className="page-subtitle">Base de datos centralizada en PostgreSQL (Railway).</p>
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
          <div className="modal-content technical-modal-clients">
            <h2>Registrar Nuevo Cliente</h2>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez"
                    value={nuevoCliente.nombre}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
                <div className="form-group">
                  <label>Empresa (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Taller Central"
                    value={nuevoCliente.empresa}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, empresa: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={nuevoCliente.email}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 56912345678"
                    value={nuevoCliente.telefono}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                  disabled={isSaving}
                >
                  {isSaving ? '⏳ Guardando...' : 'Guardar Cliente'}
                </button>
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
              <th>ID</th>
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
                  <td><strong>#{cliente.id}</strong></td>
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
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  {searchTerm ? 'No se encontraron clientes con ese criterio' : 'No hay clientes registrados. Agrega el primero.'}
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