// ===================================
// IHSAN Frontend — Page Accueil
// ===================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI, needsAPI } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
    const { t } = useTranslation();
    const [stats, setStats] = useState({ count: 0, needs: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            publicAPI.getTransactions().catch(() => ({ count: 0, transactions: [] })),
            needsAPI.getAll().catch(() => ({ count: 0, needs: [] })),
        ]).then(([txData, needsData]) => {
            const confirmed = txData.transactions || [];
            const totalAmount = confirmed.reduce((s, tx) => s + tx.amount, 0);
            setStats({
                totalDonations: confirmed.length,
                totalAmount,
                totalNeeds: needsData.count || 0,
                neighborhoods: [...new Set(confirmed.map(tx => tx.neighborhood))].length,
            });
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero" style={{ background: 'linear-gradient(135deg, transparent 0%, var(--primary-50) 100%)', paddingTop: '5rem', paddingBottom: '3rem' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="hero-moon" style={{ animation: 'float 4s ease-in-out infinite', margin: '0 auto 2rem' }}>🌙</div>
                    <h1 style={{ textAlign: 'center' }}>
                        {t('home.title1')}<br />
                        <span className="gradient">{t('home.title2')}</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', fontWeight: '500', textAlign: 'center', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                        {t('home.desc')}
                    </p>
                    <div className="hero-actions" style={{ justifyContent: 'center' }}>
                        <Link to="/needs" className="btn btn-primary btn-lg">
                            🎯 {t('home.btn_needs')}
                        </Link>
                        <Link to="/transparency" className="btn btn-outline btn-lg">
                            👁️ {t('home.btn_transparency')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        {t('home.impact_title', 'Notre Impact')}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        {t('home.impact_desc', 'Ensemble, nous créons un changement réel')}
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ display: 'inline-block' }} className="spinner"></div>
                    </div>
                ) : (
                    <div className="stats-bar">
                        <div className="stat-card">
                            <div className="stat-icon">💰</div>
                            <div className="stat-value" style={{ color: 'var(--accent)', fontSize: '2.5rem' }}>
                                {stats.totalAmount?.toLocaleString() || 0}
                            </div>
                            <div className="stat-label" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>MRU {t('home.stats_mru')}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🤝</div>
                            <div className="stat-value" style={{ color: 'var(--primary-light)', fontSize: '2.5rem' }}>
                                {stats.totalDonations || 0}
                            </div>
                            <div className="stat-label" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{t('home.stats_donations')}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📋</div>
                            <div className="stat-value" style={{ color: '#3b82f6', fontSize: '2.5rem' }}>
                                {stats.totalNeeds || 0}
                            </div>
                            <div className="stat-label" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{t('home.stats_needs')}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📍</div>
                            <div className="stat-value" style={{ color: '#f59e0b', fontSize: '2.5rem' }}>
                                {stats.neighborhoods || 0}
                            </div>
                            <div className="stat-label" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{t('home.stats_places')}</div>
                        </div>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section style={{ background: 'linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%)', padding: '4rem 0', marginTop: '3rem', position: 'relative', overflow: 'hidden' }}>
                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                        {t('home.cta_title', 'Prêt à faire la différence ?')}
                    </h2>
                    <p style={{ color: 'var(--primary-dark)', fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
                        {t('home.cta_desc', 'Rejoignez nos donateurs dans cette mission humanitaire.')}
                    </p>
                    <Link to="/needs" className="btn btn-accent btn-lg">
                        ✨ {t('home.cta_button', 'Voir les besoins')}
                    </Link>
                </div>
            </section>
        </div>
    );
}
