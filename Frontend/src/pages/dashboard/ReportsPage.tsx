import React, { useState } from 'react';
import '../../styles/ReportsPage.styles.css';
import { useAppContext } from '../../context/AppContext';

const ReportsPage: React.FC = () => {
  const { ordenes } = useAppContext();
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().substring(0, 7));

  // Filtrar órdenes por el mes seleccionado y que estén terminadas (Cobradas)
  const ordenesMes = ordenes.filter(o => o.fechaIngreso.startsWith(filterMonth));
  const ordenesCobradas = ordenesMes.filter(o => o.estado === 'Terminado');

  // Cálculos de dinero
  const ingresosTotales = ordenesCobradas.reduce((acc, current) => acc + current.total, 0);
  const totalPendiente = ordenesMes
    .filter(o => o.estado === 'Pendiente' || o.estado === 'En Proceso')
    .reduce((acc, current) => acc + current.total, 0);

  return (
    <div className="reports-container">
      <div className="orders-header">
        <div>
          <h1 className="page-title">Reportes Financieros</h1>
          <p className="page-subtitle">Análisis de ingresos y rendimiento.</p>
        </div>
      </div>

      <div className="report-filters">
        <label>Seleccionar Mes:</label>
        <input 
          type="month" 
          value={filterMonth} 
          onChange={(e) => setFilterMonth(e.target.value)}
          className="search-input"
          style={{ width: '200px' }}
        />
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Ingresos Reales (Cobrado)</h3>
          <div className="value" style={{ color: '#10b981' }}>
            ${ingresosTotales.toLocaleString()}
          </div>
        </div>

        <div className="report-card" style={{ borderLeftColor: '#f59e0b' }}>
          <h3>Por Cobrar (Pendientes)</h3>
          <div className="value">
            ${totalPendiente.toLocaleString()}
          </div>
        </div>

        <div className="report-card" style={{ borderLeftColor: '#6366f1' }}>
          <h3>Equipos Entregados</h3>
          <div className="value">
            {ordenesCobradas.length}
          </div>
        </div>
      </div>

      <div className="report-table-container">
        <div style={{ padding: '20px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
          Desglose de Órdenes del Mes
        </div>
        <table className="reports-summary-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Cliente</th>
              <th>Equipo</th>
              <th>Estado</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {ordenesMes.length > 0 ? (
              ordenesMes.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.cliente}</td>
                  <td>{o.marcaModelo}</td>
                  <td>
                    <span className={`status-pill ${o.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                      {o.estado}
                    </span>
                  </td>
                  <td><strong>${o.total.toLocaleString()}</strong></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  No hay datos para este periodo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;