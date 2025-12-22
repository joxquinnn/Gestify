import React, { useState } from 'react';
import '../../styles/OrdersPage.styles.css';
import { useAppContext } from '../../context/AppContext';
import { generarPDFOrden } from '../../utils/generatePDF';
import { ordenesService } from '../../services/order.services';

interface OrdenServicio {
  id: string;
  cliente: string;
  telefono: string;
  dispositivo: string;
  marcaModelo: string;
  password?: string;
  fallaReportada?: string;
  accesorios?: string;
  estado: 'Pendiente' | 'En Proceso' | 'Terminado' | 'Cancelado';
  fechaIngreso: string;
  total: number;
}

const CHECKLISTS_POR_TIPO: Record<string, string[]> = {
  Celular: ["Pantalla Trizada", "Rayones Leves", "Tapa Trasera Rota", "Cámara Dañada", "Humedad Visible", "Sin Botones", "Con Funda", "Con Protector Pantalla", "Sin Bandeja"],
  Tablet: ["Pantalla Trizada", "Rayones Leves", "Puerto Carga Suelto", "Botones Pegados", "Con Funda", "Con Lápiz", "Humedad Visible", "Con Protector De Pantalla", "Sin Bandeja"],
  Notebook: ["Con Cargador", "Con Bolso", "Faltan Tornillos", "Pantalla con Manchas", "Teclado Falla", "Bisagras Sueltas", "Batería Inflada", "Rayones en Tapa"],
  Desktop: ["Con Cargador", "Con Bolso", "Faltan Tornillos", "Pantalla con Manchas", "Teclado Falla", "Bisagras Sueltas", "Batería Inflada", "Rayones en Tapa"]
};

const OrdersPage: React.FC = () => {
  const { ordenes, setOrdenes, clientes, configuracion, actualizarOrden, eliminarOrden } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrdenServicio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accesoriosSeleccionados, setAccesoriosSeleccionados] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'activas' | 'finalizadas'>('activas');
  const [isSaving, setIsSaving] = useState(false);

  const [nuevaOrden, setNuevaOrden] = useState({
    cliente: '', telefono: '', dispositivo: 'Celular', marcaModelo: '',
    password: '', fallaReportada: '', accesorios: '', presupuesto: '' as any
  });

  const handleCheckboxChange = (opcion: string) => {
    setAccesoriosSeleccionados(prev =>
      prev.includes(opcion)
        ? prev.filter(item => item !== opcion)
        : [...prev, opcion]
    );
  };

  const handleSelectCliente = (nombreCliente: string) => {
    const clienteEncontrado = clientes.find(c => c.nombre === nombreCliente);
    setNuevaOrden({
      ...nuevaOrden,
      cliente: nombreCliente,
      telefono: clienteEncontrado ? clienteEncontrado.telefono : ''
    });
  };

  const enviarWhatsApp = (orden: OrdenServicio) => {
    const nombreEmpresa = configuracion?.nombreNegocio || "Servicio Técnico";
    const mensaje = `Hola *${orden.cliente}*, te contactamos de *${nombreEmpresa}*.%0A%0A` +
    `Te informamos que tu equipo *${orden.marcaModelo}* (Orden: ${orden.id}) ` +
    `se encuentra en estado: *${orden.estado}*.%0A%0A` +
    `¡Te esperamos!`;
    const telLimpio = orden.telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${telLimpio}?text=${mensaje}`, '_blank');
  };

  // GUARDAR NUEVA ORDEN EN BACKEND
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const nuevaOS: Omit<OrdenServicio, 'id'> = {
        cliente: nuevaOrden.cliente,
        telefono: nuevaOrden.telefono,
        dispositivo: nuevaOrden.dispositivo,
        marcaModelo: nuevaOrden.marcaModelo,
        password: nuevaOrden.password,
        fallaReportada: nuevaOrden.fallaReportada,
        accesorios: accesoriosSeleccionados.join(', '),
        estado: 'Pendiente',
        fechaIngreso: new Date().toISOString().split('T')[0],
        total: Number(nuevaOrden.presupuesto) || 0
      };

      console.log('💾 Guardando nueva orden en backend...');
      const ordenCreada = await ordenesService.crearOrden(nuevaOS);
      
      // Actualizar estado local
      setOrdenes([ordenCreada, ...ordenes]);
      
      // Limpiar formulario
      setAccesoriosSeleccionados([]);
      setIsModalOpen(false);
      setNuevaOrden({
        cliente: '', telefono: '', dispositivo: 'Celular', marcaModelo: '',
        password: '', fallaReportada: '', accesorios: '', presupuesto: '' as any
      });

      alert('✅ Orden creada exitosamente');
      console.log('✅ Orden guardada:', ordenCreada);
    } catch (error) {
      console.error('❌ Error al guardar orden:', error);
      alert('Error al crear la orden. Por favor intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // CAMBIAR ESTADO (ACTUALIZA EN BACKEND)
  const handleStatusChange = async (id: string, nuevoEstado: string) => {
    try {
      console.log('🔄 Cambiando estado de orden:', id, '→', nuevoEstado);
      
      const ordenActualizada = await ordenesService.cambiarEstado(id, nuevoEstado);
      
      // Actualizar estado local
      setOrdenes(ordenes.map(o => o.id === id ? ordenActualizada : o));
      
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(ordenActualizada);
      }
      
      console.log('✅ Estado actualizado correctamente');
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  // CONFIRMAR EDICIÓN (ACTUALIZA EN BACKEND)
  const handleConfirmEdit = async () => {
    if (!selectedOrder) return;

    try {
      setIsSaving(true);
      await actualizarOrden(selectedOrder);
      setIsEditing(false);
      alert('✅ Orden actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewDetails = (orden: OrdenServicio) => {
    setSelectedOrder(orden);
    setIsDetailsOpen(true);
    setIsEditing(false);
  };

  const ordenesFiltradas = ordenes.filter(o => {
    const matchesSearch = o.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.marcaModelo.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'activas') {
      return matchesSearch && (o.estado === 'Pendiente' || o.estado === 'En Proceso');
    }
    return matchesSearch && (o.estado === 'Terminado' || o.estado === 'Cancelado');
  });

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div>
          <h1 className="page-title">Órdenes de Servicio</h1>
          <p className="page-subtitle">Gestión centralizada de reparaciones.</p>
        </div>
        <button className="add-order-btn" onClick={() => setIsModalOpen(true)}>
          + Nueva Orden
        </button>
      </div>

      <div className="orders-tabs">
        <button 
          className={activeTab === 'activas' ? 'active' : ''} 
          onClick={() => setActiveTab('activas')}
        >
          Activas ({ordenes.filter(o => o.estado === 'Pendiente' || o.estado === 'En Proceso').length})
        </button>
        <button 
          className={activeTab === 'finalizadas' ? 'active' : ''} 
          onClick={() => setActiveTab('finalizadas')}
        >
          Historial / Finalizadas
        </button>
      </div>

      <div className="search-bar-container">
        <input 
          type="text" 
          placeholder="Buscar por Folio, Cliente o Modelo..." 
          className="search-input" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* MODAL DE NUEVA ORDEN */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content technical-modal-orders">
            <h2>Ingreso de Equipo</h2>
            <form onSubmit={handleSaveOrder}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Seleccionar Cliente</label>
                  <select 
                    required 
                    value={nuevaOrden.cliente} 
                    onChange={(e) => handleSelectCliente(e.target.value)}
                    disabled={isSaving}
                  >
                    <option value="">-- Seleccione un cliente --</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.nombre}>
                        {c.nombre} ({c.empresa})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>WhatsApp (Autocompletado)</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={nuevaOrden.telefono} 
                    style={{ backgroundColor: '#f8fafc', cursor: 'not-allowed' }} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Tipo de Equipo</label>
                  <select 
                    value={nuevaOrden.dispositivo} 
                    onChange={(e) => {
                      setNuevaOrden({ ...nuevaOrden, dispositivo: e.target.value });
                      setAccesoriosSeleccionados([]);
                    }}
                    disabled={isSaving}
                  >
                    <option value="Celular">Celular</option>
                    <option value="Notebook">Notebook</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Tablet">Tablet</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Marca y Modelo</label>
                  <input 
                    type="text" 
                    required 
                    value={nuevaOrden.marcaModelo} 
                    onChange={(e) => setNuevaOrden({ ...nuevaOrden, marcaModelo: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
                
                <div className="form-group">
                  <label>Patrón / Contraseña</label>
                  <input 
                    type="text" 
                    value={nuevaOrden.password} 
                    onChange={(e) => setNuevaOrden({ ...nuevaOrden, password: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
                
                <div className="form-group">
                  <label>Costo Reparación</label>
                  <input 
                    type="number" 
                    value={nuevaOrden.presupuesto} 
                    placeholder="Ej: 15000"
                    onChange={(e) => setNuevaOrden({ 
                      ...nuevaOrden, 
                      presupuesto: e.target.value === '' ? '' : Number(e.target.value) 
                    })}
                    disabled={isSaving}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Servicio Requerido</label>
                  <textarea 
                    required 
                    value={nuevaOrden.fallaReportada} 
                    onChange={(e) => setNuevaOrden({ ...nuevaOrden, fallaReportada: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label style={{ marginBottom: '10px', display: 'block' }}>
                    Estado Físico / Accesorios ({nuevaOrden.dispositivo})
                  </label>
                  <div className="checklist-container">
                    {(CHECKLISTS_POR_TIPO[nuevaOrden.dispositivo] || []).map(opcion => (
                      <label key={opcion} className="checklist-item">
                        <input
                          type="checkbox"
                          checked={accesoriosSeleccionados.includes(opcion)}
                          onChange={() => handleCheckboxChange(opcion)}
                          disabled={isSaving}
                        />
                        <span>{opcion}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Otras observaciones específicas..."
                    className="mt-10"
                    onChange={(e) => setNuevaOrden({ ...nuevaOrden, accesorios: e.target.value })}
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
                  {isSaving ? '⏳ Guardando...' : 'Generar Orden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLES */}
      {isDetailsOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content details-modal">
            <div className="details-header-print">
              <div>
                <h2>{selectedOrder.id}</h2>
                <p>Fecha: {selectedOrder.fechaIngreso}</p>
              </div>
              <div className="status-updater no-print">
                <div>
                  <label>Estado Actual:</label>
                  <select
                    value={selectedOrder.estado}
                    className={`status-select ${selectedOrder.estado.toLowerCase().replace(/\s+/g, '-')}`}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    disabled={isEditing}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Terminado">Terminado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                <button 
                  className="btn-delete-order" 
                  onClick={() => {
                    eliminarOrden(selectedOrder.id);
                    setIsDetailsOpen(false);
                  }}
                  disabled={isEditing}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            <div className="details-body">
              <section className="details-section">
                <h3>Cliente: {selectedOrder.cliente}</h3>
                <p><strong>WhatsApp:</strong> {selectedOrder.telefono}</p>
                <div className="details-grid">
                  <p>
                    <strong>Equipo:</strong> {selectedOrder.dispositivo} -
                    {isEditing ? (
                      <input
                        className="edit-mode-input"
                        value={selectedOrder.marcaModelo}
                        onChange={(e) => setSelectedOrder({ 
                          ...selectedOrder, 
                          marcaModelo: e.target.value 
                        })}
                      />
                    ) : (
                      <span> {selectedOrder.marcaModelo}</span>
                    )}
                  </p>
                  <p>
                    <strong>Clave:</strong> 
                    <span className="password-tag">
                      {selectedOrder.password || 'Sin clave'}
                    </span>
                  </p>
                </div>
                <div className="accesorios-box">
                  <strong>Estado Físico / Accesorios:</strong>
                  {isEditing ? (
                    <input
                      className="edit-mode-input"
                      value={selectedOrder.accesorios}
                      onChange={(e) => setSelectedOrder({ 
                        ...selectedOrder, 
                        accesorios: e.target.value 
                      })}
                    />
                  ) : (
                    <p>{selectedOrder.accesorios || 'Ninguno reportado'}</p>
                  )}
                </div>
              </section>

              <section className="details-section">
                <div className="falla-box">
                  <strong>Falla Reportada:</strong>
                  {isEditing ? (
                    <textarea
                      className="edit-mode-input"
                      value={selectedOrder.fallaReportada}
                      onChange={(e) => setSelectedOrder({ 
                        ...selectedOrder, 
                        fallaReportada: e.target.value 
                      })}
                    />
                  ) : (
                    <p>{selectedOrder.fallaReportada}</p>
                  )}
                </div>
              </section>

              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <h3>
                  Total a Pagar:
                  {isEditing ? (
                    <input
                      type="number"
                      className="edit-mode-input"
                      value={selectedOrder.total}
                      onChange={(e) => setSelectedOrder({ 
                        ...selectedOrder, 
                        total: Number(e.target.value) 
                      })}
                    />
                  ) : (
                    <span style={{ color: '#007bff', marginLeft: '10px' }}>
                      ${selectedOrder.total.toLocaleString()}
                    </span>
                  )}
                </h3>
              </div>
            </div>

            <div className="modal-actions no-print">
              {isEditing ? (
                <button 
                  className="btn-save" 
                  onClick={handleConfirmEdit}
                  disabled={isSaving}
                >
                  {isSaving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                </button>
              ) : (
                <button 
                  className="btn-edit" 
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Editar Datos
                </button>
              )}
              <button 
                className="btn-whatsapp" 
                onClick={() => enviarWhatsApp(selectedOrder)}
              >
                Notificar WhatsApp
              </button>
              <button 
                className="btn-print" 
                onClick={() => generarPDFOrden(selectedOrder, configuracion)}
              >
                Descargar PDF
              </button>
              <button 
                className="btn-cancel" 
                onClick={() => { 
                  setIsDetailsOpen(false); 
                  setIsEditing(false); 
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLA DE ÓRDENES */}
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Cliente</th>
              <th>Equipo / Modelo</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.length > 0 ? (
              ordenesFiltradas.map(orden => (
                <tr key={orden.id}>
                  <td><strong>{orden.id}</strong></td>
                  <td>{orden.cliente}</td>
                  <td>
                    <span className="device-type-tag">{orden.dispositivo}</span> 
                    {orden.marcaModelo}
                  </td>
                  <td>{orden.fechaIngreso}</td>
                  <td>
                    <span className={`status-pill ${orden.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                      {orden.estado}
                    </span>
                  </td>
                  <td>${orden.total.toLocaleString()}</td>
                  <td>
                    <button 
                      className="action-btn view" 
                      onClick={() => handleViewDetails(orden)}
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                  No hay órdenes para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;