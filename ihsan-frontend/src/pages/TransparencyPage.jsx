// ===================================
// IHSAN Frontend — Page Transparence
// ===================================
import { useState, useEffect } from 'react';
import { publicAPI } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function TransparencyPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        publicAPI.getTransactions()
            .then((data) => setTransactions(data.transactions || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page-content">
            <div className="container">
                <div className="section-header">
                    <h1 className="section-title">{t('transparency.title')}</h1>
                    <p className="section-subtitle">
                        {t('transparency.subtitle')}
                    </p>
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                    padding: 'var(--space-md) var(--space-lg)',
                    background: 'rgba(14, 124, 97, 0.1)', border: '1px solid rgba(14, 124, 97, 0.2)',
                    borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-xl)',
                    fontSize: '0.85rem', color: 'var(--primary-light)'
                }}>
                    {t('transparency.security_note')}
                </div>

                {loading ? (
                    <div className="loading-page">
                        <div className="spinner"></div>
                        <span>{t('transparency.loading')}</span>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                        </div>
                        <h3>{t('transparency.empty_title')}</h3>
                        <p>{t('transparency.empty_desc')}</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t('transparency.table_date')}</th>
                                    <th>{t('transparency.table_need')}</th>
                                    <th>{t('transparency.table_neighborhood')}</th>
                                    <th>{t('transparency.table_amount')}</th>
                                    <th>{t('transparency.table_hash')}</th>
                                    <th>{t('transparency.table_blockchain')}</th>
                                    <th>{t('transparency.table_status')}</th>
                                    <th>{t('transparency.table_impact')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td>{new Date(tx.date).toLocaleDateString('fr-FR')}</td>
                                        <td>
                                            <strong>{tx.needTitle}</strong>
                                            <br />
                                            <span className="badge badge-type" style={{ marginTop: '0.3rem' }}>{tx.needType}</span>
                                        </td>
                                        <td>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                            </svg>
                                            {tx.neighborhood}
                                        </td>
                                        <td style={{ fontWeight: 700, color: 'var(--accent)' }}>
                                            {tx.amount?.toLocaleString()} MRU
                                        </td>
                                        <td>
                                            <span className="hash-cell" title={tx.transactionHash}>
                                                {tx.transactionHash?.slice(0, 16)}...
                                            </span>
                                        </td>
                                        <td>
                                            {tx.blockchainHash ? (
                                                <span className="hash-cell" title={tx.blockchainHash}>
                                                    {tx.blockchainHash?.slice(0, 12)}...
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td><span className="badge badge-confirmed">{t('transparency.status_confirmed')}</span></td>
                                        <td>
                                            {tx.impactProof ? (
                                                <span title={tx.impactProof.message} style={{ cursor: 'help' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                    </svg>
                                                    {tx.impactProof.message?.slice(0, 30)}...
                                                </span>
                                            ) : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                    </svg>
                    {transactions.length} {t('transparency.summary')} {transactions.reduce((s, t) => s + t.amount, 0).toLocaleString()} {t('transparency.currency')}
                </div>
            </div>
        </div>
    );
}
