import React, { useState } from 'react';
import '../../styles/SettingsPage.styles.css';

interface BusinessInfo {
  nombreNegocio: string;
  rut: string;
  direccion: string;
  telefono: string;
  email: string;
  sitioWeb: string;
}

interface UserProfile {
  nombreCompleto: string;
  cargo: string;
  email: string;
  telefono: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'profile' | 'notifications' | 'security'>('business');
  
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    nombreNegocio: 'Gestify Service',
    rut: '12.345.678-9',
    direccion: 'Av. Principal 123, Santiago',
    telefono: '+56 9 1234 5678',
    email: 'contacto@gestify.cl',
    sitioWeb: 'www.gestify.cl'
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    nombreCompleto: 'Admin Usuario',
    cargo: 'Administrador',
    email: 'admin@gestify.cl',
    telefono: '+56 9 8765 4321'
  });

  const [notifications, setNotifications] = useState({
    emailNuevaOrden: true,
    emailEstadoCambiado: true,
    whatsappRecordatorios: false,
    notificacionesPush: true
  });

  const handleSaveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Información del negocio guardada exitosamente');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Perfil actualizado exitosamente');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Preferencias de notificaciones guardadas');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Personaliza tu experiencia y ajusta las preferencias del sistema</p>
      </div>

      {/* Tabs de navegación */}
      <div className="settings-tabs">
        <button 
          className={`tab-button ${activeTab === 'business' ? 'active' : ''}`}
          onClick={() => setActiveTab('business')}
        >
          <span className="tab-icon">🏢</span>
          Información del Negocio
        </button>
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span>
          Mi Perfil
        </button>
        <button 
          className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <span className="tab-icon">🔔</span>
          Notificaciones
        </button>
        <button 
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <span className="tab-icon">🔒</span>
          Seguridad
        </button>
      </div>

      {/* Contenido de cada tab */}
      <div className="settings-content">
        
        {/* TAB: Información del Negocio */}
        {activeTab === 'business' && (
          <div className="settings-section">
            <h2 className="section-title">Información de tu Negocio</h2>
            <form onSubmit={handleSaveBusinessInfo}>
              <div className="form-grid-settings">
                <div className="form-group">
                  <label>Nombre del Negocio</label>
                  <input 
                    type="text" 
                    value={businessInfo.nombreNegocio}
                    onChange={(e) => setBusinessInfo({...businessInfo, nombreNegocio: e.target.value})}
                    placeholder="Ej: Servicio Técnico XYZ"
                  />
                </div>

                <div className="form-group">
                  <label>RUT</label>
                  <input 
                    type="text" 
                    value={businessInfo.rut}
                    onChange={(e) => setBusinessInfo({...businessInfo, rut: e.target.value})}
                    placeholder="12.345.678-9"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Dirección</label>
                  <input 
                    type="text" 
                    value={businessInfo.direccion}
                    onChange={(e) => setBusinessInfo({...businessInfo, direccion: e.target.value})}
                    placeholder="Av. Principal 123"
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input 
                    type="text" 
                    value={businessInfo.telefono}
                    onChange={(e) => setBusinessInfo({...businessInfo, telefono: e.target.value})}
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                    placeholder="contacto@negocio.cl"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Sitio Web</label>
                  <input 
                    type="text" 
                    value={businessInfo.sitioWeb}
                    onChange={(e) => setBusinessInfo({...businessInfo, sitioWeb: e.target.value})}
                    placeholder="www.tunegocio.cl"
                  />
                </div>
              </div>
              
              <button type="submit" className="btn-save-settings">
                💾 Guardar Cambios
              </button>
            </form>
          </div>
        )}

        {/* TAB: Mi Perfil */}
        {activeTab === 'profile' && (
          <div className="settings-section">
            <h2 className="section-title">Mi Perfil de Usuario</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="form-grid-settings">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input 
                    type="text" 
                    value={userProfile.nombreCompleto}
                    onChange={(e) => setUserProfile({...userProfile, nombreCompleto: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Cargo</label>
                  <input 
                    type="text" 
                    value={userProfile.cargo}
                    onChange={(e) => setUserProfile({...userProfile, cargo: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input 
                    type="text" 
                    value={userProfile.telefono}
                    onChange={(e) => setUserProfile({...userProfile, telefono: e.target.value})}
                  />
                </div>
              </div>
              
              <button type="submit" className="btn-save-settings">
                💾 Actualizar Perfil
              </button>
            </form>

            <div className="divider"></div>

            <h3 className="subsection-title">Foto de Perfil</h3>
            <div className="profile-photo-section">
              <div className="profile-photo-preview">
                <div className="avatar-placeholder">
                  <span>👤</span>
                </div>
              </div>
              <div className="profile-photo-actions">
                <button className="btn-upload">📤 Subir Nueva Foto</button>
                <p className="help-text">JPG, PNG o GIF. Máximo 2MB.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Notificaciones */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h2 className="section-title">Preferencias de Notificaciones</h2>
            <form onSubmit={handleSaveNotifications}>
              
              <div className="notification-item">
                <div className="notification-info">
                  <h4>📧 Email - Nueva Orden</h4>
                  <p>Recibe un correo cada vez que se registra una nueva orden de servicio</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.emailNuevaOrden}
                    onChange={(e) => setNotifications({...notifications, emailNuevaOrden: e.target.checked})}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>📧 Email - Cambio de Estado</h4>
                  <p>Notificación cuando una orden cambia de estado</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.emailEstadoCambiado}
                    onChange={(e) => setNotifications({...notifications, emailEstadoCambiado: e.target.checked})}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>💬 WhatsApp - Recordatorios</h4>
                  <p>Recordatorios automáticos para órdenes pendientes</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.whatsappRecordatorios}
                    onChange={(e) => setNotifications({...notifications, whatsappRecordatorios: e.target.checked})}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>🔔 Notificaciones Push</h4>
                  <p>Notificaciones en el navegador para eventos importantes</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.notificacionesPush}
                    onChange={(e) => setNotifications({...notifications, notificacionesPush: e.target.checked})}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <button type="submit" className="btn-save-settings">
                💾 Guardar Preferencias
              </button>
            </form>
          </div>
        )}

        {/* TAB: Seguridad */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <h2 className="section-title">Seguridad de la Cuenta</h2>
            
            <div className="security-option">
              <h3>🔑 Cambiar Contraseña</h3>
              <p>Actualiza tu contraseña periódicamente para mayor seguridad</p>
              <button className="btn-secondary">Cambiar Contraseña</button>
            </div>

            <div className="divider"></div>

            <div className="security-option">
              <h3>📱 Autenticación de Dos Factores</h3>
              <p>Añade una capa extra de seguridad a tu cuenta</p>
              <button className="btn-secondary">Configurar 2FA</button>
            </div>

            <div className="divider"></div>

            <div className="security-option">
              <h3>📋 Sesiones Activas</h3>
              <p>Revisa y cierra sesiones activas en otros dispositivos</p>
              <div className="active-sessions">
                <div className="session-item">
                  <div className="session-info">
                    <strong>💻 Chrome en Windows</strong>
                    <p>Santiago, Chile • Activa ahora</p>
                  </div>
                  <span className="session-badge current">Actual</span>
                </div>
                <div className="session-item">
                  <div className="session-info">
                    <strong>📱 Safari en iPhone</strong>
                    <p>Santiago, Chile • Hace 2 horas</p>
                  </div>
                  <button className="btn-danger-small">Cerrar Sesión</button>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="danger-zone">
              <h3>⚠️ Zona de Peligro</h3>
              <p>Acciones irreversibles que afectan tu cuenta</p>
              <button className="btn-danger">Eliminar Cuenta</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;