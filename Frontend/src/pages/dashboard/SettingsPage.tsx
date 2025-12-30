import React, { useState, useEffect } from 'react';
import '../../styles/SettingsPage.styles.css';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { configuracionService, type ConfiguracionNegocio } from '../../services/configuracion.services';

interface ProfileData {
  nombre: string;
  email: string;
  telefono: string;
  cargo: string;
}

interface NotificationSettings {
  emailOrders: boolean;
  emailReports: boolean;
  whatsappUpdates: boolean;
  systemAlerts: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'profile' | 'notifications' | 'security'>('business');

  const { configuracion, guardarConfiguracion } = useAppContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ConfiguracionNegocio>(configuracion);
  const [saving, setSaving] = useState(false);

  // Estados para perfil
  const [profileData, setProfileData] = useState<ProfileData>({
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

  // Cargar configuración cuando cambie
  useEffect(() => {
    setFormData(configuracion);
  }, [configuracion]);

  // Cargar perfil del usuario
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
  const handleSaveBusinessInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await guardarConfiguracion(formData);
      alert('✅ Información del negocio guardada correctamente en la base de datos.');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('❌ Error al guardar la información. Por favor intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // HANDLERS - PERFIL
  // ============================================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await configuracionService.actualizarPerfil({
        nombre: profileData.nombre,
        telefono: profileData.telefono,
        cargo: profileData.cargo
      });
      
      alert('✅ Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('❌ Error al actualizar el perfil. Por favor intenta nuevamente.');
    } finally {
      setSaving(false);
    }
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
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones frontend
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSaving(true);

    try {
      await configuracionService.cambiarPassword({
        passwordActual: passwordForm.currentPassword,
        passwordNueva: passwordForm.newPassword
      });

      alert('✅ Contraseña actualizada correctamente');
      
      // Limpiar formulario
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      
      // Mostrar mensaje de error específico del backend
      const errorMessage = error.message || 'Error al cambiar la contraseña';
      alert(`❌ ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('⚠️ ¿ESTÁS SEGURO? Esta acción eliminará permanentemente tu cuenta y todos tus datos. Esta acción NO se puede deshacer.')) {
      return;
    }

    const confirmText = prompt('Escribe "ELIMINAR" para confirmar:');
    
    if (confirmText === 'ELIMINAR') {
      setSaving(true);
      
      try {
        await configuracionService.eliminarCuenta();
        alert('✅ Tu cuenta ha sido eliminada permanentemente.');
        
        // Cerrar sesión y redirigir a login
        logout();
        navigate('/login');
      } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        alert('❌ Error al eliminar la cuenta. Por favor intenta nuevamente.');
      } finally {
        setSaving(false);
      }
    } else {
      alert('❌ Confirmación incorrecta. No se eliminó la cuenta.');
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

                <button 
                  type="submit" 
                  className="btn-save-settings"
                  disabled={saving}
                >
                  {saving ? '⏳ Guardando...' : '💾 Guardar y Aplicar a Documentos'}
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
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    * El email no se puede modificar
                  </small>
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

              <button 
                type="submit" 
                className="btn-save-settings"
                disabled={saving}
              >
                {saving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
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
              <h3>🔒 Cambiar Contraseña</h3>
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

                <button 
                  type="submit" 
                  className="btn-secondary"
                  disabled={saving}
                >
                  {saving ? '⏳ Actualizando...' : 'Actualizar Contraseña'}
                </button>
              </form>
            </div>

            <div className="divider"></div>

            {/* ZONA DE PELIGRO */}
            <div className="danger-zone">
              <h3>⚠️ Zona de Peligro</h3>
              <p>Estas acciones son permanentes y no se pueden deshacer.</p>
              <button 
                className="btn-danger" 
                onClick={handleDeleteAccount}
                disabled={saving}
              >
                {saving ? '⏳ Procesando...' : 'Eliminar Cuenta Permanentemente'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;