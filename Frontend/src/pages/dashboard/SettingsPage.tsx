import React, { useState, useEffect } from 'react';
import '../../styles/SettingsPage.styles.css';
import { useAppContext } from '../../context/AppContext';

// Mantenemos las interfaces para TypeScript
interface BusinessInfo {
  nombreNegocio: string;
  rut: string;
  direccion: string;
  telefono: string;
  email: string;
  sitioWeb: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'profile' | 'notifications' | 'security'>('business');
  
  const { configuracion, setConfiguracion } = useAppContext();

  const [formData, setFormData] = useState<BusinessInfo>(configuracion);

  useEffect(() => {
    setFormData(configuracion);
  }, [configuracion]);

  const handleSaveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setConfiguracion(formData);
    alert('✅ Información del negocio guardada y vinculada a tus reportes.');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Personaliza tu experiencia y los datos de tus documentos</p>
      </div>

      <div className="settings-tabs">
        <button className={`tab-button ${activeTab === 'business' ? 'active' : ''}`} onClick={() => setActiveTab('business')}>
          <span className="tab-icon">🏢</span> Información del Negocio
        </button>
        <button className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <span className="tab-icon">👤</span> Mi Perfil
        </button>
        <button className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
          <span className="tab-icon">🔔</span> Notificaciones
        </button>
        <button className={`tab-button ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
          <span className="tab-icon">🔒</span> Seguridad
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'business' && (
          <div className="settings-section">
            <h2 className="section-title">Información de tu Negocio</h2>
            <p className="help-text" style={{marginBottom: '20px', color: '#64748b'}}>
              * Estos datos aparecerán en el encabezado de tus órdenes de servicio y PDFs.
            </p>
            <form onSubmit={handleSaveBusinessInfo}>
              <div className="form-grid-settings">
                <div className="form-group">
                  <label>Nombre del Negocio</label>
                  <input 
                    type="text" 
                    value={formData.nombreNegocio}
                    onChange={(e) => setFormData({...formData, nombreNegocio: e.target.value})}
                    placeholder="Ej: Servicio Técnico XYZ"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>RUT / Identificación Fiscal</label>
                  <input 
                    type="text" 
                    value={formData.rut}
                    onChange={(e) => setFormData({...formData, rut: e.target.value})}
                    placeholder="12.345.678-9"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Dirección Física</label>
                  <input 
                    type="text" 
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    placeholder="Av. Principal 123"
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono de Contacto</label>
                  <input 
                    type="text" 
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div className="form-group">
                  <label>Email Público</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contacto@negocio.cl"
                  />
                </div>
              </div>
              
              <button type="submit" className="btn-save-settings">
                💾 Guardar y Aplicar a Documentos
              </button>
            </form>
          </div>
        )}

        {activeTab === 'profile' && (
           <div className="settings-section">
             <h2 className="section-title">Mi Perfil</h2>
             <p>Funcionalidad de perfil en desarrollo...</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;