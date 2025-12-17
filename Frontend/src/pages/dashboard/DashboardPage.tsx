import React from 'react';
import '../../styles/DashboardPage.styles.css';

interface DashboardProps {
    ordenes: any[]; 
}

const DashboardPage: React.FC<DashboardProps> = ({ ordenes }) => {
    const ingresosTotales = ordenes
        .filter(o => o.estado === 'Terminado')
        .reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

    const pendientes = ordenes.filter(o => o.estado === 'Pendiente').length;
    const enProceso = ordenes.filter(o => o.estado === 'En Proceso').length;
    const terminados = ordenes.filter(o => o.estado === 'Terminado').length;

    const stats = [
        { 
            label: 'Ingresos (Equipos Listos)', 
            value: `$${ingresosTotales.toLocaleString()}`, 
            icon: '💰', 
            color: '#ecfdf5', 
            textColor: '#059669' 
        },
        { 
            label: 'Equipos Pendientes', 
            value: pendientes.toString(), 
            icon: '⏳', 
            color: '#fffbeb', 
            textColor: '#d97706' 
        },
        { 
            label: 'En Proceso', 
            value: enProceso.toString(), 
            icon: '🛠️', 
            color: '#eff6ff', 
            textColor: '#2563eb' 
        },
        { 
            label: 'Listos para Entrega', 
            value: terminados.toString(), 
            icon: '✅', 
            color: '#f0fdf4', 
            textColor: '#16a34a' 
        },
    ];

    const actividadesRecientes = [...ordenes].reverse().slice(0, 5);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="page-title">Panel de Control</h1>
                <p className="page-subtitle">Resumen en tiempo real de tu servicio técnico.</p>
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

            <div className="dashboard-content">
                <div className="activity-section">
                    <h3>Actividad Reciente</h3>
                    <div className="activity-list">
                        {actividadesRecientes.length > 0 ? (
                            actividadesRecientes.map((item) => (
                                <div key={item.id} className="activity-item">
                                    <div className="activity-info">
                                        <strong>{item.id}</strong>
                                        <span>{item.cliente} - {item.marcaModelo}</span>
                                    </div>
                                    <div className="activity-status">
                                        <span className={`status-pill ${item.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {item.estado}
                                        </span>
                                        <small>{item.fechaIngreso}</small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{color: '#94a3b8', padding: '20px 0'}}>No hay órdenes registradas aún.</p>
                        )}
                    </div>
                </div>

                <div className="quick-actions">
                    <h3>Acciones Rápidas</h3>
                    <button className="action-link" onClick={() => window.location.href = '/dashboard/ordenes'}>
                        📄 Nueva Orden de Servicio
                    </button>
                    <button className="action-link secondary" onClick={() => window.print()}>
                        📊 Imprimir Reporte de Vista
                    </button>
                    <button className="action-link secondary" onClick={() => window.location.href = '/dashboard/clientes'}>
                        👥 Ver Lista de Clientes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;