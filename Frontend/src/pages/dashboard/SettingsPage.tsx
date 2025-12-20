import React, { useState, useEffect } from 'react';
import '../../styles/SettingsPage.styles.css';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface BusinessInfo {
  nombreNegocio: string;
  rut: string;
  direccion: string;
  telefono: string;
  email: string;
  sitioWeb: string;
}

interface NotificationSettings {
  emailOrders: boolean;
  emailReports: boolean;
  whatsappUpdates: boolean;
  systemAlerts: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'profile' | 'notifications' | 'security'>('business');

  const { configuracion, setConfiguracion } = useAppContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BusinessInfo>(configuracion);

  // Estados para perfil
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: '',
    cargo: 'Administrador'
  });

  // Estados para notificaciones
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailOrders: true,
    emailReports: false,
    whatsappUpdates: true,
    systemAlerts: true
  });

  // Estados para seguridad
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setFormData(configuracion);
  }, [configuracion]);

  useEffect(() => {
    setProfileData({
      nombre: user?.nombre || '',
      email: user?.email || '',
      telefono: '',
      cargo: 'Administrador'
    });
  }, [user]);

  // ============================================
  // HANDLERS - INFORMACIÓN DEL NEGOCIO
  // ============================================
  const handleSaveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setConfiguracion(formData);
    alert('✅ Información del negocio guardada y vinculada a tus reportes.');
  };

  // ============================================
  // HANDLERS - PERFIL
  // ============================================
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías hacer una llamada a tu API para actualizar el perfil
    alert('✅ Perfil actualizado correctamente');
  };

  const handlePhotoUpload = () => {
    alert('📸 Funcionalidad de carga de foto en desarrollo');
  };

  // ============================================
  // HANDLERS - NOTIFICACIONES
  // ============================================
  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('gestify_notifications', JSON.stringify(notifications));
    alert('✅ Preferencias de notificaciones guardadas');
  };

  // ============================================
  // HANDLERS - SEGURIDAD
  // ============================================
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Aquí iría la llamada al backend para cambiar la contraseña
    alert('✅ Contraseña actualizada correctamente');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleEnable2FA = () => {
    alert('🔐 Autenticación de dos factores en desarrollo');
  };

  const handleCloseOtherSessions = () => {
    if (window.confirm('¿Cerrar todas las demás sesiones activas?')) {
      alert('✅ Sesiones cerradas exitosamente');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('⚠️ ¿ESTÁS SEGURO? Esta acción eliminará permanentemente tu cuenta y todos tus datos. Esta acción NO se puede deshacer.')) {
      const confirmText = prompt('Escribe "ELIMINAR" para confirmar:');
      if (confirmText === 'ELIMINAR') {
        alert('Tu cuenta será eliminada en 24 horas. Recibirás un email de confirmación.');
        logout();
        navigate('/login');
      }
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Personaliza tu experiencia y los datos de tus documentos</p>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === 'business' ? 'active' : ''}`}
          onClick={() => setActiveTab('business')}
        >
          <span className="tab-icon">🏢</span> Información del Negocio
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span> Mi Perfil
        </button>
        <button
          className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <span className="tab-icon">🔔</span> Notificaciones
        </button>
        <button
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <span className="tab-icon">🔒</span> Seguridad
        </button>
      </div>

      <div className="settings-content">
        {/* ============================================ */}
        {/* TAB: INFORMACIÓN DEL NEGOCIO */}
        {/* ============================================ */}
        {activeTab === 'business' && (
          <div className="settings-grid">
            <div className="settings-section">
              <h2 className="section-title">Información de tu Negocio</h2>
              <p className="help-text" style={{ marginBottom: '20px', color: '#64748b' }}>
                * Estos datos aparecerán en el encabezado de tus órdenes de servicio y PDFs.
              </p>
              <form onSubmit={handleSaveBusinessInfo}>
                <div className="form-grid-settings">
                  <div className="form-group">
                    <label>Nombre del Negocio</label>
                    <input
                      type="text"
                      value={formData.nombreNegocio}
                      onChange={(e) => setFormData({ ...formData, nombreNegocio: e.target.value })}
                      placeholder="Ej: Servicio Técnico XYZ"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>RUT / Identificación Fiscal</label>
                    <input
                      type="text"
                      value={formData.rut}
                      onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                      placeholder="12.345.678-9"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Dirección Física</label>
                    <input
                      type="text"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      placeholder="Av. Principal 123"
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono de Contacto</label>
                    <input
                      type="text"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Público</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contacto@negocio.cl"
                    />
                  </div>

                  <div className="form-group">
                    <label>Sitio Web (opcional)</label>
                    <input
                      type="text"
                      value={formData.sitioWeb}
                      onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
                      placeholder="www.tunegocio.cl"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-save-settings">
                  💾 Guardar y Aplicar a Documentos
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* TAB: MI PERFIL */}
        {/* ============================================ */}
        {activeTab === 'profile' && (
          <div className="settings-section">
            <h2 className="section-title">Mi Perfil Personal</h2>

            <div className="profile-photo-section">
              <div className="avatar-placeholder">
                {profileData.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="profile-photo-actions">
                <button className="btn-upload" onClick={handlePhotoUpload}>
                  Cambiar Foto
                </button>
                <p className="help-text">JPG, PNG o GIF (máx. 2MB)</p>
              </div>
            </div>

            <div className="divider"></div>

            <form onSubmit={handleSaveProfile}>
              <h3 className="subsection-title">Información Personal</h3>
              <div className="form-grid-settings">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    value={profileData.nombre}
                    onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono Personal</label>
                  <input
                    type="tel"
                    value={profileData.telefono}
                    onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                    placeholder="+56 9 8765 4321"
                  />
                </div>

                <div className="form-group">
                  <label>Cargo / Rol</label>
                  <select
                    value={profileData.cargo}
                    onChange={(e) => setProfileData({ ...profileData, cargo: e.target.value })}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Recepcionista">Recepcionista</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-save-settings">
                💾 Guardar Cambios
              </button>
            </form>
          </div>
        )}

        {/* ============================================ */}
        {/* TAB: NOTIFICACIONES */}
        {/* ============================================ */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h2 className="section-title">Preferencias de Notificaciones</h2>
            <p className="help-text" style={{ marginBottom: '25px' }}>
              Controla cómo y cuándo quieres recibir actualizaciones.
            </p>

            <div className="notification-item">
              <div className="notification-info">
                <h4>📧 Notificaciones por Email</h4>
                <p>Recibe alertas sobre nuevas órdenes y cambios de estado</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.emailOrders}
                  onChange={() => handleNotificationToggle('emailOrders')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h4>📊 Reportes Semanales</h4>
                <p>Resumen semanal de actividad y estadísticas</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.emailReports}
                  onChange={() => handleNotificationToggle('emailReports')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h4>💬 Actualizaciones WhatsApp</h4>
                <p>Notificaciones importantes por WhatsApp</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.whatsappUpdates}
                  onChange={() => handleNotificationToggle('whatsappUpdates')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h4>🔔 Alertas del Sistema</h4>
                <p>Notificaciones sobre equipos estancados y pendientes</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications.systemAlerts}
                  onChange={() => handleNotificationToggle('systemAlerts')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <button
              className="btn-save-settings"
              style={{ marginTop: '20px' }}
              onClick={handleSaveNotifications}
            >
              💾 Guardar Preferencias
            </button>
          </div>
        )}

        {/* ============================================ */}
        {/* TAB: SEGURIDAD */}
        {/* ============================================ */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <h2 className="section-title">Seguridad de la Cuenta</h2>

            {/* CAMBIAR CONTRASEÑA */}
            <div className="security-option">
              <h3>🔑 Cambiar Contraseña</h3>
              <p>Actualiza tu contraseña regularmente para mayor seguridad</p>

              <form onSubmit={handleChangePassword}>
                <div className="form-grid-settings">
                  <div className="form-group full-width">
                    <label>Contraseña Actual</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-secondary">
                  Actualizar Contraseña
                </button>
              </form>
            </div>

            <div className="divider"></div>

            {/* AUTENTICACIÓN DE DOS FACTORES */}
            <div className="security-option">
              <h3>🔐 Autenticación de Dos Factores (2FA)</h3>
              <p>Añade una capa extra de seguridad a tu cuenta</p>
              <button className="btn-secondary" onClick={handleEnable2FA}>
                Activar 2FA
              </button>
            </div>

            <div className="divider"></div>

            {/* SESIONES ACTIVAS */}
            <div className="security-option">
              <h3>💻 Sesiones Activas</h3>
              <p>Administra los dispositivos con acceso a tu cuenta</p>

              <div className="active-sessions">
                <div className="session-item">
                  <div className="session-info">
                    <strong>🖥️ Chrome en Windows</strong>
                    <p>Nueva Imperial, Chile • Última actividad: Ahora</p>
                  </div>
                  <span className="session-badge current">Sesión Actual</span>
                </div>

                <div className="session-item">
                  <div className="session-info">
                    <strong>📱 Safari en iPhone</strong>
                    <p>Santiago, Chile • Última actividad: Hace 2 días</p>
                  </div>
                  <button className="btn-danger-small">Cerrar</button>
                </div>
              </div>

              <button
                className="btn-secondary"
                style={{ marginTop: '15px' }}
                onClick={handleCloseOtherSessions}
              >
                Cerrar Todas las Demás Sesiones
              </button>
            </div>

            <div className="divider"></div>

            {/* ZONA DE PELIGRO */}
            <div className="danger-zone">
              <h3>⚠️ Zona de Peligro</h3>
              <p>Estas acciones son permanentes y no se pueden deshacer.</p>
              <button className="btn-danger" onClick={handleDeleteAccount}>
                Eliminar Cuenta Permanentemente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;