import React, { useState } from 'react';
import '../../styles/OrdersPage.styles.css';
import { useAppContext } from '../../context/AppContext';
import { generarPDFOrden } from '../../utils/generatePDF';

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

const OPCIONES_ESTADO = [
  "Rayones leves", "Pantalla trizada", "Golpes en bordes",
  "Cámara rayada", "Sin botones", "Tapa trasera rota",
  "Con protector", "Con funda", "Humedad visible"
];

const OrdersPage: React.FC = () => {
  const { ordenes, setOrdenes, clientes, configuracion, actualizarOrden, eliminarOrden } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrdenServicio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accesoriosSeleccionados, setAccesoriosSeleccionados] = useState<string[]>([]);

  const handleCheckboxChange = (opcion: string) => {
    setAccesoriosSeleccionados(prev =>
      prev.includes(opcion)
        ? prev.filter(item => item !== opcion)
        : [...prev, opcion]
    );
  };

  // NUEVAS VARIABLES DE ESTADO (Sin tocar interfaz)
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'activas' | 'finalizadas'>('activas');

  const [nuevaOrden, setNuevaOrden] = useState({
    cliente: '', telefono: '', dispositivo: 'Celular', marcaModelo: '',
    password: '', fallaReportada: '', accesorios: '', presupuesto: 0
  });

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

  const handleStatusChange = (id: string, nuevoEstado: string) => {
    const nuevasOrdenes = ordenes.map(o => o.id === id ? { ...o, estado: nuevoEstado as any } : o);
    setOrdenes(nuevasOrdenes);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, estado: nuevoEstado as any });
    }
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevaOS: OrdenServicio = {
      id: `OS-${1000 + ordenes.length + 1}`,
      cliente: nuevaOrden.cliente,
      telefono: nuevaOrden.telefono,
      dispositivo: nuevaOrden.dispositivo,
      marcaModelo: nuevaOrden.marcaModelo,
      password: nuevaOrden.password,
      fallaReportada: nuevaOrden.fallaReportada,
      accesorios: accesoriosSeleccionados.join(', '),
      estado: 'Pendiente',
      fechaIngreso: new Date().toISOString().split('T')[0],
      total: nuevaOrden.presupuesto
    };
    setAccesoriosSeleccionados([]);
    setOrdenes([nuevaOS, ...ordenes]);
    setIsModalOpen(false);
    setNuevaOrden({
      cliente: '', telefono: '', dispositivo: 'Celular', marcaModelo: '',
      password: '', fallaReportada: '', accesorios: '', presupuesto: 0
    });
  };

  // Lógica para aplicar cambios editados
  const handleConfirmEdit = () => {
    if (selectedOrder) {
      actualizarOrden(selectedOrder);
      setIsEditing(false);
    }
  };

  const handleViewDetails = (orden: OrdenServicio) => {
    setSelectedOrder(orden);
    setIsDetailsOpen(true);
    setIsEditing(false);
  };

  // FILTRADO: Agregamos la lógica de pestañas a tu filtro original
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
        <button className="add-order-btn" onClick={() => setIsModalOpen(true)}>+ Nueva Orden</button>
      </div>

      {/* Selector de pestañas con tus clases existentes */}
      <div className="orders-tabs">
        <button className={activeTab === 'activas' ? 'active' : ''} onClick={() => setActiveTab('activas')}>
          Activas ({ordenes.filter(o => o.estado === 'Pendiente' || o.estado === 'En Proceso').length})
        </button>
        <button className={activeTab === 'finalizadas' ? 'active' : ''} onClick={() => setActiveTab('finalizadas')}>
          Historial / Finalizadas
        </button>
      </div>

      <div className="search-bar-container">
        <input type="text" placeholder="Buscar por Folio, Cliente o Modelo..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* --- MODAL NUEVA ORDEN (Sin cambios en campos) --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content technical-modal">
            <h2>Ingreso de Equipo</h2>
            <form onSubmit={handleSaveOrder}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Seleccionar Cliente</label>
                  <select required value={nuevaOrden.cliente} onChange={(e) => handleSelectCliente(e.target.value)}>
                    <option value="">-- Seleccione un cliente --</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.nombre}>{c.nombre} ({c.empresa})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>WhatsApp (Autocompletado)</label>
                  <input type="text" readOnly value={nuevaOrden.telefono} style={{ backgroundColor: '#f8fafc', cursor: 'not-allowed' }} />
                </div>
                <div className="form-group">
                  <label>Tipo de Equipo</label>
                  <select value={nuevaOrden.dispositivo} onChange={(e) => setNuevaOrden({ ...nuevaOrden, dispositivo: e.target.value })}>
                    <option value="Celular">Celular</option>
                    <option value="Notebook">Notebook</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Tablet">Tablet</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Marca y Modelo</label>
                  <input type="text" required value={nuevaOrden.marcaModelo} onChange={(e) => setNuevaOrden({ ...nuevaOrden, marcaModelo: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Patrón / Contraseña</label>
                  <input type="text" value={nuevaOrden.password} onChange={(e) => setNuevaOrden({ ...nuevaOrden, password: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Costo Reparación</label>
                  <input type="number" value={nuevaOrden.presupuesto} onChange={(e) => setNuevaOrden({ ...nuevaOrden, presupuesto: Number(e.target.value) })} />
                </div>
                <div className="form-group full-width">
                  <label>Servicio Requerido</label>
                  <textarea required value={nuevaOrden.fallaReportada} onChange={(e) => setNuevaOrden({ ...nuevaOrden, fallaReportada: e.target.value })}></textarea>
                </div>
                <div className="form-group full-width">
                  <label style={{ marginBottom: '10px', display: 'block' }}>Estado Físico / Accesorios</label>
                  <div className="checklist-container">
                    {OPCIONES_ESTADO.map(opcion => (
                      <label key={opcion} className="checklist-item">
                        <input
                          type="checkbox"
                          checked={accesoriosSeleccionados.includes(opcion)}
                          onChange={() => handleCheckboxChange(opcion)}
                        />
                        <span>{opcion}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Otras observaciones específicas..."
                    className="mt-10"
                    onChange={(e) => {
                      if (e.target.value) setNuevaOrden({ ...nuevaOrden, accesorios: e.target.value })
                    }}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Generar Orden</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DETALLES --- */}
      {isDetailsOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content details-modal">
            <div className="details-header-print">
              <div>
                <h2>{selectedOrder.id}</h2>
                <p>Fecha: {selectedOrder.fechaIngreso}</p>
              </div>
              <div className="status-updater no-print" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div>
                  <label>Estado Actual:</label>
                  <select
                    value={selectedOrder.estado}
                    className={`status-select ${selectedOrder.estado.toLowerCase().replace(/\s+/g, '-')}`}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Terminado">Terminado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                {/* Botón Eliminar Rojo y Visible */}
                <button className="btn-delete-order" onClick={() => { if (window.confirm("¿Estás seguro de eliminar esta orden permanentemente?")) { eliminarOrden(selectedOrder.id); setIsDetailsOpen(false); } }}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            <div className="details-body">
              <section className="details-section">
                <h3>Cliente: {selectedOrder.cliente}</h3>
                <p><strong>WhatsApp:</strong> {selectedOrder.telefono}</p>
                <div className="details-grid" style={{ marginTop: '10px' }}>
                  <p>
                    <strong>Equipo:</strong> {selectedOrder.dispositivo} -
                    {isEditing ? (
                      <input
                        className="edit-mode-input"
                        value={selectedOrder.marcaModelo}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, marcaModelo: e.target.value })}
                      />
                    ) : (
                      <span> {selectedOrder.marcaModelo}</span>
                    )}
                  </p>
                  <p><strong>Clave:</strong> <span className="password-tag">{selectedOrder.password || 'Sin clave'}</span></p>
                </div>
                <div className="accesorios-box" style={{ marginTop: '15px', padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #64748b' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#475569' }}>Estado Físico / Accesorios:</strong>
                  {isEditing ? (
                    <input
                      className="edit-mode-input"
                      style={{ marginTop: '5px' }}
                      value={selectedOrder.accesorios}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, accesorios: e.target.value })}
                      placeholder="Ej: Rayones, Pantalla trizada..."
                    />
                  ) : (
                    <p style={{ margin: '5px 0 0 0', fontWeight: '500', color: '#1e293b' }}>
                      {selectedOrder.accesorios || 'Ninguno reportado'}
                    </p>
                  )}
                </div>
              </section>

              <section className="details-section">
                <div className="falla-box">
                  <strong>Falla Reportada:</strong>
                  {isEditing ? (
                    <textarea
                      className="edit-mode-input"
                      style={{ marginTop: '10px', height: '60px' }}
                      value={selectedOrder.fallaReportada}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, fallaReportada: e.target.value })}
                    />
                  ) : (
                    <p>{selectedOrder.fallaReportada}</p>
                  )}
                </div>
              </section>

              {/* Total con formato original restaurado */}
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <h3 style={{ margin: 0 }}>
                  Total a Pagar:
                  {isEditing ? (
                    <input
                      type="number"
                      className="edit-mode-input"
                      style={{ width: '120px', marginLeft: '10px', fontSize: '1.2rem' }}
                      value={selectedOrder.total}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, total: Number(e.target.value) })}
                    />
                  ) : (
                    <span style={{ color: '#007bff', marginLeft: '10px' }}> ${selectedOrder.total.toLocaleString()}</span>
                  )}
                </h3>
              </div>
            </div>

            <div className="modal-actions no-print">
              {isEditing ? (
                <button className="btn-save" onClick={handleConfirmEdit}>💾 Guardar Cambios</button>
              ) : (
                <button className="btn-edit" style={{ backgroundColor: '#6c757d', color: 'white' }} onClick={() => setIsEditing(true)}>✏️ Editar Datos</button>
              )}
              <button className="btn-whatsapp" onClick={() => enviarWhatsApp(selectedOrder)}>Notificar WhatsApp</button>
              <button className="btn-print" onClick={() => generarPDFOrden(selectedOrder, configuracion)}>Descargar PDF</button>
              <button className="btn-cancel" onClick={() => { setIsDetailsOpen(false); setIsEditing(false); }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* --- TABLA PRINCIPAL (Igual a la tuya) --- */}
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Folio</th><th>Cliente</th><th>Equipo / Modelo</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.map(orden => (
              <tr key={orden.id}>
                <td><strong>{orden.id}</strong></td>
                <td>{orden.cliente}</td>
                <td><span className="device-type-tag">{orden.dispositivo}</span> {orden.marcaModelo}</td>
                <td>{orden.fechaIngreso}</td>
                <td><span className={`status-pill ${orden.estado.toLowerCase().replace(/\s+/g, '-')}`}>{orden.estado}</span></td>
                <td>${orden.total.toLocaleString()}</td>
                <td><button className="action-btn view" onClick={() => handleViewDetails(orden)}>Detalles</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;