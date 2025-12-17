import React, { useState } from 'react';
import '../../styles/OrdersPage.styles.css';

// 1. Interfaz completa con Teléfono
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

const OrdersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrdenServicio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Datos de ejemplo iniciales
  const [ordenes, setOrdenes] = useState<OrdenServicio[]>([
    { 
      id: 'OS-1001', 
      cliente: 'Juan Pérez', 
      telefono: '56912345678',
      dispositivo: 'Celular', 
      marcaModelo: 'iPhone 13', 
      password: '1234 (L)',
      fallaReportada: 'Cambio de pantalla, no da imagen.',
      accesorios: 'Funda roja',
      estado: 'En Proceso', 
      fechaIngreso: '2023-10-20', 
      total: 45000 
    },
    { 
      id: 'OS-1002', 
      cliente: 'María García', 
      telefono: '56998765432',
      dispositivo: 'Notebook', 
      marcaModelo: 'MacBook Air M1', 
      password: 'admin',
      fallaReportada: 'Mantenimiento preventivo y limpieza.',
      accesorios: 'Cargador original',
      estado: 'Pendiente', 
      fechaIngreso: '2023-10-21', 
      total: 120000 
    },
  ]);

  const [nuevaOrden, setNuevaOrden] = useState({
    cliente: '', telefono: '', dispositivo: 'Celular', marcaModelo: '',
    password: '', fallaReportada: '', accesorios: '', presupuesto: 0
  });

  // --- FUNCIÓN WHATSAPP ---
  const enviarWhatsApp = (orden: OrdenServicio) => {
    const mensaje = `Hola *${orden.cliente}*, te contactamos de *Servicio Técnico*. 📱%0A%0A` +
                    `Te informamos que tu equipo *${orden.marcaModelo}* (Orden: ${orden.id}) ` +
                    `se encuentra en estado: *${orden.estado}*.%0A%0A` +
                    `Total a pagar: $${orden.total.toLocaleString()}%0A` +
                    `¡Te esperamos!`;

    const telLimpio = orden.telefono.replace(/\D/g, ''); // Elimina cualquier cosa que no sea número
    const url = `https://wa.me/${telLimpio}?text=${mensaje}`;
    window.open(url, '_blank');
  };

  // --- CAMBIAR ESTADO DESDE DETALLES ---
  const handleStatusChange = (id: string, nuevoEstado: string) => {
    const nuevasOrdenes = ordenes.map(o => 
      o.id === id ? { ...o, estado: nuevoEstado as any } : o
    );
    setOrdenes(nuevasOrdenes);

    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, estado: nuevoEstado as any });
    }
  };

  // --- GUARDAR NUEVA ORDEN ---
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
      accesorios: nuevaOrden.accesorios,
      estado: 'Pendiente',
      fechaIngreso: new Date().toISOString().split('T')[0],
      total: nuevaOrden.presupuesto
    };

    setOrdenes([nuevaOS, ...ordenes]);
    setIsModalOpen(false);
    setNuevaOrden({
        cliente: '', telefono: '', dispositivo: 'Celular', marcaModelo: '',
        password: '', fallaReportada: '', accesorios: '', presupuesto: 0
    });
  };

  const handleViewDetails = (orden: OrdenServicio) => {
    setSelectedOrder(orden);
    setIsDetailsOpen(true);
  };

  const ordenesFiltradas = ordenes.filter(o => 
    o.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.marcaModelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div>
          <h1 className="page-title">Órdenes de Servicio</h1>
          <p className="page-subtitle">Ingreso de equipos a reparación.</p>
        </div>
        <button className="add-order-btn" onClick={() => setIsModalOpen(true)}>
            + Nueva Orden
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

      {/* --- MODAL NUEVA ORDEN --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content technical-modal">
            <h2>Ingreso de Equipo</h2>
            <form onSubmit={handleSaveOrder}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Cliente</label>
                  <input type="text" placeholder="Nombre completo" required 
                    value={nuevaOrden.cliente}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, cliente: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Teléfono (WhatsApp)</label>
                  <input type="text" placeholder="Ej: 56912345678" required 
                    value={nuevaOrden.telefono}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, telefono: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Tipo de Equipo</label>
                  <select value={nuevaOrden.dispositivo} onChange={(e) => setNuevaOrden({...nuevaOrden, dispositivo: e.target.value})}>
                    <option value="Celular">Celular</option>
                    <option value="Notebook">Notebook</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Tablet">Tablet</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Marca y Modelo</label>
                  <input type="text" placeholder="Ej: iPhone 13" required 
                    value={nuevaOrden.marcaModelo} onChange={(e) => setNuevaOrden({...nuevaOrden, marcaModelo: e.target.value})}/>
                </div>

                <div className="form-group">
                  <label>Patrón / Contraseña</label>
                  <input type="text" placeholder="Para pruebas" value={nuevaOrden.password}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, password: e.target.value})}/>
                </div>

                <div className="form-group">
                  <label>Costo Reparación</label>
                  <input type="number" placeholder="0.00" value={nuevaOrden.presupuesto}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, presupuesto: Number(e.target.value)})}/>
                </div>

                <div className="form-group full-width">
                  <label>Falla Reportada</label>
                  <textarea placeholder="Ej: No enciende..." required value={nuevaOrden.fallaReportada}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, fallaReportada: e.target.value})}></textarea>
                </div>

                <div className="form-group full-width">
                  <label>Accesorios / Observaciones</label>
                  <input type="text" placeholder="Ej: Con cargador" value={nuevaOrden.accesorios}
                    onChange={(e) => setNuevaOrden({...nuevaOrden, accesorios: e.target.value})}/>
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
              <div className="status-updater no-print">
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
            </div>

            <div className="details-body">
              <section className="details-section">
                <h3>Cliente: {selectedOrder.cliente}</h3>
                <p><strong>WhatsApp:</strong> {selectedOrder.telefono}</p>
                <div className="details-grid" style={{marginTop: '10px'}}>
                  <p><strong>Equipo:</strong> {selectedOrder.dispositivo} - {selectedOrder.marcaModelo}</p>
                  <p><strong>Clave:</strong> <span className="password-tag">{selectedOrder.password || 'Sin clave'}</span></p>
                </div>
              </section>

              <section className="details-section">
                <div className="falla-box">
                  <strong>Falla Reportada:</strong>
                  <p>{selectedOrder.fallaReportada}</p>
                </div>
                <div className="accesorios-box" style={{marginTop: '10px'}}>
                  <strong>Accesorios:</strong>
                  <p>{selectedOrder.accesorios || 'Ninguno'}</p>
                </div>
              </section>
              <h3 style={{textAlign: 'right', marginTop: '20px'}}>Total a Pagar: ${selectedOrder.total.toLocaleString()}</h3>
            </div>

            <div className="modal-actions no-print">
              <button className="btn-whatsapp" onClick={() => enviarWhatsApp(selectedOrder)}>
                Notificar WhatsApp
              </button>
              <button className="btn-print" onClick={() => window.print()}>Imprimir</button>
              <button className="btn-cancel" onClick={() => setIsDetailsOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* --- TABLA PRINCIPAL --- */}
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
            {ordenesFiltradas.map(orden => (
              <tr key={orden.id}>
                <td><strong>{orden.id}</strong></td>
                <td>{orden.cliente}</td>
                <td>
                  <span className="device-type-tag">{orden.dispositivo}</span> {orden.marcaModelo}
                </td>
                <td>{orden.fechaIngreso}</td>
                <td>
                  <span className={`status-pill ${orden.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                    {orden.estado}
                  </span>
                </td>
                <td>${orden.total.toLocaleString()}</td>
                <td>
                  <button className="action-btn view" onClick={() => handleViewDetails(orden)}>Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;