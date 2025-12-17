import React from 'react';
import '../../styles/DashboardPage.styles.css';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { ordenes, configuracion } = useAppContext();
    const navigate = useNavigate();

    // --- 1. KPI: INGRESOS DEL MES ACTUAL ---
    const now = new Date();
    const ingresosMes = ordenes
        .filter(o => {
            const fecha = new Date(o.fechaIngreso);
            return o.estado === 'Terminado' && 
                   fecha.getMonth() === now.getMonth() && 
                   fecha.getFullYear() === now.getFullYear();
        })
        .reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

    // --- 2. ALERTAS: EQUIPOS ESTANCADOS (> 3 DÍAS) ---
    // Filtra pendientes que ingresaron hace más de 3 días
    const alertasEquipos = ordenes.filter(o => {
        const fechaIngreso = new Date(o.fechaIngreso);
        const diasDiferencia = (now.getTime() - fechaIngreso.getTime()) / (1000 * 3600 * 24);
        return o.estado === 'Pendiente' && diasDiferencia > 3;
    });

    // --- 3. GRÁFICO SIMPLE: DISTRIBUCIÓN POR TIPO ---
    const tipos = {
        Celular: ordenes.filter(o => o.dispositivo === 'Celular').length,
        Notebook: ordenes.filter(o => o.dispositivo === 'Notebook').length,
        Otros: ordenes.filter(o => !['Celular', 'Notebook'].includes(o.dispositivo)).length
    };
    const total = ordenes.length || 1; // Evitar división por cero

    const stats = [
        { label: 'Ingresos del Mes', value: `$${ingresosMes.toLocaleString()}`, icon: '📅', color: '#ecfdf5', textColor: '#059669' },
        { label: 'Pendientes', value: ordenes.filter(o => o.estado === 'Pendiente').length.toString(), icon: '⏳', color: '#fffbeb', textColor: '#d97706' },
        { label: 'Listos', value: ordenes.filter(o => o.estado === 'Terminado').length.toString(), icon: '✅', color: '#f0fdf4', textColor: '#16a34a' },
        { label: 'Alertas Críticas', value: alertasEquipos.length.toString(), icon: '🚨', color: '#fef2f2', textColor: '#dc2626' },
    ];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="page-title">Panel de Control</h1>
                <p className="page-subtitle">Resumen de {configuracion.nombreNegocio}</p>
            </header>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ backgroundColor: stat.color }}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value" style={{ color: stat.textColor }}>{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* COLUMNA IZQUIERDA: ALERTAS Y ACTIVIDAD */}
                <div className="main-content">
                    {/* SECCIÓN DE ALERTAS */}
                    {alertasEquipos.length > 0 && (
                        <div className="alert-box">
                            <h3>⚠️ Equipos con retraso (más de 3 días)</h3>
                            {alertasEquipos.map(e => (
                                <div key={e.id} className="alert-item">
                                    <span>{e.id} - {e.cliente}</span>
                                    <button onClick={() => navigate('/dashboard/ordenes')}>Revisar</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="activity-section">
                        <h3>Actividad Reciente</h3>
                        <div className="activity-list">
                            {[...ordenes].reverse().slice(0, 4).map(o => (
                                <div key={o.id} className="activity-item">
                                    <strong>{o.id}</strong>
                                    <span>{o.marcaModelo} - {o.estado}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: GRÁFICO Y ACCIONES */}
                <div className="side-content">
                    <div className="distribution-chart">
                        <h3>Distribución de Equipos</h3>
                        <div className="progress-container">
                            <label>Celulares ({Math.round((tipos.Celular/total)*100)}%)</label>
                            <div className="progress-bar"><div style={{ width: `${(tipos.Celular/total)*100}%`, backgroundColor: '#2563eb' }}></div></div>
                            
                            <label>Notebooks ({Math.round((tipos.Notebook/total)*100)}%)</label>
                            <div className="progress-bar"><div style={{ width: `${(tipos.Notebook/total)*100}%`, backgroundColor: '#8b5cf6' }}></div></div>
                            
                            <label>Otros ({Math.round((tipos.Otros/total)*100)}%)</label>
                            <div className="progress-bar"><div style={{ width: `${(tipos.Otros/total)*100}%`, backgroundColor: '#64748b' }}></div></div>
                        </div>
                    </div>

                    <div className="quick-actions-box">
                        <h3>Acceso Rápido</h3>
                        <button className="btn-dash" onClick={() => navigate('/dashboard/ordenes')}>+ Nueva Reparación</button>
                        <button className="btn-dash secondary" onClick={() => window.print()}>Imprimir Reporte</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;