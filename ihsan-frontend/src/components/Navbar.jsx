// ===================================
// IHSAN Frontend — Navbar
// ===================================
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="moon-icon">
                        {isDark ? (
                            <path d="M12 3v1c0 4.97 4.03 9 9 9v1c-5.52 0-10-4.48-10-10V3zm0 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        ) : (
                            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                        )}
                    </svg>
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
                            <Link to="/login" className={`btn btn-primary btn-sm`}>{t('nav.login')}</Link>
                        </>
                    )}

                    {/* Bouton pour basculer le thème */}
                    <button onClick={toggleTheme} className="btn btn-outline btn-sm theme-toggle-btn" title={isDark ? t('nav.theme_title_light') : t('nav.theme_title_dark')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            {isDark ? (
                                <path d="M12 3v1c0 4.97 4.03 9 9 9v1c-5.52 0-10-4.48-10-10V3zm0 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            ) : (
                                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                            )}
                        </svg>
                    </button>

                    {/* Bouton pour changer de langue */}
                    <button onClick={toggleLanguage} className="btn btn-outline btn-sm">
                        {i18n.language === 'fr' ? 'العربية' : 'Français'}
                    </button>
                </div>
            </div>
        </nav>
    );
}
