// ===================================
// IHSAN Frontend — Page Catalogue Besoins
// ===================================
import { useState, useEffect } from 'react';
import { needsAPI, donationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TYPE_LABELS = { IFTAR: '🍽️ Iftar', MEDICAL: '🏥 Médical', FOOD: '🥫 Alimentaire', OTHER: '📦 Autre' };

export default function NeedsPage() {
    const { user } = useAuth();
    const [needs, setNeeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [donateModal, setDonateModal] = useState(null);
    const [amount, setAmount] = useState('');
    const [donating, setDonating] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [error, setError] = useState('');

    const fetchNeeds = () => {
        setLoading(true);
        needsAPI.getAll(filter ? `type=${filter}` : '')
            .then((data) => setNeeds(data.needs || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchNeeds(); }, [filter]);

    const handleDonate = async (e) => {
        e.preventDefault();
        setError('');
        setDonating(true);
        try {
            const data = await donationsAPI.create({
                needId: donateModal.id,
                amount: parseFloat(amount),
            });
            setReceipt(data.receipt);
        } catch (err) {
            setError(err.message);
        } finally {
            setDonating(false);
        }
    };

    const closeModal = () => {
        setDonateModal(null);
        setAmount('');
        setReceipt(null);
        setError('');
        fetchNeeds();
    };

    return (
        <div className="page-content">
            <div className="container">
                <div className="section-header">
                    <h1 className="section-title">🤲 Besoins en attente</h1>
                    <p className="section-subtitle">Choisissez un besoin et contribuez de manière transparente</p>
                </div>

                {/* Filtres */}
                <div className="filters-bar">
                    <button className={`filter-chip ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>
                        Tous
                    </button>
                    {Object.entries(TYPE_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            className={`filter-chip ${filter === key ? 'active' : ''}`}
                            onClick={() => setFilter(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Grille */}
                {loading ? (
                    <div className="loading-page">
                        <div className="spinner"></div>
                        <span>Chargement des besoins...</span>
                    </div>
                ) : needs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <h3>Aucun besoin trouvé</h3>
                        <p>Il n'y a pas de besoins ouverts pour le moment.</p>
                    </div>
                ) : (
                    <div className="needs-grid">
                        {needs.map((need) => (
                            <div className="need-card" key={need.id}>
                                <div className="need-card-header">
                                    <h3 className="need-card-title">{need.title}</h3>
                                    <span className="badge badge-type">{TYPE_LABELS[need.type] || need.type}</span>
                                </div>
                                <div className="need-card-body">
                                    <p className="need-card-desc">{need.description}</p>
                                    <div className="need-card-meta">
                                        <span>📍 {need.neighborhood}</span>
                                        <span>👤 {need.validator?.name}</span>
                                        <span>⭐ {need.validator?.reputationScore?.toFixed(1)}</span>
                                    </div>
                                    <div className="need-card-amount">
                                        {need.amountRequired?.toLocaleString()} <small>MRU</small>
                                    </div>
                                </div>
                                <div className="need-card-footer">
                                    <span className="badge badge-open">OUVERT</span>
                                    {user && user.role === 'DONOR' ? (
                                        <button className="btn btn-accent btn-sm" onClick={() => setDonateModal(need)}>
                                            💰 Donner
                                        </button>
                                    ) : !user ? (
                                        <a href="/login" className="btn btn-outline btn-sm">Se connecter pour donner</a>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Donation Modal */}
            {donateModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        {receipt ? (
                            <div className="receipt">
                                <div className="receipt-icon">✅</div>
                                <h3>Don enregistré avec succès !</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Votre reçu numérique avec preuve SHA-256
                                </p>
                                <div className="receipt-details">
                                    <div className="receipt-row">
                                        <span className="receipt-label">Transaction</span>
                                        <span className="receipt-value">{receipt.transactionId?.slice(0, 8)}...</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">Besoin</span>
                                        <span className="receipt-value">{receipt.needTitle}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">Montant</span>
                                        <span className="receipt-value">{receipt.amount} MRU</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">Quartier</span>
                                        <span className="receipt-value">{receipt.neighborhood}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">Statut</span>
                                        <span className="badge badge-pending">{receipt.status}</span>
                                    </div>
                                    <div className="receipt-row" style={{ flexDirection: 'column', gap: '0.3rem' }}>
                                        <span className="receipt-label">Hash SHA-256</span>
                                        <span className="receipt-hash">{receipt.transactionHash}</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-block" onClick={closeModal} style={{ marginTop: 'var(--space-lg)' }}>
                                    Fermer
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="modal-header">
                                    <h2 className="modal-title">💰 Faire un don</h2>
                                    <button className="modal-close" onClick={closeModal}>×</button>
                                </div>

                                <div style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                                    <strong>{donateModal.title}</strong>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                        📍 {donateModal.neighborhood} • {donateModal.amountRequired} MRU requis
                                    </div>
                                </div>

                                {error && <div className="alert alert-error">⚠️ {error}</div>}

                                <form onSubmit={handleDonate}>
                                    <div className="form-group">
                                        <label className="form-label">Montant (MRU)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Ex: 500"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                            min="1"
                                            step="any"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-accent btn-block btn-lg" disabled={donating}>
                                        {donating ? <span className="spinner"></span> : '🤲 Confirmer le don'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
