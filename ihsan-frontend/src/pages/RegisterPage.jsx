// ===================================
// IHSAN Frontend — Page Inscription
// ===================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'DONOR' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.role);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="moon">🌙</div>
                    <h1>{t('register.title')}</h1>
                    <p>{t('register.subtitle')}</p>
                </div>

                {error && <div className="alert alert-error">⚠️ {t('register.error_title')}: {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">{t('register.name_label')}</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder={t('register.name_placeholder')}
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('register.email_label')}</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder={t('register.email_placeholder')}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('register.password_label')}</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder={t('register.password_placeholder')}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('register.role_label')}</label>
                        <select
                            className="form-select"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                            <option value="DONOR">{t('register.role_donor')}</option>
                            <option value="VALIDATOR">{t('register.role_validator')}</option>
                            <option value="PARTNER">{t('register.role_partner')}</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                        {loading ? <span className="spinner"></span> : t('register.submit_button')}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login">{t('register.login_link')}</Link>
                </div>
            </div>
        </div>
    );
}
