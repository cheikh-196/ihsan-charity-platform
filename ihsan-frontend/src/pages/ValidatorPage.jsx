// ===================================
// IHSAN Frontend — Tableau de bord Validateur
// ===================================
import { useState, useEffect } from 'react';
import { needsAPI, donationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TYPE_LABELS = { IFTAR: '🍽️ Iftar', MEDICAL: '🏥 Médical', FOOD: '🥫 Alimentaire', OTHER: '📦 Autre' };

export default function ValidatorPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [needs, setNeeds] = useState([]);
    const [tab, setTab] = useState('create');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Create Need form
    const [needForm, setNeedForm] = useState({
        title: '', description: '', type: 'IFTAR',
        amountRequired: '', neighborhood: '',
        latitude: '', longitude: '',
    });

    // Confirm form
    const [confirmId, setConfirmId] = useState('');
    const [confirmForm, setConfirmForm] = useState({ confirmationMessage: '', photoUrl: '' });

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
            setSuccess('✅ Besoin créé avec succès !');
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
            const data = await donationsAPI.confirm(confirmId, confirmForm);
            setSuccess(`✅ ${data.message}`);
            setConfirmId('');
            setConfirmForm({ confirmationMessage: '', photoUrl: '' });
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
                    <h1 className="section-title">✅ Espace Validateur</h1>
                    <p className="section-subtitle">
                        Bienvenue {user.name} • Réputation: ⭐ {user.reputationScore?.toFixed(1)}
                    </p>
                </div>

                {/* Tabs */}
                <div className="filters-bar">
                    <button className={`filter-chip ${tab === 'create' ? 'active' : ''}`} onClick={() => { setTab('create'); setError(''); setSuccess(''); }}>
                        📝 Créer un besoin
                    </button>
                    <button className={`filter-chip ${tab === 'confirm' ? 'active' : ''}`} onClick={() => { setTab('confirm'); setError(''); setSuccess(''); }}>
                        🔐 Confirmer un don
                    </button>
                </div>

                {error && <div className="alert alert-error">⚠️ {error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Create Need Tab */}
                {tab === 'create' && (
                    <div className="card" style={{ maxWidth: '700px' }}>
                        <h2 className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>📝 Publier un nouveau besoin</h2>
                        <form onSubmit={handleCreateNeed}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Titre</label>
                                    <input type="text" className="form-input" placeholder="Ex: 10 repas Iftar"
                                        value={needForm.title} onChange={(e) => setNeedForm({ ...needForm, title: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select className="form-select" value={needForm.type}
                                        onChange={(e) => setNeedForm({ ...needForm, type: e.target.value })}>
                                        {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" placeholder="Décrivez le besoin en détail..."
                                    value={needForm.description} onChange={(e) => setNeedForm({ ...needForm, description: e.target.value })} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Montant requis (MRU)</label>
                                    <input type="number" className="form-input" placeholder="1500"
                                        value={needForm.amountRequired} onChange={(e) => setNeedForm({ ...needForm, amountRequired: e.target.value })} required min="1" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Quartier</label>
                                    <input type="text" className="form-input" placeholder="Tevragh Zeina"
                                        value={needForm.neighborhood} onChange={(e) => setNeedForm({ ...needForm, neighborhood: e.target.value })} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Latitude (optionnel)</label>
                                    <input type="number" className="form-input" step="any" placeholder="18.0866"
                                        value={needForm.latitude} onChange={(e) => setNeedForm({ ...needForm, latitude: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Longitude (optionnel)</label>
                                    <input type="number" className="form-input" step="any" placeholder="-15.9785"
                                        value={needForm.longitude} onChange={(e) => setNeedForm({ ...needForm, longitude: e.target.value })} />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <span className="spinner"></span> : '📤 Publier le besoin'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Confirm Donation Tab */}
                {tab === 'confirm' && (
                    <div className="card" style={{ maxWidth: '700px' }}>
                        <h2 className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>🔐 Confirmer la remise d'un don</h2>
                        <form onSubmit={handleConfirm}>
                            <div className="form-group">
                                <label className="form-label">ID de la donation</label>
                                <input type="text" className="form-input" placeholder="UUID de la donation"
                                    value={confirmId} onChange={(e) => setConfirmId(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message de confirmation</label>
                                <textarea className="form-textarea"
                                    placeholder="Décrivez la remise (ex: Remise effectuée à 5 familles du quartier...)"
                                    value={confirmForm.confirmationMessage}
                                    onChange={(e) => setConfirmForm({ ...confirmForm, confirmationMessage: e.target.value })} required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">URL photo (optionnel)</label>
                                <input type="url" className="form-input"
                                    placeholder="https://exemple.com/photo-anonymisee.jpg"
                                    value={confirmForm.photoUrl}
                                    onChange={(e) => setConfirmForm({ ...confirmForm, photoUrl: e.target.value })} />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <span className="spinner"></span> : '✅ Confirmer la remise'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
