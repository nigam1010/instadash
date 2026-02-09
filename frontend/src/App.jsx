import { useState, useEffect } from 'react';
import { fetchMyAnalytics, fetchCompetitors, generateInsights } from './services/api';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Rocket, Zap, Eye, Heart, MessageCircle, Trophy, Flame } from 'lucide-react';
import './App.css';

function App() {
  const [insightsData, setInsightsData] = useState({ insights: [], comparative_data: null });
  const [loading, setLoading] = useState(true);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analytics, competitors, insightsRes] = await Promise.all([
          fetchMyAnalytics(),
          fetchCompetitors(),
          generateInsights()
        ]);
        setInsightsData(insightsRes || { insights: [], comparative_data: null });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const { insights, comparative_data } = insightsData;
  const marketAvg = comparative_data?.market_avg || {};
  const myStats = comparative_data?.you || {};
  const velocity = comparative_data?.velocity || 1.0;
  const engagementShare = comparative_data?.engagement_share || [];
  const summary = comparative_data?.executive_summary || [];

  // V4 Data (Legacy - kept for Showdown)
  const competitorWatch = comparative_data?.competitor_watch || {};

  // V5 Data
  const deepDive = comparative_data?.deep_dive || [];

  // V5.3 Data (Accurate History)
  const realHistory = comparative_data?.real_history || [];
  const compNames = comparative_data?.comp_names || [];

  // SECTION 4: 100% ACCURATE DATA
  const myPostsChart = comparative_data?.my_posts_chart || [];
  const contentDistribution = comparative_data?.content_distribution || [];
  const followerComparison = comparative_data?.follower_comparison || [];

  // Helpers
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toLocaleString();
  };

  // CORS Proxy Helper - uses environment variable in production
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const getProxiedUrl = (url) => {
    if (!url) return '';
    if (!url.startsWith('http')) return url;
    return `${BACKEND_URL.replace('/api', '')}/api/proxy/?url=${encodeURIComponent(url)}`;
  };

  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'];

  if (loading) return <div className="loading-screen"><div className="logo-pulse">📈</div></div>;

  return (
    <div className="dashboard-layout v4">

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1><Rocket className="icon-rocket" /> InstaDash - Instagram Competitors Analytics</h1>
            <p className="header-subtitle">V5.3: Precision Metrics</p>
          </div>
          <button
            className="generate-btn"
            onClick={async () => {
              setGeneratingInsights(true);
              const res = await generateInsights();
              if (res) setInsightsData(res);
              setGeneratingInsights(false);
            }}
            disabled={generatingInsights}
          >
            {generatingInsights ? 'Analyzing...' : <><Zap className="icon-zap" /> Flash Analysis</>}
          </button>
        </header>

        {/* LAYER 1: PULSE */}
        <section className="layer-section">
          <h3 className="layer-title">1. Performance Pulse</h3>
          <div className="grid-6">
            <div className="metric-card compact"><span className="metric-label">Followers</span><span className="metric-value">{formatNumber(myStats.followers)}</span><span className="sub-text">Market Avg: {formatNumber(marketAvg.followers)}</span></div>
            <div className="metric-card compact"><span className="metric-label">Avg Engagement</span><span className="metric-value">{myStats.engagement?.toFixed(2)}%</span><span className="sub-text">Market Avg: {marketAvg.engagement?.toFixed(2)}%</span></div>
            <div className="metric-card compact"><span className="metric-label">Total Posts</span><span className="metric-value">{formatNumber(myStats.posts)}</span><span className="sub-text">Market Avg: {formatNumber(marketAvg.total_posts)}</span></div>
            <div className="metric-card compact highlight"><span className="metric-label">Growth Velocity</span><span className="metric-value x-large">{velocity.toFixed(1)}x</span><span className="sub-text">vs Market Speed</span></div>
            <div className="metric-card compact"><span className="metric-label">Growth Rate (30d)</span><span className="metric-value text-emerald">+{myStats.growth_rate}%</span><span className="sub-text">Market: +{marketAvg.growth_rate}%</span></div>
            <div className="metric-card compact"><span className="metric-label">Quality Score</span><span className="metric-value text-purple">{myStats.avg_likes}</span><span className="sub-text">Avg Likes/Post</span></div>
          </div>
        </section>

        {/* LAYER 2: MARKET TRAJECTORY (3 REAL DATA CHARTS) */}
        <section className="layer-section white-bg">
          <h3 className="layer-title">2. Market Trajectory & Impact</h3>
          <div className="trajectory-grid-3" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '20px' }}>

            {/* Chart 1: Post History (Wide) */}
            <div className="chart-card">
              <div className="chart-header"><h4>Likes History (Recent Posts)</h4></div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={realHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} minTickGap={30} />
                  <YAxis width={40} tickFormatter={(val) => val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155' }}
                    formatter={(value) => [formatNumber(value), 'Likes']}
                  />
                  <Legend verticalAlign="top" height={36} iconSize={8} />
                  <Line connectNulls type="monotone" dataKey="you" name="You" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line connectNulls type="monotone" dataKey="c1" name={compNames[0] || "Comp 1"} stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line connectNulls type="monotone" dataKey="c2" name={compNames[1] || "Comp 2"} stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Total Likes Share (Donut) */}
            <div className="chart-card">
              <div className="chart-header"><h4>Engagement Share</h4></div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={engagementShare} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {engagementShare.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 3: Total Impact (Bar) */}
            <div className="chart-card">
              <div className="chart-header"><h4>Total Likes Captured</h4></div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={engagementShare} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#334155" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {engagementShare.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>

        {/* LAYER 3: GRANULAR DEEP DIVE (3-COL LAYOUT) */}
        <section className="layer-section">
          <h3 className="layer-title">3. Competitor Deep Dive</h3>
          <div className="deep-dive-grid">
            {deepDive.map((comp, i) => (
              <div key={i} className={`competitor-card ${comp.is_me ? 'me-card' : ''}`}>
                <div className="comp-header-v5">
                  <div className="profile-pic-wrapper">
                    {comp.profile_pic ? (
                      <img src={getProxiedUrl(comp.profile_pic)} alt={comp.username} onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <div className="profile-placeholder">{comp.username ? comp.username.substring(0, 2).toUpperCase() : 'NA'}</div>
                    )}
                  </div>

                  <div className="comp-info-row">
                    <span className="comp-name-v5">{comp.username}</span>
                    {comp.is_me && <span className="comp-role-badge">YOU</span>}
                  </div>
                </div>

                <div className="v5-metrics-grid">
                  <div className="v5-metric-box">
                    <Eye className="v5-icon" color="#06b6d4" />
                    <label>Views</label>
                    <span>{formatNumber(comp.best_post?.views || 0)}</span>
                  </div>
                  <div className="v5-metric-box">
                    <Heart className="v5-icon" color="#ec4899" />
                    <label>Likes</label>
                    <span>{formatNumber(comp.best_post?.likes || 0)}</span>
                  </div>
                  <div className="v5-metric-box">
                    <MessageCircle className="v5-icon" color="#8b5cf6" />
                    <label>Comments</label>
                    <span>{formatNumber(comp.best_post?.comments || 0)}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* LAYER 4: ACCURATE ANALYTICS (100% REAL DATA) */}
        <section className="layer-section">
          <h3 className="layer-title">4. Your Analytics (Real Data)</h3>
          <div className="deep-monitor-grid">

            {/* Chart 1: Your Post Performance */}
            <div className="chart-card">
              <div className="chart-header"><h4>Your Post Performance</h4></div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={myPostsChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155' }}
                    formatter={(value, name) => [formatNumber(value), name]}
                  />
                  <Bar dataKey="likes" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} name="Likes" />
                  <Bar dataKey="comments" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={40} name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2: Content Distribution */}
            <div className="chart-card">
              <div className="chart-header"><h4>Content Distribution</h4></div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={contentDistribution} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={60} label>
                    {contentDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 3: Follower Comparison */}
            <div className="chart-card">
              <div className="chart-header"><h4>Follower Comparison</h4></div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={followerComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#334155" />
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={formatNumber} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155' }}
                    formatter={(value) => [formatNumber(value), 'Followers']}
                  />
                  <Bar dataKey="followers" radius={[0, 4, 4, 0]}>
                    {followerComparison.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>

        {/* LAYER 5: SHOWDOWN */}
        <section className="layer-section">
          <h3 className="layer-title">5. Market Showdown (Top vs Top)</h3>
          <div className="showdown-container">
            <div className="showdown-card champion">
              <div className="badge my-badge"><Trophy className="icon-trophy" /> Your Top Post</div>
              <div className="post-preview">
                {competitorWatch?.my_best?.url ? (
                  <img src={getProxiedUrl(competitorWatch.my_best.url)} alt="My Best" onError={(e) => e.target.style.display = 'none'} />
                ) : (
                  <div className="no-preview">No Preview</div>
                )}
              </div>
              <p className="caption-snippet">{competitorWatch?.my_best?.caption?.substring(0, 40)}...</p>
              <div className="sd-stats-grid">
                <div className="sd-stat-item"><label>Views</label><span>{formatNumber(competitorWatch?.my_best?.views)}</span></div>
                <div className="sd-stat-item"><label>Likes</label><span>{formatNumber(competitorWatch?.my_best?.likes)}</span></div>
                <div className="sd-stat-item"><label>Comments</label><span>{formatNumber(competitorWatch?.my_best?.comments)}</span></div>
                <div className="sd-stat-item"><label>Shares</label><span>{formatNumber(competitorWatch?.my_best?.shares)}</span></div>
              </div>
            </div>
            <div className="vs-badge">VS</div>
            <div className="showdown-card challenger">
              <div className="badge their-badge"><Flame className="icon-flame" /> Market Top Post</div>
              <div className="post-preview">
                {competitorWatch?.their_best?.url ? (
                  <img src={getProxiedUrl(competitorWatch.their_best.url)} alt="Their Best" onError={(e) => e.target.style.display = 'none'} />
                ) : (
                  <div className="no-preview">No Preview</div>
                )}
              </div>
              <p className="caption-snippet">{competitorWatch?.their_best?.caption?.substring(0, 40)}...</p>
              <div className="sd-stats-grid">
                <div className="sd-stat-item"><label>Views</label><span>{formatNumber(competitorWatch?.their_best?.views)}</span></div>
                <div className="sd-stat-item"><label>Likes</label><span>{formatNumber(competitorWatch?.their_best?.likes)}</span></div>
                <div className="sd-stat-item"><label>Comments</label><span>{formatNumber(competitorWatch?.their_best?.comments)}</span></div>
                <div className="sd-stat-item"><label>Shares</label><span>{formatNumber(competitorWatch?.their_best?.shares)}</span></div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FLOATING SIDEBAR */}
      <aside className="sidebar-floating">
        <div className="glass-effect">
          <div className="sidebar-header">
            <h3>Executive Summary</h3>
            <span className="live-badge">● LIVE</span>
          </div>
          <div className="summary-list">
            {summary.map((point, i) => (
              <div key={i} className="summary-item">
                <span className="bullet">•</span>
                <p>{point}</p>
              </div>
            ))}
          </div>

          {/* Sidebar Profiles Section */}
          <div className="sidebar-profiles-section">
            <h4 className="sidebar-sub-title">Active Profiles</h4>
            <div className="mini-profile-list">
              {deepDive.map((profile, i) => (
                <div key={i} className="mini-profile-item">
                  <div className="mini-avatar">
                    {profile.profile_pic ?
                      <img src={getProxiedUrl(profile.profile_pic)} alt={profile.username} />
                      : <div className="mini-avatar-placeholder">{profile.username?.substring(0, 1)}</div>
                    }
                  </div>
                  <div className="mini-info">
                    <span className="mini-name">{profile.username} {profile.is_me && "(You)"}</span>
                    <span className="mini-followers">{formatNumber(profile.followers)} followers</span>
                  </div>
                  <div className="status-dot" title="Active"></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}

export default App;
