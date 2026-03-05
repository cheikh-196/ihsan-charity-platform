// ===================================
// IHSAN Frontend — Page Transparence
// ===================================
import { useState, useEffect } from 'react';
import { publicAPI } from '../services/api';

export default function TransparencyPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <h1 className="section-title">🔍 Transparence publique</h1>
                    <p className="section-subtitle">
                        Toutes les transactions confirmées — données immuables, lecture seule, vérifiables par tous
                    </p>
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                    padding: 'var(--space-md) var(--space-lg)',
                    background: 'rgba(14, 124, 97, 0.1)', border: '1px solid rgba(14, 124, 97, 0.2)',
                    borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-xl)',
                    fontSize: '0.85rem', color: 'var(--primary-light)'
                }}>
                    🔒 Ces données sont en lecture seule. Chaque transaction est protégée par un hash SHA-256 unique et un ancrage blockchain simulé.
                </div>

                {loading ? (
                    <div className="loading-page">
                        <div className="spinner"></div>
                        <span>Chargement des transactions...</span>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <h3>Aucune transaction confirmée</h3>
                        <p>Les transactions apparaîtront ici une fois confirmées par un validateur.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Besoin</th>
                                    <th>Quartier</th>
                                    <th>Montant</th>
                                    <th>Hash SHA-256</th>
                                    <th>Blockchain</th>
                                    <th>Statut</th>
                                    <th>Impact</th>
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
                                        <td>📍 {tx.neighborhood}</td>
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
                                        <td><span className="badge badge-confirmed">✓ CONFIRMÉ</span></td>
                                        <td>
                                            {tx.impactProof ? (
                                                <span title={tx.impactProof.message} style={{ cursor: 'help' }}>
                                                    ✅ {tx.impactProof.message?.slice(0, 30)}...
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
                    📊 {transactions.length} transaction(s) confirmée(s) •
                    Total: {transactions.reduce((s, t) => s + t.amount, 0).toLocaleString()} MRU
                </div>
            </div>
        </div>
    );
}
