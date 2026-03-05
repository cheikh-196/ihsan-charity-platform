// ===================================
// IHSAN Frontend — Page Catalogue Besoins
// ===================================
import { useState, useEffect } from 'react';
import { needsAPI, donationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const TYPE_LABELS_KEYS = { 
    IFTAR: 'needs.filter_iftar', 
    MEDICAL: 'needs.filter_medical', 
    FOOD: 'needs.filter_food', 
    OTHER: 'needs.filter_other' 
};

export default function NeedsPage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    
    const TYPE_LABELS = { 
        IFTAR: t('needs.filter_iftar'), 
        MEDICAL: t('needs.filter_medical'), 
        FOOD: t('needs.filter_food'), 
        OTHER: t('needs.filter_other') 
    };
    
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
                    <h1 className="section-title">{t('needs.title')}</h1>
                    <p className="section-subtitle">{t('needs.subtitle')}</p>
                </div>

                {/* Filtres */}
                <div className="filters-bar">
                    <button className={`filter-chip ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>
                        {t('needs.filter_all')}
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
                        <span>{t('needs.loading')}</span>
                    </div>
                ) : needs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <h3>{t('needs.empty_title')}</h3>
                        <p>{t('needs.empty_desc')}</p>
                    </div>
                ) : (
                    <div className="needs-grid">
                        {needs.map((need) => (
                            <div className="need-card" key={need.id}>
                                <div className="need-card-header">
                                    <h3 className="need-card-title">{t(need.title, need.title)}</h3>
                                    <span className="badge badge-type">{TYPE_LABELS[need.type] || need.type}</span>
                                </div>
                                <div className="need-card-body">
                                    <p className="need-card-desc">{t(need.description, need.description)}</p>
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
                                    <span className="badge badge-open">{t('needs.badge_open')}</span>
                                    {user && user.role === 'DONOR' ? (
                                        <button className="btn btn-accent btn-sm" onClick={() => setDonateModal(need)}>
                                            {t('needs.btn_donate')}
                                        </button>
                                    ) : !user ? (
                                        <a href="/login" className="btn btn-outline btn-sm">{t('needs.btn_login')}</a>
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
                                <h3>{t('needs.receipt_title')}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {t('needs.receipt_desc')}
                                </p>
                                <div className="receipt-details">
                                    <div className="receipt-row">
                                        <span className="receipt-label">{t('needs.receipt_transaction')}</span>
                                        <span className="receipt-value">{receipt.transactionId?.slice(0, 8)}...</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">{t('needs.receipt_need')}</span>
                                        <span className="receipt-value">{t(receipt.needTitle, receipt.needTitle)}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">{t('needs.receipt_amount')}</span>
                                        <span className="receipt-value">{receipt.amount} MRU</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">{t('needs.receipt_neighborhood')}</span>
                                        <span className="receipt-value">{receipt.neighborhood}</span>
                                    </div>
                                    <div className="receipt-row">
                                        <span className="receipt-label">{t('needs.receipt_status')}</span>
                                        <span className="badge badge-pending">{receipt.status}</span>
                                    </div>
                                    <div className="receipt-row" style={{ flexDirection: 'column', gap: '0.3rem' }}>
                                        <span className="receipt-label">{t('needs.receipt_hash')}</span>
                                        <span className="receipt-hash">{receipt.transactionHash}</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-block" onClick={closeModal} style={{ marginTop: 'var(--space-lg)' }}>
                                    {t('needs.btn_close')}
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="modal-header">
                                    <h2 className="modal-title">{t('needs.modal_title')}</h2>
                                    <button className="modal-close" onClick={closeModal}>{t('needs.modal_close')}</button>
                                </div>

                                <div style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                                    <strong>{t(donateModal.title, donateModal.title)}</strong>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                        📍 {donateModal.neighborhood} • {donateModal.amountRequired} MRU requis
                                    </div>
                                </div>

                                {error && <div className="alert alert-error">{t('needs.error_title')} {error}</div>}

                                <form onSubmit={handleDonate}>
                                    <div className="form-group">
                                        <label className="form-label">{t('needs.amount_label')}</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder={t('needs.amount_placeholder')}
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                            min="1"
                                            step="any"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-accent btn-block btn-lg" disabled={donating}>
                                        {donating ? <span className="spinner"></span> : t('needs.btn_confirm')}
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
