// ===================================
// IHSAN Frontend — Navbar
// ===================================
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const toggleLanguage = () => {
        const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
        i18n.changeLanguage(newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <span className="moon">🌙</span>
                    <span>{t('app.title', 'IHSAN')}</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className={isActive('/')}>{t('nav.home')}</Link>
                    <Link to="/needs" className={isActive('/needs')}>{t('nav.needs')}</Link>
                    <Link to="/transparency" className={isActive('/transparency')}>{t('nav.transparency')}</Link>

                    {user ? (
                        <>
                            {user.role === 'VALIDATOR' && (
                                <Link to="/validator" className={isActive('/validator')}>{t('nav.dashboard')}</Link>
                            )}
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0 0.5rem' }}>
                                {user.name}
                            </span>
                            <button onClick={logout} className="btn btn-outline btn-sm">
                                {t('nav.logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`btn btn-outline btn-sm`}>{t('nav.login')}</Link>
                            <Link to="/register" className={`btn btn-primary btn-sm`}>{t('nav.register')}</Link>
                        </>
                    )}

                    {/* Bouton pour changer de langue */}
                    <button onClick={toggleLanguage} className="btn btn-outline btn-sm" style={{ marginLeft: '10px' }}>
                        {i18n.language === 'fr' ? 'العربية' : 'Français'}
                    </button>
                </div>
            </div>
        </nav>
    );
}
