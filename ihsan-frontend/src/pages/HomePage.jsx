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

    useEffect(() => {
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
        });
    }, []);

    return (
        <div>
            {/* Hero */}
            <section className="hero">
                <div className="container">
                    <div className="hero-moon">🌙</div>
                    <h1>
                        {t('home.title1')}<br />
                        <span className="gradient">{t('home.title2')}</span>
                    </h1>
                    <p>
                        {t('home.desc')}
                    </p>
                    <div className="hero-actions">
                        <Link to="/needs" className="btn btn-primary btn-lg">
                            {t('home.btn_needs')}
                        </Link>
                        <Link to="/transparency" className="btn btn-outline btn-lg">
                            {t('home.btn_transparency')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="container">
                <div className="stats-bar">
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-value">{stats.totalAmount?.toLocaleString() || 0}</div>
                        <div className="stat-label">{t('home.stats_mru')}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🤝</div>
                        <div className="stat-value">{stats.totalDonations || 0}</div>
                        <div className="stat-label">{t('home.stats_donations')}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-value">{stats.totalNeeds || 0}</div>
                        <div className="stat-label">{t('home.stats_needs')}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📍</div>
                        <div className="stat-value">{stats.neighborhoods || 0}</div>
                        <div className="stat-label">{t('home.stats_places')}</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
