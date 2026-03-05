// ===================================
// IHSAN Frontend — Tableau de bord Validateur
// ===================================
import { useState, useEffect } from 'react';
import { needsAPI, donationsAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function ValidatorPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [needs, setNeeds] = useState([]);
    const [tab, setTab] = useState('create');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const TYPE_LABELS = {
        IFTAR: t('needs.filter_iftar'),
        MEDICAL: t('needs.filter_medical'),
        FOOD: t('needs.filter_food'),
        OTHER: t('needs.filter_other'),
    };

    // Create Need form
    const [needForm, setNeedForm] = useState({
        title: '', description: '', type: 'IFTAR',
        amountRequired: '', neighborhood: '',
        latitude: '', longitude: '',
    });

    // Confirm form
    const [confirmId, setConfirmId] = useState('');
    const [confirmForm, setConfirmForm] = useState({ confirmationMessage: '', photoFile: null });

    useEffect(() => {
        if (!user || user.role !== 'VALIDATOR') {
            navigate('/');
        }
    }, [user, navigate]);

    const fetchNeeds = () => {
        needsAPI.getAll().then(data => setNeeds(data.needs || [])).catch(() => { });
    };

    useEffect(() => { fetchNeeds(); }, []);

    const handleCreateNeed = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);
        try {
            await needsAPI.create({
                ...needForm,
                amountRequired: parseFloat(needForm.amountRequired),
                latitude: needForm.latitude ? parseFloat(needForm.latitude) : undefined,
                longitude: needForm.longitude ? parseFloat(needForm.longitude) : undefined,
            });
            setSuccess(t('validator.success_need'));
            setNeedForm({ title: '', description: '', type: 'IFTAR', amountRequired: '', neighborhood: '', latitude: '', longitude: '' });
            fetchNeeds();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('confirmationMessage', confirmForm.confirmationMessage);
            if (confirmForm.photoFile) {
                formData.append('photo', confirmForm.photoFile);
            }
            
            await donationsAPI.confirm(confirmId, formData);
            setSuccess(t('validator.success_confirm'));
            setConfirmId('');
            setConfirmForm({ confirmationMessage: '', photoFile: null });
            fetchNeeds();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'VALIDATOR') return null;

    return (
        <div className="page-content">
            <div className="container">
                <div className="section-header">
                    <h1 className="section-title">{t('validator.title')}</h1>
                    <p className="section-subtitle">
                        {t('validator.subtitle', { name: user.name, score: user.reputationScore?.toFixed(1) })}
                    </p>
                </div>

                {/* Tabs */}
                <div className="filters-bar">
                    <button className={`filter-chip ${tab === 'create' ? 'active' : ''}`} onClick={() => { setTab('create'); setError(''); setSuccess(''); }}>
                        {t('validator.tab_create')}
                    </button>
                    <button className={`filter-chip ${tab === 'confirm' ? 'active' : ''}`} onClick={() => { setTab('confirm'); setError(''); setSuccess(''); }}>
                        {t('validator.tab_confirm')}
                    </button>
                </div>

                {error && <div className="alert alert-error">⚠️ {error}</div>}
                {success && <div className="alert alert-success">{t('validator.success_confirm')}</div>}

                {/* Create Need Tab */}
                {tab === 'create' && (
                    <div className="card" style={{ maxWidth: '700px' }}>
                        <h2 className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>{t('validator.create_heading')}</h2>
                        <form onSubmit={handleCreateNeed}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t('validator.field_title')}</label>
                                    <input type="text" className="form-input" placeholder={t('validator.field_title_placeholder')}
                                        value={needForm.title} onChange={(e) => setNeedForm({ ...needForm, title: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('validator.field_type')}</label>
                                    <select className="form-select" value={needForm.type}
                                        onChange={(e) => setNeedForm({ ...needForm, type: e.target.value })}>
                                        {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('validator.field_description')}</label>
                                <textarea className="form-textarea" placeholder={t('validator.field_description_placeholder')}
                                    value={needForm.description} onChange={(e) => setNeedForm({ ...needForm, description: e.target.value })} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t('validator.field_amount')}</label>
                                    <input type="number" className="form-input" placeholder={t('validator.field_amount_placeholder')}
                                        value={needForm.amountRequired} onChange={(e) => setNeedForm({ ...needForm, amountRequired: e.target.value })} required min="1" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('validator.field_neighborhood')}</label>
                                    <input type="text" className="form-input" placeholder={t('validator.field_neighborhood_placeholder')}
                                        value={needForm.neighborhood} onChange={(e) => setNeedForm({ ...needForm, neighborhood: e.target.value })} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t('validator.field_latitude')}</label>
                                    <input type="number" className="form-input" step="any" placeholder={t('validator.field_latitude_placeholder')}
                                        value={needForm.latitude} onChange={(e) => setNeedForm({ ...needForm, latitude: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('validator.field_longitude')}</label>
                                    <input type="number" className="form-input" step="any" placeholder={t('validator.field_longitude_placeholder')}
                                        value={needForm.longitude} onChange={(e) => setNeedForm({ ...needForm, longitude: e.target.value })} />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <span className="spinner"></span> : t('validator.btn_publish')}
                            </button>
                        </form>
                    </div>
                )}

                {/* Confirm Donation Tab */}
                {tab === 'confirm' && (
                    <div className="card" style={{ maxWidth: '700px' }}>
                        <h2 className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>{t('validator.confirm_heading')}</h2>
                        <form onSubmit={handleConfirm}>
                            <div className="form-group">
                                <label className="form-label">{t('validator.field_donation_id')}</label>
                                <input type="text" className="form-input" placeholder={t('validator.field_donation_id_placeholder')}
                                    value={confirmId} onChange={(e) => setConfirmId(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('validator.field_confirm_message')}</label>
                                <textarea className="form-textarea"
                                    placeholder={t('validator.field_confirm_message_placeholder')}
                                    value={confirmForm.confirmationMessage}
                                    onChange={(e) => setConfirmForm({ ...confirmForm, confirmationMessage: e.target.value })} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('validator.field_photo')}</label>
                                <input type="file" className="form-input"
                                    accept="image/*"
                                    onChange={(e) => setConfirmForm({ ...confirmForm, photoFile: e.target.files[0] })} />
                                {confirmForm.photoFile && (
                                    <div style={{ marginTop: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                                        {t('validator.photo_selected', { fileName: confirmForm.photoFile.name })}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <span className="spinner"></span> : t('validator.btn_confirm')}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
