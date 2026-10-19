/**
 * CyberShield — Score & Progress Center Module
 * Authoritative derived metrics, advanced multi-graph data visualizations:
 * 1. Circular Defense Readiness Gauge (SVG stroke-dashoffset animation & accessible roles)
 * 2. Interactive Training Trajectory Line Graph (SVG path, gradient fill, clamped hover tooltips, range filter, X-axis markers)
 * 3. Multi-Category Comparative Bar Graph (Benchmark thresholds, unranked handling, animated gradients)
 * 4. Threat Vector Exposure Donut Chart (SVG circular arcs, interactive legend, click-to-filter drilldowns)
 * 5. Tactical Defense Vulnerability Matrix (Strongest Shield vs Vulnerability Focus with honest unranked states)
 * 6. Filterable Training Session Log with synchronized offline CSV export (BOM-encoded for Excel)
 * 7. Exhibition Sample Dataset preview mode for science fairs & grading demonstrations
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  // Category metadata registry
  const CATEGORIES = {
    'url_phishing': { name: 'URL & Link Phishing', icon: 'link', color: '#2563EB' },
    'otp_credentials': { name: 'Passwords & OTP Safety', icon: 'key', color: '#DC2626' },
    'fake_offers': { name: 'Fake Offers & Prizes', icon: 'gift', color: '#D97706' },
    'impersonation': { name: 'Impersonation & Authority', icon: 'user-x', color: '#7657F6' },
    'social_pressure': { name: 'Social Pressure & Urgency', icon: 'clock', color: '#1D4ED8' },
    'technical_scams': { name: 'Technical & Browser Safety', icon: 'alert-triangle', color: '#059669' }
  };

  // Realistic Exhibition Mock Sessions for instant demo/presentation mode
  const EXHIBITION_SAMPLE_SESSIONS = [
    {
      id: 'exhibit-sess-1',
      timestamp: Date.now() - 6 * 86400000 - 3600000 * 2,
      category: 'url_phishing',
      difficulty: 'beginner',
      totalQuestions: 5,
      correctCount: 4,
      incorrectCount: 1,
      skippedCount: 0,
      accuracy: 80,
      categoryBreakdown: { 'url_phishing': { correct: 4, total: 5 } },
      carefulVerifierCount: 1
    },
    {
      id: 'exhibit-sess-2',
      timestamp: Date.now() - 5 * 86400000 - 3600000 * 4,
      category: 'otp_credentials',
      difficulty: 'intermediate',
      totalQuestions: 5,
      correctCount: 3,
      incorrectCount: 2,
      skippedCount: 0,
      accuracy: 60,
      categoryBreakdown: { 'otp_credentials': { correct: 3, total: 5 } },
      carefulVerifierCount: 0
    },
    {
      id: 'exhibit-sess-3',
      timestamp: Date.now() - 4 * 86400000 - 3600000 * 1,
      category: 'all',
      difficulty: 'intermediate',
      totalQuestions: 6,
      correctCount: 5,
      incorrectCount: 1,
      skippedCount: 0,
      accuracy: 83,
      categoryBreakdown: {
        'url_phishing': { correct: 1, total: 1 },
        'fake_offers': { correct: 1, total: 1 },
        'impersonation': { correct: 1, total: 1 },
        'social_pressure': { correct: 1, total: 1 },
        'technical_scams': { correct: 1, total: 1 },
        'otp_credentials': { correct: 0, total: 1 }
      },
      carefulVerifierCount: 2
    },
    {
      id: 'exhibit-sess-4',
      timestamp: Date.now() - 3 * 86400000 - 3600000 * 5,
      category: 'fake_offers',
      difficulty: 'beginner',
      totalQuestions: 4,
      correctCount: 4,
      incorrectCount: 0,
      skippedCount: 0,
      accuracy: 100,
      categoryBreakdown: { 'fake_offers': { correct: 4, total: 4 } },
      carefulVerifierCount: 1
    },
    {
      id: 'exhibit-sess-5',
      timestamp: Date.now() - 2 * 86400000 - 3600000 * 3,
      category: 'impersonation',
      difficulty: 'advanced',
      totalQuestions: 5,
      correctCount: 4,
      incorrectCount: 1,
      skippedCount: 0,
      accuracy: 80,
      categoryBreakdown: { 'impersonation': { correct: 4, total: 5 } },
      carefulVerifierCount: 1
    },
    {
      id: 'exhibit-sess-6',
      timestamp: Date.now() - 1 * 86400000 - 3600000 * 6,
      category: 'technical_scams',
      difficulty: 'intermediate',
      totalQuestions: 5,
      correctCount: 5,
      incorrectCount: 0,
      skippedCount: 0,
      accuracy: 100,
      categoryBreakdown: { 'technical_scams': { correct: 5, total: 5 } },
      carefulVerifierCount: 2
    },
    {
      id: 'exhibit-sess-7',
      timestamp: Date.now() - 14 * 3600000,
      category: 'social_pressure',
      difficulty: 'intermediate',
      totalQuestions: 5,
      correctCount: 4,
      incorrectCount: 1,
      skippedCount: 0,
      accuracy: 80,
      categoryBreakdown: { 'social_pressure': { correct: 4, total: 5 } },
      carefulVerifierCount: 1
    },
    {
      id: 'exhibit-sess-8',
      timestamp: Date.now() - 2 * 3600000,
      category: 'all',
      difficulty: 'advanced',
      totalQuestions: 6,
      correctCount: 6,
      incorrectCount: 0,
      skippedCount: 0,
      accuracy: 100,
      categoryBreakdown: {
        'url_phishing': { correct: 1, total: 1 },
        'otp_credentials': { correct: 1, total: 1 },
        'fake_offers': { correct: 1, total: 1 },
        'impersonation': { correct: 1, total: 1 },
        'social_pressure': { correct: 1, total: 1 },
        'technical_scams': { correct: 1, total: 1 }
      },
      carefulVerifierCount: 3
    }
  ];

  // Module state
  let isDemoActive = false; // Live user data is ALWAYS default
  let activeRangeFilter = 'all'; // 'all', '10', '5'
  let filterCategory = 'all';
  let filterDifficulty = 'all';
  let filterSearchQuery = '';

  const ProgressModule = {
    render: function(container) {
      const state = global.CyberShield.State;
      const getIcon = global.CyberShield.getIcon;
      const fmt = global.CyberShield.Formatting;

      const liveData = state.getData();
      const liveDerived = state.getDerivedStats();
      const realSessions = liveData.sessions || [];
      const hasRealData = realSessions.length > 0;

      // Active dataset: live user data is primary; exhibition demo only if explicitly toggled
      const sessions = isDemoActive ? EXHIBITION_SAMPLE_SESSIONS : realSessions;
      const derived = isDemoActive ? this.computeStatsFromSessions(sessions, liveData.lessonProgress) : liveDerived;

      // Defense Readiness Score calculation (0 - 100)
      const readinessScore = this.computeReadinessScore(derived);
      const tierInfo = this.getReadinessTier(readinessScore);

      // Achievements list
      const achievementsList = [
        {
          id: 'scam-spotter',
          name: 'Scam Spotter',
          desc: 'Complete your first training round in the Awareness Arena.',
          icon: 'shield-check',
          unlocked: isDemoActive ? true : liveData.achievements['scam-spotter']?.unlocked,
          date: isDemoActive ? Date.now() - 86400000 * 6 : liveData.achievements['scam-spotter']?.unlockedAt
        },
        {
          id: 'careful-verifier',
          name: 'Careful Verifier',
          desc: 'Choose independent verification as the optimal action in 3 scenarios.',
          icon: 'check-circle',
          unlocked: isDemoActive ? true : liveData.achievements['careful-verifier']?.unlocked,
          date: isDemoActive ? Date.now() - 86400000 * 3 : liveData.achievements['careful-verifier']?.unlockedAt
        },
        {
          id: 'link-detective',
          name: 'Link Detective',
          desc: 'Inspect at least 3 suspicious URLs in the local Link Inspector.',
          icon: 'link',
          unlocked: isDemoActive ? true : liveData.achievements['link-detective']?.unlocked,
          date: isDemoActive ? Date.now() - 86400000 * 4 : liveData.achievements['link-detective']?.unlockedAt
        },
        {
          id: 'message-guardian',
          name: 'Message Guardian',
          desc: 'Inspect at least 3 suspicious messages in the Message Analyzer.',
          icon: 'message-square',
          unlocked: isDemoActive ? true : liveData.achievements['message-guardian']?.unlocked,
          date: isDemoActive ? Date.now() - 86400000 * 2 : liveData.achievements['message-guardian']?.unlockedAt
        },
        {
          id: 'consistent-learner',
          name: 'Consistent Learner',
          desc: 'Complete at least 3 full practice rounds in the Arena.',
          icon: 'trending-up',
          unlocked: isDemoActive ? true : liveData.achievements['consistent-learner']?.unlocked,
          date: isDemoActive ? Date.now() - 86400000 * 5 : liveData.achievements['consistent-learner']?.unlockedAt
        },
        {
          id: 'knowledge-champion',
          name: 'Knowledge Champion',
          desc: 'Read and complete all 7 lessons in the Cyber Safety Hub.',
          icon: 'award',
          unlocked: isDemoActive ? true : liveData.achievements['knowledge-champion']?.unlocked,
          date: isDemoActive ? Date.now() - 86400000 * 1 : liveData.achievements['knowledge-champion']?.unlockedAt
        }
      ];

      // Sizing for Circular Readiness Gauge (Large prominent visual)
      const gaugeRadius = 85;
      const gaugeCircumference = 2 * Math.PI * gaugeRadius; // ~534.07
      const gaugeOffset = gaugeCircumference - (gaugeCircumference * (readinessScore / 100));

      // Calculate Strongest & Weakest categories for Diagnostic Highlights
      const analysisCategories = this.analyzeCategoryStrengths(derived.categoryStats);
      const strongest = analysisCategories.strongest;
      const weakest = analysisCategories.weakest;

      // Donut Chart data
      let totalAllVectors = 0;
      Object.values(derived.categoryStats).forEach(c => {
        totalAllVectors += (c.total || 0);
      });
      const donutData = this.buildDonutSvg(derived.categoryStats, totalAllVectors);

      container.innerHTML = `
        <div class="card" style="margin-bottom: var(--space-xl);">
          <!-- Header Bar -->
          <div class="card-header">
            <div class="card-title-group">
              <h1 class="card-title" style="font-size: var(--font-size-lg);">
                ${getIcon('bar-chart-2')}
                <span>Score & Progress Analytics</span>
              </h1>
              <span class="card-subtitle">
                Authoritative local defense metrics, vector exposure breakdowns, and training trajectory
              </span>
            </div>
            <div style="display: flex; gap: var(--space-sm); align-items: center; flex-wrap: wrap;">
              <button class="btn btn-ghost btn-sm" id="btn-toggle-demo-mode" title="Toggle between your live progression and sample exhibition data">
                ${getIcon(isDemoActive ? 'database' : 'sparkles')}
                <span id="demo-mode-label">${isDemoActive ? 'Switch to Live Data' : 'Preview Sample Data'}</span>
              </button>
              <button class="btn btn-primary btn-sm" id="btn-progress-cert">
                ${getIcon('award')}
                <span>Defense Certificate</span>
              </button>
              <button class="btn btn-danger btn-sm" id="btn-open-reset-modal" title="Permanently wipe local history">
                ${getIcon('trash-2')}
                <span>Clear History</span>
              </button>
            </div>
          </div>

          <div class="card-body">
            ${isDemoActive ? `
              <div class="alert alert-info" style="margin-bottom: var(--space-xl);">
                <div class="alert-icon">${getIcon('sparkles')}</div>
                <div class="alert-content">
                  <div class="alert-title">Exhibition Demo Mode Active</div>
                  <div class="alert-message">
                    Displaying 8 sample training sessions with multi-category analytics for project review.
                    Click <strong>"Switch to Live Data"</strong> above to return to your real session records.
                  </div>
                </div>
              </div>
            ` : (!hasRealData ? `
              <div class="alert alert-info" style="margin-bottom: var(--space-xl);">
                <div class="alert-icon">${getIcon('trending-up')}</div>
                <div class="alert-content">
                  <div class="alert-title">Live Progression Tracking Active</div>
                  <div class="alert-message">
                    Your trajectory line graph, threat vector exposure, and defense perimeter will automatically plot as you complete practice rounds in the <strong>Awareness Arena</strong> or quizzes in the <strong>Learning Hub</strong>. Complete your first drill to begin!
                  </div>
                </div>
              </div>
            ` : '')}

            <!-- 1. Hero Analytics & Circular Readiness Gauge -->
            <div class="progress-analytics-hero">
              <!-- Left: Circular Gauge Card -->
              <div class="readiness-gauge-card">
                <div class="readiness-gauge-wrap">
                  <svg class="chart-svg readiness-gauge-svg" width="220" height="220" viewBox="0 0 220 220" style="width: 220px; height: 220px; max-width: 220px; max-height: 220px;" role="img" aria-label="Defense Readiness Score: ${readinessScore}%, Tier: ${tierInfo.title}">
                    <g transform="rotate(-90 110 110)">
                      <circle class="gauge-bg" cx="110" cy="110" r="${gaugeRadius}"></circle>
                      <circle class="gauge-progress" cx="110" cy="110" r="${gaugeRadius}"
                        stroke="${tierInfo.color}"
                        stroke-dasharray="${gaugeCircumference.toFixed(1)}"
                        stroke-dashoffset="${gaugeOffset.toFixed(1)}">
                      </circle>
                    </g>
                  </svg>
                  <div class="gauge-inner-content">
                    <span class="gauge-score">${readinessScore}%</span>
                    <span class="gauge-label">${hasRealData || isDemoActive ? 'READINESS' : 'INITIAL'}</span>
                  </div>
                </div>
                <div class="readiness-tier-badge badge ${tierInfo.badgeClass}">
                  ${getIcon(tierInfo.icon, 'icon-inline')}
                  <span>${tierInfo.title}</span>
                </div>
              </div>

              <!-- Right: Quick Diagnostic Highlights -->
              <div class="analytics-hero-details">
                <div>
                  <h2 style="font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); margin-bottom: 4px;">
                    Cyber Defense Readiness
                  </h2>
                  <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-md);">
                    A composite index weighted across overall accuracy, total round volume, and safety guides mastered.
                  </p>
                </div>

                <div class="highlights-grid">
                  <div class="highlight-box">
                    <span class="highlight-box-title">
                      ${getIcon('shield', 'icon-inline')}
                      <span>Strongest Shield</span>
                    </span>
                    <span class="highlight-box-value">
                      ${derived.totalAnswered === 0 ? 'Pending Drill Data' : (strongest ? strongest.name : 'All Categories Solid')}
                    </span>
                    <span class="highlight-box-desc">
                      ${derived.totalAnswered === 0 
                        ? 'Complete practice rounds to establish strengths' 
                        : (strongest ? `${strongest.pct}% accuracy across ${strongest.total} attacks` : '100% defense rate achieved')}
                    </span>
                  </div>

                  <div class="highlight-box">
                    <span class="highlight-box-title">
                      ${getIcon('alert-triangle', 'icon-inline')}
                      <span>Vulnerability Focus</span>
                    </span>
                    <span class="highlight-box-value">
                      ${derived.totalAnswered === 0 ? 'Pending Drill Data' : (weakest ? weakest.name : 'Shield Intact')}
                    </span>
                    <span class="highlight-box-desc">
                      ${derived.totalAnswered === 0 
                        ? 'Complete rounds to detect vulnerability vectors' 
                        : (weakest ? `${weakest.pct}% accuracy (${weakest.incorrect} missed attacks)` : '100% defense across all practiced vectors')}
                    </span>
                  </div>

                  <div class="highlight-box">
                    <span class="highlight-box-title">
                      ${getIcon('check-circle', 'icon-inline')}
                      <span>Mastery Sessions</span>
                    </span>
                    <span class="highlight-box-value">
                      ${sessions.filter(s => s.accuracy === 100).length} Perfect Rounds
                    </span>
                    <span class="highlight-box-desc">
                      ${derived.totalRounds} total sessions recorded locally
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Standard Metrics Row -->
            <div class="metric-grid" style="margin-bottom: var(--space-xl);">
              <div class="metric-card">
                <div class="metric-card-top">
                  <span class="metric-label">Completed Rounds</span>
                  <div class="metric-icon-box blue">${getIcon('gamepad')}</div>
                </div>
                <div class="metric-value">${derived.totalRounds}</div>
                <div class="metric-subtext">Total practice sessions</div>
              </div>

              <div class="metric-card">
                <div class="metric-card-top">
                  <span class="metric-label">Total Answered</span>
                  <div class="metric-icon-box purple">${getIcon('check')}</div>
                </div>
                <div class="metric-value">${derived.totalAnswered}</div>
                <div class="metric-subtext">${derived.totalCorrect} correct • ${derived.totalIncorrect} incorrect</div>
              </div>

              <div class="metric-card">
                <div class="metric-card-top">
                  <span class="metric-label">Weighted Accuracy</span>
                  <div class="metric-icon-box green">${getIcon('trending-up')}</div>
                </div>
                <div class="metric-value">${derived.overallAccuracyPct !== null ? `${derived.overallAccuracyPct}%` : '—'}</div>
                <div class="metric-subtext">${derived.totalAnswered > 0 ? 'Correct / Answered × 100' : 'No answers recorded'}</div>
              </div>

              <div class="metric-card">
                <div class="metric-card-top">
                  <span class="metric-label">Questions Skipped</span>
                  <div class="metric-icon-box amber">${getIcon('info')}</div>
                </div>
                <div class="metric-value">${derived.totalSkipped}</div>
                <div class="metric-subtext">Excluded from accuracy</div>
              </div>
            </div>

            <!-- 2. Dual Graph Section: Line Graph & Donut Chart -->
            <div class="analytics-section-grid">
              <!-- Left: Training Trajectory Line Graph -->
              <div class="chart-card">
                <div class="chart-card-header">
                  <div class="chart-title-group">
                    <span class="chart-title">
                      ${getIcon('trending-up', 'icon-inline')}
                      <span>Training Trajectory Curve</span>
                    </span>
                    <span class="chart-subtitle">
                      Session-by-session accuracy progression over practice history
                    </span>
                  </div>
                  <div class="chart-filter-pills" id="line-chart-filter-group" role="tablist" aria-label="Session range filter">
                    <button class="chart-filter-btn ${activeRangeFilter === 'all' ? 'active' : ''}" data-range="all" role="tab">All</button>
                    <button class="chart-filter-btn ${activeRangeFilter === '10' ? 'active' : ''}" data-range="10" role="tab">Last 10</button>
                    <button class="chart-filter-btn ${activeRangeFilter === '5' ? 'active' : ''}" data-range="5" role="tab">Last 5</button>
                  </div>
                </div>

                <div class="line-chart-container" id="line-chart-wrapper">
                  ${this.buildLineChartSvg(sessions, activeRangeFilter, fmt)}
                </div>
              </div>

              <!-- Right: Threat Vector Exposure Donut Chart -->
              <div class="chart-card">
                <div class="chart-card-header">
                  <div class="chart-title-group">
                    <span class="chart-title">
                      ${getIcon('pie-chart', 'icon-inline')}
                      <span>Threat Vector Exposure</span>
                    </span>
                    <span class="chart-subtitle">
                      Click any vector to drill down into corresponding logs
                    </span>
                  </div>
                </div>

                <div class="donut-chart-wrapper">
                  <div class="donut-svg-wrap">
                    ${donutData.svg}
                  </div>
                  <div class="donut-legend" id="donut-legend-container">
                    ${donutData.legend}
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Advanced Tactical Visualizations: Defense Perimeter Radar & Threat Encounter vs Defense -->
            <div class="analytics-section-grid equal-split">
              <!-- Left: Defense Perimeter Radar Chart -->
              <div class="chart-card">
                <div class="chart-card-header">
                  <div class="chart-title-group">
                    <span class="chart-title">
                      ${getIcon('shield', 'icon-inline')}
                      <span>Defense Perimeter Radar</span>
                    </span>
                    <span class="chart-subtitle">
                      6-axis security perimeter compared against 80% cyber readiness target
                    </span>
                  </div>
                </div>

                <div class="radar-chart-container">
                  ${this.buildRadarChartSvg(derived.categoryStats, getIcon)}
                </div>
              </div>

              <!-- Right: Threat Encounter vs Defended Dual-Bar Chart -->
              <div class="chart-card">
                <div class="chart-card-header">
                  <div class="chart-title-group">
                    <span class="chart-title">
                      ${getIcon('bar-chart-2', 'icon-inline')}
                      <span>Threat Encounters vs Defended</span>
                    </span>
                    <span class="chart-subtitle">
                      Volume of attacks faced vs successfully thwarted by threat vector
                    </span>
                  </div>
                </div>

                ${this.buildDualBarChartHtml(derived.categoryStats, getIcon)}
              </div>
            </div>

            <!-- 4. Dual Section: Category Mastery Bar Graph & Tactical Matrix -->
            <div class="analytics-section-grid">
              <!-- Left: Category Mastery Comparative Bar Graph -->
              <div class="chart-card">
                <div class="chart-card-header">
                  <div class="chart-title-group">
                    <span class="chart-title">
                      ${getIcon('bar-chart-2', 'icon-inline')}
                      <span>Threat Category Mastery</span>
                    </span>
                    <span class="chart-subtitle">
                      Comparative breakdown against 80% security benchmark
                    </span>
                  </div>
                </div>

                ${this.buildBarChartHtml(derived.categoryStats, getIcon)}
              </div>

              <!-- Right: Tactical Defense Vulnerability Matrix -->
              <div class="vulnerability-card">
                <div class="chart-card-header" style="margin-bottom: var(--space-sm);">
                  <div class="chart-title-group">
                    <span class="chart-title">
                      ${getIcon('shield', 'icon-inline')}
                      <span>Tactical Vulnerability Matrix</span>
                    </span>
                    <span class="chart-subtitle">
                      Identified cognitive blindspots and tailored countermeasures
                    </span>
                  </div>
                </div>

                ${this.buildTacticalMatrixHtml(strongest, weakest, derived, getIcon)}
              </div>
            </div>

            <!-- 5. Achievements Section -->
            <h2 style="font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); margin: var(--space-xl) 0 var(--space-md);">
              Achievements & Milestones
            </h2>
            <div class="achievements-grid">
              ${achievementsList.map(ach => `
                <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
                  <div class="achievement-icon">${getIcon(ach.icon)}</div>
                  <div class="achievement-info">
                    <span class="achievement-name">${ach.name}</span>
                    <span class="achievement-desc">${ach.desc}</span>
                    <span style="font-size: 0.7rem; color: var(--color-text-muted); margin-top: 4px;">
                      ${ach.unlocked ? `Unlocked ${fmt.formatDate(ach.date)}` : 'Locked'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- 5. Filterable Training Session Log -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin: var(--space-2xl) 0 var(--space-md); flex-wrap: wrap; gap: var(--space-sm);">
              <div>
                <h2 style="font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); margin: 0;">
                  Training Session Log
                </h2>
                <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  Filterable audit log with one-click offline CSV export
                </span>
              </div>
              <button class="btn btn-secondary btn-sm" id="btn-export-csv" title="Export currently filtered sessions to CSV">
                ${getIcon('download')}
                <span>Export CSV</span>
              </button>
            </div>

            <!-- Table Filters Toolbar -->
            <div class="table-toolbar">
              <div class="table-filters">
                <label for="table-filter-category" class="visually-hidden">Filter by Category</label>
                <select id="table-filter-category" class="form-select form-select-sm" style="min-width: 170px;">
                  <option value="all">All Categories</option>
                  <option value="url_phishing" ${filterCategory === 'url_phishing' ? 'selected' : ''}>URL & Link Phishing</option>
                  <option value="otp_credentials" ${filterCategory === 'otp_credentials' ? 'selected' : ''}>Passwords & OTP Safety</option>
                  <option value="fake_offers" ${filterCategory === 'fake_offers' ? 'selected' : ''}>Fake Offers & Prizes</option>
                  <option value="impersonation" ${filterCategory === 'impersonation' ? 'selected' : ''}>Impersonation & Authority</option>
                  <option value="social_pressure" ${filterCategory === 'social_pressure' ? 'selected' : ''}>Social Pressure & Urgency</option>
                  <option value="technical_scams" ${filterCategory === 'technical_scams' ? 'selected' : ''}>Technical & Browser Safety</option>
                </select>

                <label for="table-filter-difficulty" class="visually-hidden">Filter by Difficulty</label>
                <select id="table-filter-difficulty" class="form-select form-select-sm" style="min-width: 130px;">
                  <option value="all">All Difficulties</option>
                  <option value="beginner" ${filterDifficulty === 'beginner' ? 'selected' : ''}>Beginner</option>
                  <option value="intermediate" ${filterDifficulty === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                  <option value="advanced" ${filterDifficulty === 'advanced' ? 'selected' : ''}>Advanced</option>
                </select>
              </div>

              <div>
                <input type="search" id="table-search-input" class="form-input form-input-sm"
                  placeholder="Search logs..." value="${global.CyberShield.SafeRender.escapeHtml(filterSearchQuery)}"
                  style="min-width: 200px;" aria-label="Search training sessions">
              </div>
            </div>

            <!-- Table Content -->
            <div id="session-table-container">
              ${this.renderSessionTableHtml(sessions, filterCategory, filterDifficulty, filterSearchQuery, fmt, getIcon)}
            </div>
          </div>
        </div>

        <!-- Reset Confirmation Modal -->
        <div class="modal-backdrop" id="reset-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="modal-reset-title">
          <div class="modal-dialog">
            <div class="modal-header">
              <span class="modal-title" id="modal-reset-title">Clear All Training Progress?</span>
              <button class="btn-icon" data-close-modal aria-label="Close dialog">${getIcon('x')}</button>
            </div>
            <div class="modal-body">
              <p style="font-size: var(--font-size-sm); margin-bottom: var(--space-md);">
                Are you sure you want to clear your local training history, session logs, accuracy metrics, and unlocked achievements?
              </p>
              <div class="alert alert-warning">
                <div class="alert-icon">${getIcon('alert-triangle')}</div>
                <div class="alert-content">
                  <div class="alert-title">This action cannot be undone</div>
                  <div class="alert-message">All data stored in this browser's local storage will be permanently wiped.</div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-close-modal>Cancel</button>
              <button class="btn btn-danger" id="btn-confirm-reset-now">Yes, Clear All Data</button>
            </div>
          </div>
        </div>
      `;

      this.attachEvents(container, sessions);
    },

    // ----------------------------------------------------
    // Chart Builders
    // ----------------------------------------------------
    buildLineChartSvg: function(sessions, filterRange, fmt) {
      const svgW = 760;
      const svgH = 340;
      const padL = 52;
      const padR = 26;
      const padT = 28;
      const padB = 44;
      const plotW = svgW - padL - padR;
      const plotH = svgH - padT - padB;

      // Y-axis gridlines
      const yTicks = [0, 25, 50, 75, 100];
      let gridSvg = '';
      yTicks.forEach(val => {
        const y = padT + plotH * (1 - val / 100);
        gridSvg += `
          <line x1="${padL}" y1="${y.toFixed(1)}" x2="${svgW - padR}" y2="${y.toFixed(1)}" class="chart-grid-line" />
          <text x="${padL - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="chart-axis-text">${val}%</text>
        `;
      });

      // Target reference line at 80%
      const targetY = padT + plotH * (1 - 0.8);
      gridSvg += `
        <line x1="${padL}" y1="${targetY.toFixed(1)}" x2="${svgW - padR}" y2="${targetY.toFixed(1)}" class="chart-target-line" />
        <text x="${svgW - padR - 4}" y="${(targetY - 5).toFixed(1)}" text-anchor="end" class="chart-axis-text" fill="var(--color-caution)" font-weight="600">80% Target</text>
      `;

      if (!sessions || sessions.length === 0) {
        return `
          <div style="position: relative; width: 100%;">
            <svg class="chart-svg line-chart-svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: auto; min-height: 340px;" role="img" aria-label="Training Trajectory Line Graph (Awaiting Practice Rounds)">
              ${gridSvg}
              <line x1="${padL}" y1="${(padT + plotH).toFixed(1)}" x2="${svgW - padR}" y2="${(padT + plotH).toFixed(1)}" stroke="var(--color-border)" stroke-width="2" />
              <text x="${(padL + plotW / 2).toFixed(1)}" y="${(padT + plotH / 2).toFixed(1)}" text-anchor="middle" class="chart-axis-text" fill="var(--color-text-muted)" font-size="13.5" font-weight="600">
                Awaiting Practice Drills — Complete a round in the Arena or quiz in Learning Hub to plot trajectory
              </text>
            </svg>
            <div style="text-align: center; margin-top: var(--space-xs);">
              <button class="btn btn-primary btn-sm btn-start-arena" type="button">Start Arena Drill</button>
            </div>
          </div>
        `;
      }

      // Sort chronologically (oldest timestamp first to newest timestamp last for real progression)
      const chronological = [...sessions].sort((a, b) => (Number(a.timestamp) || 0) - (Number(b.timestamp) || 0));
      let list = chronological;
      if (filterRange === '5') list = chronological.slice(-5);
      else if (filterRange === '10') list = chronological.slice(-10);

      // Plot data points
      const N = list.length;
      const points = list.map((s, i) => {
        const x = N === 1 ? padL + plotW / 2 : padL + (i / (N - 1)) * plotW;
        const rawAcc = Number(s.accuracy) || 0;
        const clampedAcc = Math.max(0, Math.min(100, rawAcc));
        const y = padT + plotH * (1 - clampedAcc / 100);
        return { x, y, session: s, index: i, acc: clampedAcc };
      });

      // Handle single-session vs multi-session path rendering
      let linePathSvg = '';
      let areaPathSvg = '';
      let xAxisSvg = '';
      let pointLabelsSvg = '';

      if (N === 1) {
        // Single session: Draw a baseline trajectory reference across the plot
        const pt = points[0];
        const dateStr = fmt ? fmt.formatDate(pt.session.timestamp) : '';
        linePathSvg = `
          <line x1="${padL}" y1="${pt.y.toFixed(1)}" x2="${svgW - padR}" y2="${pt.y.toFixed(1)}"
            stroke="var(--color-primary)" stroke-dasharray="4 4" stroke-width="2" opacity="0.6" />
          <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="14" fill="rgba(37, 99, 235, 0.12)" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="3 3" />
        `;
        pointLabelsSvg = `
          <text x="${pt.x.toFixed(1)}" y="${(pt.y - 18).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--color-primary)">
            Initial Drill: ${pt.acc}% Accuracy
          </text>
        `;
        xAxisSvg = `
          <line x1="${pt.x.toFixed(1)}" y1="${padT + plotH}" x2="${pt.x.toFixed(1)}" y2="${padT + plotH + 6}" stroke="var(--color-border)" stroke-width="1.5" />
          <text x="${pt.x.toFixed(1)}" y="${(padT + plotH + 22).toFixed(1)}" text-anchor="middle" class="chart-axis-text" font-weight="600">
            Session 1 ${dateStr ? `(${dateStr})` : ''}
          </text>
        `;
      } else {
        // Multi-session line and area paths
        let linePath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
        for (let i = 1; i < points.length; i++) {
          linePath += ` L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
        }

        const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

        linePathSvg = `<path d="${linePath}" class="chart-line-path" />`;
        areaPathSvg = `<path d="${areaPath}" class="chart-area-path" />`;

        // Direct point labels if N <= 10
        if (N <= 10) {
          points.forEach(pt => {
            const labelY = pt.y < 45 ? pt.y + 18 : pt.y - 10;
            pointLabelsSvg += `
              <text x="${pt.x.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--color-primary)">
                ${pt.acc}%
              </text>
            `;
          });
        }

        // X-axis timeline markers
        if (N <= 8) {
          points.forEach((pt, i) => {
            xAxisSvg += `
              <line x1="${pt.x.toFixed(1)}" y1="${padT + plotH}" x2="${pt.x.toFixed(1)}" y2="${padT + plotH + 5}" stroke="var(--color-border)" stroke-width="1.5" />
              <text x="${pt.x.toFixed(1)}" y="${(padT + plotH + 20).toFixed(1)}" text-anchor="middle" class="chart-axis-text" font-weight="600">S${i + 1}</text>
            `;
          });
        } else {
          xAxisSvg = `
            <text x="${padL}" y="${(padT + plotH + 20).toFixed(1)}" text-anchor="start" class="chart-axis-text">S1 (Oldest)</text>
            <text x="${(padL + plotW / 2).toFixed(1)}" y="${(padT + plotH + 20).toFixed(1)}" text-anchor="middle" class="chart-axis-text">Trajectory Midpoint</text>
            <text x="${svgW - padR}" y="${(padT + plotH + 20).toFixed(1)}" text-anchor="end" class="chart-axis-text">S${N} (Latest)</text>
          `;
        }
      }

      // Dots with explicit presentation attributes for universal browser support
      let dotsSvg = '';
      points.forEach((pt, i) => {
        const s = pt.session;
        const catName = CATEGORIES[s.category]?.name || (s.category === 'all' ? 'All Categories' : s.category);
        const dateStr = fmt ? fmt.formatDate(s.timestamp) : (s.timestamp ? new Date(s.timestamp).toLocaleDateString() : 'N/A');
        dotsSvg += `
          <circle class="chart-dot"
            cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}"
            r="5.5"
            tabindex="0"
            role="button"
            aria-label="Session ${i + 1}: ${pt.acc}% on ${catName}"
            data-date="${dateStr}"
            data-cat="${catName}"
            data-diff="${s.difficulty || 'normal'}"
            data-score="${s.correctCount || 0}/${s.totalQuestions || 0}"
            data-acc="${pt.acc}%"
            data-session-num="${i + 1}">
          </circle>
        `;
      });

      return `
        <svg class="chart-svg line-chart-svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: auto; min-height: 340px;" role="img" aria-label="Training Trajectory Line Graph: ${list.length} sessions plotted">
          <defs>
            <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2563EB" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#2563EB" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          ${gridSvg}
          ${areaPathSvg}
          ${linePathSvg}
          ${pointLabelsSvg}
          ${dotsSvg}
          ${xAxisSvg}
        </svg>
        <div class="chart-tooltip-box" id="line-chart-tooltip"></div>
      `;
    },

    buildDonutSvg: function(categoryStats, totalAllVectors) {
      const size = 260;
      const radius = 92;
      const circ = 2 * Math.PI * radius; // ~578.05

      if (!totalAllVectors || totalAllVectors === 0) {
        return {
          svg: `
            <svg class="chart-svg donut-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="width: ${size}px; height: ${size}px; max-width: ${size}px; max-height: ${size}px;" role="img" aria-label="Threat Vector Exposure: 0 attacks">
              <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="var(--color-border)" stroke-width="26" />
            </svg>
            <div class="donut-center-info">
              <span class="donut-center-val">0</span>
              <span class="donut-center-lbl">Threats</span>
            </div>
          `,
          legend: `<div style="font-size: var(--font-size-xs); color: var(--color-text-muted); padding: var(--space-md);">Play a practice round to map exposure across threat vectors.</div>`
        };
      }

      let accumulatedOffset = 0;
      let segmentsSvg = '';
      let legendHtml = '';

      Object.entries(CATEGORIES).forEach(([key, info]) => {
        const count = categoryStats[key]?.total || 0;
        if (count > 0) {
          const share = count / totalAllVectors;
          const pct = Math.round(share * 100);
          const segmentLen = circ * share;
          const strokeDash = `${segmentLen.toFixed(1)} ${(circ - segmentLen).toFixed(1)}`;
          const strokeOffset = (-accumulatedOffset).toFixed(1);

          segmentsSvg += `
            <circle class="donut-segment"
              cx="${size/2}" cy="${size/2}" r="${radius}"
              stroke="${info.color}"
              stroke-dasharray="${strokeDash}"
              stroke-dashoffset="${strokeOffset}"
              data-cat="${key}"
              role="button"
              tabindex="0"
              aria-label="${info.name}: ${pct}% (${count} questions). Click to filter log.">
            </circle>
          `;

          legendHtml += `
            <div class="donut-legend-item" data-cat="${key}" role="button" tabindex="0" title="Click to filter session logs to ${info.name}">
              <span class="donut-legend-dot" style="background-color: ${info.color};"></span>
              <span class="donut-legend-label">${info.name}</span>
              <span class="donut-legend-pct">${pct}% (${count})</span>
            </div>
          `;

          accumulatedOffset += segmentLen;
        }
      });

      const svgHtml = `
        <svg class="chart-svg donut-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="width: ${size}px; height: ${size}px; max-width: ${size}px; max-height: ${size}px;" role="img" aria-label="Threat Vector Exposure Donut Chart: ${totalAllVectors} total attacks">
          <g transform="rotate(-90 ${size/2} ${size/2})">
            <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="var(--color-border-subtle)" stroke-width="26" />
            ${segmentsSvg}
          </g>
        </svg>
        <div class="donut-center-info">
          <span class="donut-center-val">${totalAllVectors}</span>
          <span class="donut-center-lbl">Attacks</span>
        </div>
      `;

      return { svg: svgHtml, legend: legendHtml };
    },

    buildRadarChartSvg: function(categoryStats, getIcon) {
      const keys = ['url_phishing', 'otp_credentials', 'fake_offers', 'impersonation', 'social_pressure', 'technical_scams'];
      const cx = 260;
      const cy = 190;
      const maxR = 135;
      const N = keys.length;

      // Calculate angles for 6 vertices (starting at -pi/2, 12 o'clock)
      const angles = keys.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI / N));

      // 5 concentric rings (20%, 40%, 60%, 80%, 100%)
      const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
      let ringsSvg = '';
      rings.forEach(r => {
        const pts = angles.map(a => {
          const x = cx + maxR * r * Math.cos(a);
          const y = cy + maxR * r * Math.sin(a);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        ringsSvg += `<polygon class="radar-grid-ring" points="${pts}" />`;
      });

      // Axis lines from center to outer ring
      let axisSvg = '';
      angles.forEach((a) => {
        const x = cx + maxR * Math.cos(a);
        const y = cy + maxR * Math.sin(a);
        axisSvg += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="radar-axis-line" />`;
      });

      // Count practiced categories
      const practicedKeys = keys.filter(k => (categoryStats[k]?.total || 0) > 0);
      const practicedCount = practicedKeys.length;

      // Category labels around the radar
      let labelsSvg = '';
      keys.forEach((key, i) => {
        const a = angles[i];
        const dist = maxR + 32;
        let lx = cx + dist * Math.cos(a);
        let ly = cy + dist * Math.sin(a);

        let anchor = 'middle';
        if (Math.cos(a) > 0.3) anchor = 'start';
        else if (Math.cos(a) < -0.3) anchor = 'end';

        if (Math.sin(a) < -0.7) ly -= 8;
        if (Math.sin(a) > 0.7) ly += 14;

        const stat = categoryStats[key] || { correct: 0, total: 0 };
        const hasData = stat.total > 0;
        const pct = hasData ? Math.round((stat.correct / stat.total) * 100) : 0;
        const info = CATEGORIES[key] || { name: key };
        const shortName = info.name.split('&')[0].trim();

        const statText = hasData ? `${pct}% Defended` : 'Unranked';
        const statColor = hasData ? (pct >= 80 ? 'var(--color-success)' : 'var(--color-primary)') : 'var(--color-text-muted)';

        labelsSvg += `
          <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" class="radar-axis-label">
            ${shortName}
          </text>
          <text x="${lx.toFixed(1)}" y="${(ly + 13).toFixed(1)}" text-anchor="${anchor}" class="radar-axis-stat" fill="${statColor}" font-size="10.5" font-weight="600">
            ${statText}
          </text>
        `;
      });

      // 80% Benchmark Target Polygon
      const targetPts = angles.map(a => {
        const x = cx + maxR * 0.8 * Math.cos(a);
        const y = cy + maxR * 0.8 * Math.sin(a);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      const targetPolySvg = `<polygon class="radar-target-poly" points="${targetPts}" />`;

      let userPolySvg = '';
      let dotsSvg = '';
      let centerOverlaySvg = '';

      if (practicedCount === 0) {
        // Clean empty state overlay: awaiting drills
        centerOverlaySvg = `
          <g class="radar-empty-state">
            <rect x="${cx - 150}" y="${cy - 36}" width="300" height="72" rx="10" fill="var(--color-bg-card)" stroke="var(--color-border)" stroke-width="1.5" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.06))" />
            <text x="${cx}" y="${cy - 10}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--color-text-primary)">
              Awaiting Practice Drills
            </text>
            <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="11" fill="var(--color-text-secondary)">
              Complete rounds to build your 6-axis defense perimeter
            </text>
            <text x="${cx}" y="${cy + 26}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--color-primary)">
              0 of 6 threat vectors evaluated
            </text>
          </g>
        `;
      } else {
        // User Score Polygon
        let userPointsArray = [];
        const userPts = keys.map((key, i) => {
          const a = angles[i];
          const stat = categoryStats[key] || { correct: 0, total: 0 };
          const hasData = stat.total > 0;
          const pct = hasData ? (stat.correct / stat.total) * 100 : 0;
          const f = hasData ? Math.max(pct / 100, 0.15) : 0.15;
          const x = cx + maxR * f * Math.cos(a);
          const y = cy + maxR * f * Math.sin(a);
          userPointsArray.push({ x, y, pct: Math.round(pct), key, hasData, stat });
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');

        userPolySvg = `<polygon class="radar-user-poly" points="${userPts}" />`;

        // Vertices circles
        userPointsArray.forEach(pt => {
          const info = CATEGORIES[pt.key] || { name: pt.key };
          const text = pt.hasData 
            ? `${info.name}: ${pt.pct}% (${pt.stat.correct}/${pt.stat.total} defended)`
            : `${info.name}: Not yet practiced`;
          if (pt.hasData) {
            dotsSvg += `
              <circle class="radar-user-point"
                cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}"
                r="6"
                tabindex="0"
                role="button"
                aria-label="${text}">
                <title>${text}</title>
              </circle>
            `;
          } else {
            dotsSvg += `
              <circle class="radar-unranked-point"
                cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}"
                r="4"
                stroke="var(--color-border)"
                stroke-width="1.5"
                stroke-dasharray="2 2"
                fill="var(--color-bg-card)"
                tabindex="0"
                role="button"
                aria-label="${text}">
                <title>${text}</title>
              </circle>
            `;
          }
        });
      }

      return `
        <svg class="chart-svg radar-chart-svg" width="520" height="380" viewBox="0 0 520 380" style="width: 100%; max-width: 520px; height: auto; min-height: 360px;" role="img" aria-label="Defense Perimeter Radar Chart comparing 6 security axes against 80% target">
          ${ringsSvg}
          ${axisSvg}
          ${targetPolySvg}
          ${userPolySvg}
          ${dotsSvg}
          ${labelsSvg}
          ${centerOverlaySvg}
        </svg>
        <div class="dual-bar-legend" style="justify-content: center; margin-top: var(--space-xs);">
          <span class="dual-legend-pill">
            <span class="dual-legend-dot" style="background: var(--color-primary);"></span>
            <span>Your Defense Perimeter ${practicedCount > 0 ? `(${practicedCount}/6 Vectors)` : '(Unranked)'}</span>
          </span>
          <span class="dual-legend-pill">
            <span class="dual-legend-dot" style="background: var(--color-caution); border-radius: 0; transform: rotate(45deg);"></span>
            <span>80% Security Benchmark</span>
          </span>
        </div>
      `;
    },

    buildDualBarChartHtml: function(categoryStats, getIcon) {
      const maxAttacks = Math.max(...Object.values(categoryStats).map(c => c.total || 0), 1);

      const items = Object.entries(CATEGORIES).map(([catKey, info]) => {
        const data = categoryStats[catKey] || { correct: 0, total: 0 };
        const hasData = data.total > 0;
        const encWidth = hasData ? Math.max(Math.round((data.total / maxAttacks) * 100), 8) : 0;
        const defRate = hasData ? Math.round((data.correct / data.total) * 100) : 0;
        const defWidth = hasData ? Math.max(defRate, 4) : 0;

        let defBadgeColor = 'var(--color-text-muted)';
        if (hasData) {
          if (defRate >= 80) defBadgeColor = 'var(--color-success)';
          else if (defRate >= 50) defBadgeColor = 'var(--color-primary)';
          else defBadgeColor = 'var(--color-danger)';
        }

        return `
          <div class="dual-bar-item">
            <div class="dual-bar-header">
              <span class="dual-bar-title">
                ${getIcon(info.icon, 'icon-inline')}
                <span>${info.name}</span>
              </span>
              <div class="dual-bar-stats">
                <span><strong>${data.total}</strong> Faced</span>
                <span>•</span>
                <span style="color: ${defBadgeColor}; font-weight: 600;">
                  ${hasData ? `${data.correct} Defended (${defRate}%)` : 'Unranked'}
                </span>
              </div>
            </div>
            <div class="dual-bar-track-group">
              <div class="dual-bar-subtrack" title="Attacks Encountered: ${data.total} (${encWidth}% relative volume)">
                <span class="dual-bar-tag">Faced</span>
                <div class="dual-bar-rail">
                  <div class="dual-bar-fill-attack" style="width: ${encWidth}%;"></div>
                </div>
              </div>
              <div class="dual-bar-subtrack" title="Defended: ${data.correct}/${data.total} (${defRate}%)">
                <span class="dual-bar-tag" style="color: var(--color-success);">Defended</span>
                <div class="dual-bar-rail">
                  <div class="dual-bar-fill-defend" style="width: ${defWidth}%;"></div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="dual-bar-container">
          ${items}
          <div class="dual-bar-legend">
            <span class="dual-legend-pill">
              <span class="dual-legend-dot" style="background: linear-gradient(90deg, #2563EB, #7657F6);"></span>
              <span>Attacks Faced (Volume)</span>
            </span>
            <span class="dual-legend-pill">
              <span class="dual-legend-dot" style="background: linear-gradient(90deg, #059669, #10B981);"></span>
              <span>Attacks Defended (Rate %)</span>
            </span>
          </div>
        </div>
      `;
    },

    buildBarChartHtml: function(categoryStats, getIcon) {
      const items = Object.entries(CATEGORIES).map(([catKey, info]) => {
        const data = categoryStats[catKey] || { correct: 0, total: 0 };
        const hasData = data.total > 0;
        const pct = hasData ? Math.round((data.correct / data.total) * 100) : 0;

        let levelClass = 'unranked';
        let badgeColor = 'var(--color-text-muted)';
        let badgeText = '—';
        let ratioText = '0/0 (Not Practiced)';

        if (hasData) {
          ratioText = `${data.correct}/${data.total} Scenarios`;
          badgeText = `${pct}%`;
          if (pct >= 75) {
            levelClass = 'high';
            badgeColor = 'var(--color-success)';
          } else if (pct >= 50) {
            levelClass = 'medium';
            badgeColor = 'var(--color-primary)';
          } else {
            levelClass = 'low';
            badgeColor = 'var(--color-danger)';
          }
        }

        return `
          <div class="bar-row">
            <div class="bar-row-header">
              <span class="bar-row-title">
                ${getIcon(info.icon, 'icon-inline')}
                <span>${info.name}</span>
              </span>
              <div class="bar-row-stats">
                <span style="color: var(--color-text-muted); font-size: 0.75rem;">${ratioText}</span>
                <span class="bar-pct-badge" style="color: ${badgeColor};">${badgeText}</span>
              </div>
            </div>
            <div class="bar-track" title="${info.name}: ${hasData ? `${pct}% mastery` : 'Not yet attempted'}">
              <div class="bar-fill ${levelClass}" style="width: ${hasData ? pct : 0}%;"></div>
            </div>
          </div>
        `;
      }).join('');

      return `<div class="bar-chart-list">${items}</div>`;
    },

    buildTacticalMatrixHtml: function(strongest, weakest, derived, getIcon) {
      // Countermeasure registry
      const countermeasures = {
        'url_phishing': 'Scrutinize top-level domains, subdomains, and punycode lookalikes before clicking. Never rely on the padlock icon alone.',
        'otp_credentials': 'Legitimate organizations and banks NEVER ask for one-time passwords (OTP) or credentials over call, SMS, or chat.',
        'fake_offers': 'Unsolicited lotteries, crypto airdrops, and voucher prizes requiring upfront fees or signups are consistently fraudulent.',
        'impersonation': 'Verify sender email headers and organizational channels before acting on urgent requests from purported executives or officials.',
        'social_pressure': 'Artificial deadlines ("Account suspended in 10 minutes!") are designed to short-circuit logic. Always step back and verify independently.',
        'technical_scams': 'Fake browser alert popups, scary virus warnings, and remote access requests (AnyDesk) should be closed immediately.'
      };

      const hasAnswered = (derived.totalAnswered || 0) > 0;

      return `
        <div class="vulnerability-grid">
          <!-- Strength Vector -->
          <div class="vulnerability-item ${hasAnswered && strongest ? 'strength' : 'neutral'}">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: var(--font-weight-semibold); color: ${hasAnswered && strongest ? 'var(--color-success)' : 'var(--color-text-secondary)'};">
              ${getIcon('shield-check', 'icon-inline')}
              <span>Primary Defensive Shield</span>
            </div>
            <div style="font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-primary);">
              ${hasAnswered ? (strongest ? strongest.name : 'All Categories Mastered') : 'Awaiting Training Drill'}
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.45;">
              ${hasAnswered 
                ? (strongest 
                    ? `Demonstrated ${strongest.pct}% threat mitigation accuracy. Your instincts in spotting deceitful clues in this attack vector are exceptionally robust.` 
                    : 'Flawless 100% defense rate recorded across all practiced vectors.') 
                : 'Complete training rounds in the Arena to establish your primary defensive strengths.'}
            </div>
          </div>

          <!-- Vulnerability Vector -->
          <div class="vulnerability-item ${hasAnswered && weakest ? 'warning' : 'neutral'}">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: var(--font-weight-semibold); color: ${hasAnswered && weakest ? 'var(--color-caution)' : 'var(--color-text-secondary)'};">
              ${getIcon('alert-triangle', 'icon-inline')}
              <span>High-Priority Vulnerability Focus</span>
            </div>
            <div style="font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-primary);">
              ${hasAnswered ? (weakest ? weakest.name : 'Zero Vulnerabilities Detected') : 'Awaiting Training Drill'}
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.45;">
              ${hasAnswered 
                ? (weakest 
                    ? (countermeasures[weakest.key] || 'Focus on slow, deliberate verification of evidence before taking action.') 
                    : 'Maintain active drills across all vectors to preserve a resilient defensive posture.') 
                : 'Complete practice rounds across various categories to detect and neutralize potential cognitive blindspots.'}
            </div>
          </div>
        </div>

        <div style="margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm);">
          <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
            Recommended next step: <strong>${hasAnswered ? (weakest ? `Drill ${weakest.name} in Arena` : 'Explore Cyber Safety Hub guides') : 'Start your first training drill'}</strong>
          </span>
          <button class="btn btn-quiet btn-sm" id="btn-matrix-action">
            <span>${hasAnswered ? (weakest ? 'Train This Vector' : 'Read Safety Hub') : 'Launch Arena Drill'}</span>
            ${getIcon('arrow-right', 'icon-inline')}
          </button>
        </div>
      `;
    },

    getFilteredSessions: function(sessions, catFilter, diffFilter, searchQuery) {
      let filtered = sessions || [];

      // Category filter
      if (catFilter && catFilter !== 'all') {
        filtered = filtered.filter(s => s.category === catFilter);
      }

      // Difficulty filter
      if (diffFilter && diffFilter !== 'all') {
        filtered = filtered.filter(s => s.difficulty === diffFilter);
      }

      // Search query filter
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(s => {
          const catName = (CATEGORIES[s.category]?.name || s.category || '').toLowerCase();
          const diff = (s.difficulty || '').toLowerCase();
          return catName.includes(query) || diff.includes(query);
        });
      }

      return filtered;
    },

    renderSessionTableHtml: function(sessions, catFilter, diffFilter, searchQuery, fmt, getIcon) {
      const filtered = this.getFilteredSessions(sessions, catFilter, diffFilter, searchQuery);

      if (filtered.length === 0) {
        return `
          <div class="empty-state" style="padding: var(--space-2xl) var(--space-md);">
            <div class="empty-icon-box">${getIcon('search')}</div>
            <div class="empty-title">No training sessions found</div>
            <div class="empty-desc">
              ${sessions.length === 0 
                ? 'Your completed rounds in Awareness Arena will appear here with scores, dates, and accuracy.' 
                : 'No session logs match your active category, difficulty, or search filters.'}
            </div>
            ${sessions.length === 0 ? `
              <button class="btn btn-primary btn-sm btn-start-arena" type="button">Start Practice Round</button>
            ` : ''}
          </div>
        `;
      }

      return `
        <div class="data-table-container">
          <table class="data-table" aria-label="Training Session Log Table">
            <thead>
              <tr>
                <th scope="col">Date & Time</th>
                <th scope="col">Threat Category</th>
                <th scope="col">Difficulty</th>
                <th scope="col">Score</th>
                <th scope="col">Accuracy</th>
                <th scope="col">Skipped</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(s => {
                const catName = CATEGORIES[s.category]?.name || (s.category === 'all' ? 'All Categories' : s.category);
                return `
                  <tr>
                    <td>${fmt ? fmt.formatDate(s.timestamp) : (s.timestamp ? new Date(s.timestamp).toLocaleString() : 'N/A')}</td>
                    <td style="font-weight: var(--font-weight-medium);">${catName}</td>
                    <td>
                      <span class="badge badge-neutral" style="text-transform: capitalize;">${s.difficulty}</span>
                    </td>
                    <td style="font-weight: var(--font-weight-semibold);">${s.correctCount || 0} / ${s.totalQuestions || 0}</td>
                    <td>
                      <span class="badge ${(s.accuracy ?? 0) >= 70 ? 'badge-success' : 'badge-caution'}">
                        ${s.accuracy ?? 0}%
                      </span>
                    </td>
                    <td>${s.skippedCount || 0}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    },

    // ----------------------------------------------------
    // Event Handlers & Interactivity
    // ----------------------------------------------------
    attachEvents: function(container, sessions) {
      const state = global.CyberShield.State;
      const fmt = global.CyberShield.Formatting;

      // Reset Modal handlers
      const resetModal = container.querySelector('#reset-confirm-modal');
      const openResetBtn = container.querySelector('#btn-open-reset-modal');
      const confirmResetBtn = container.querySelector('#btn-confirm-reset-now');
      const closeBtns = container.querySelectorAll('[data-close-modal]');

      if (openResetBtn && resetModal) {
        openResetBtn.addEventListener('click', () => {
          resetModal.classList.add('open');
          global.CyberShield.Accessibility.trapFocus(resetModal);
        });
      }

      closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          resetModal.classList.remove('open');
          global.CyberShield.Accessibility.releaseFocus(resetModal);
        });
      });

      if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', () => {
          isDemoActive = false;
          filterCategory = 'all';
          filterDifficulty = 'all';
          filterSearchQuery = '';
          state.resetAllData();
          resetModal.classList.remove('open');
          global.CyberShield.Accessibility.releaseFocus(resetModal);
          this.render(container);
          global.CyberShield.Accessibility.announce('All training progress and achievements cleared.');
        });
      }

      // Certificate button
      const certBtn = container.querySelector('#btn-progress-cert');
      if (certBtn) {
        certBtn.addEventListener('click', () => {
          if (global.CyberShield.Certificate) {
            const derived = isDemoActive 
              ? this.computeStatsFromSessions(sessions, state.getData().lessonProgress)
              : state.getDerivedStats();
            global.CyberShield.Certificate.openModal({ accuracy: derived.overallAccuracyPct || 0 });
          }
        });
      }

      // Demo dataset toggle
      const demoToggleBtn = container.querySelector('#btn-toggle-demo-mode');
      if (demoToggleBtn) {
        demoToggleBtn.addEventListener('click', () => {
          isDemoActive = !isDemoActive;
          this.render(container);
          global.CyberShield.Accessibility.announce(isDemoActive ? 'Exhibition demonstration mode active.' : 'Switched to live user records.');
        });
      }

      // Matrix action button
      const matrixBtn = container.querySelector('#btn-matrix-action');
      if (matrixBtn) {
        matrixBtn.addEventListener('click', () => {
          const derived = isDemoActive ? this.computeStatsFromSessions(sessions, state.getData().lessonProgress) : state.getDerivedStats();
          const analysis = this.analyzeCategoryStrengths(derived.categoryStats);
          if (analysis.weakest || (derived.totalAnswered || 0) === 0) {
            global.CyberShield.Router.navigate('arena');
          } else {
            global.CyberShield.Router.navigate('lessons');
          }
        });
      }

      // Line Chart Range Filter Pills
      const rangePills = container.querySelectorAll('#line-chart-filter-group .chart-filter-btn');
      const chartWrapper = container.querySelector('#line-chart-wrapper');
      rangePills.forEach(pill => {
        pill.addEventListener('click', () => {
          rangePills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeRangeFilter = pill.getAttribute('data-range');
          if (chartWrapper) {
            chartWrapper.innerHTML = this.buildLineChartSvg(sessions, activeRangeFilter, fmt);
            this.bindChartTooltips(chartWrapper);
          }
        });
      });

      // Bind Line Chart Dot Tooltips
      if (chartWrapper) {
        this.bindChartTooltips(chartWrapper);
      }

      // Table Category, Difficulty, Search Filters
      const catSelect = container.querySelector('#table-filter-category');
      const diffSelect = container.querySelector('#table-filter-difficulty');
      const searchInput = container.querySelector('#table-search-input');
      const tableContainer = container.querySelector('#session-table-container');

      const refreshTable = () => {
        if (tableContainer) {
          tableContainer.innerHTML = this.renderSessionTableHtml(
            sessions,
            filterCategory,
            filterDifficulty,
            filterSearchQuery,
            fmt,
            global.CyberShield.getIcon
          );
        }
      };

      if (catSelect) {
        catSelect.addEventListener('change', (e) => {
          filterCategory = e.target.value;
          refreshTable();
        });
      }

      if (diffSelect) {
        diffSelect.addEventListener('change', (e) => {
          filterDifficulty = e.target.value;
          refreshTable();
        });
      }

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          filterSearchQuery = e.target.value;
          refreshTable();
        });
      }

      // CSV Export Button (Exports currently filtered sessions)
      const exportBtn = container.querySelector('#btn-export-csv');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const sessionsToExport = this.getFilteredSessions(sessions, filterCategory, filterDifficulty, filterSearchQuery);
          this.exportSessionsToCsv(sessionsToExport);
        });
      }

      // Interactive Donut Chart Segment & Legend Linkage
      const donutSegments = container.querySelectorAll('.donut-segment');
      const legendItems = container.querySelectorAll('.donut-legend-item');

      donutSegments.forEach(seg => {
        const catKey = seg.getAttribute('data-cat');
        seg.addEventListener('mouseenter', () => {
          legendItems.forEach(item => {
            if (item.getAttribute('data-cat') === catKey) item.classList.add('active');
            else item.classList.remove('active');
          });
        });
        seg.addEventListener('mouseleave', () => {
          legendItems.forEach(item => item.classList.remove('active'));
        });
        seg.addEventListener('click', () => {
          this.drillDownCategory(catKey, catSelect, refreshTable, tableContainer);
        });
      });

      legendItems.forEach(item => {
        const catKey = item.getAttribute('data-cat');
        item.addEventListener('mouseenter', () => {
          donutSegments.forEach(seg => {
            if (seg.getAttribute('data-cat') === catKey) {
              seg.style.strokeWidth = '28';
              seg.style.opacity = '1';
            } else {
              seg.style.opacity = '0.35';
            }
          });
        });
        item.addEventListener('mouseleave', () => {
          donutSegments.forEach(seg => {
            seg.style.strokeWidth = '';
            seg.style.opacity = '';
          });
        });
        item.addEventListener('click', () => {
          this.drillDownCategory(catKey, catSelect, refreshTable, tableContainer);
        });
      });

      // Delegated click handling on container for dynamic buttons
      if (container && typeof container.addEventListener === 'function') {
        container.addEventListener('click', (e) => {
          // Trigger Demo Mode CTA
          if (e.target.closest && e.target.closest('.btn-trigger-demo')) {
            isDemoActive = true;
            this.render(container);
            global.CyberShield.Accessibility.announce('Exhibition demonstration mode active.');
            return;
          }

          // Start Arena drill CTA from empty tables
          if (e.target.closest && e.target.closest('.btn-start-arena')) {
            global.CyberShield.Router.navigate('arena');
            return;
          }
        });
      }
    },

    drillDownCategory: function(catKey, catSelect, refreshTable, tableContainer) {
      if (!catKey) return;
      filterCategory = catKey;
      if (catSelect) catSelect.value = catKey;
      refreshTable();
      if (tableContainer) {
        tableContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      global.CyberShield.Accessibility.announce(`Filtered training session log to ${CATEGORIES[catKey]?.name || catKey}`);
    },

    bindChartTooltips: function(wrapper) {
      if (!wrapper || typeof wrapper.querySelectorAll !== 'function') return;
      const dots = wrapper.querySelectorAll('.chart-dot');
      const tooltip = wrapper.querySelector('#line-chart-tooltip');
      if (!dots.length || !tooltip) return;

      dots.forEach(dot => {
        const showTooltip = () => {
          const date = dot.getAttribute('data-date');
          const cat = dot.getAttribute('data-cat');
          const diff = dot.getAttribute('data-diff');
          const score = dot.getAttribute('data-score');
          const acc = dot.getAttribute('data-acc');

          tooltip.innerHTML = `
            <div style="font-weight: 700; color: #FFFFFF; margin-bottom: 2px;">${acc} Accuracy (${score})</div>
            <div style="color: #D1D5DB; font-size: 0.7rem;">${cat} • <span style="text-transform: capitalize;">${diff}</span></div>
            <div style="color: #9CA3AF; font-size: 0.65rem; margin-top: 2px;">${date}</div>
          `;

          const dotRect = dot.getBoundingClientRect();
          const wrapRect = wrapper.getBoundingClientRect();
          let left = dotRect.left - wrapRect.left + (dotRect.width / 2);
          let top = dotRect.top - wrapRect.top;

          // Clamp left positioning within container bounds to prevent overflow
          left = Math.max(85, Math.min(wrapRect.width - 85, left));

          // If too close to top edge, flip below the point
          if (top < 45) {
            tooltip.classList.add('flip-below');
            top = top + 15;
          } else {
            tooltip.classList.remove('flip-below');
          }

          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${top}px`;
          tooltip.classList.add('visible');
        };

        const hideTooltip = () => {
          tooltip.classList.remove('visible');
        };

        dot.addEventListener('mouseenter', showTooltip);
        dot.addEventListener('focus', showTooltip);
        dot.addEventListener('mouseleave', hideTooltip);
        dot.addEventListener('blur', hideTooltip);
      });
    },

    // ----------------------------------------------------
    // CSV Export Logic with Windows Excel UTF-8 BOM
    // ----------------------------------------------------
    exportSessionsToCsv: function(sessionsToExport) {
      if (!sessionsToExport || sessionsToExport.length === 0) {
        global.CyberShield.Accessibility.announce('No training sessions available in the current filter to export.');
        return;
      }

      const headers = ['Session ID', 'Date & Time', 'Category', 'Difficulty', 'Score', 'Total Questions', 'Accuracy (%)', 'Skipped'];
      const rows = sessionsToExport.map(s => {
        const cat = CATEGORIES[s.category]?.name || (s.category === 'all' ? 'All Categories' : (s.category || 'N/A'));
        const dateStr = `"${s.timestamp ? new Date(s.timestamp).toLocaleString().replace(/"/g, '""') : 'N/A'}"`;
        return [
          s.id,
          dateStr,
          `"${cat}"`,
          s.difficulty || 'standard',
          s.correctCount || 0,
          s.totalQuestions || 0,
          s.accuracy ?? 0,
          s.skippedCount || 0
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\r\n');
      // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel on Windows parses UTF-8 encoding cleanly
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CyberShield_Defense_Log_${new Date().toISOString().slice(0, 10)}.csv`;
      if (document && document.body && typeof document.body.appendChild === 'function') {
        document.body.appendChild(link);
        if (typeof link.click === 'function') link.click();
        if (typeof document.body.removeChild === 'function') document.body.removeChild(link);
      }
      if (URL && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(url);
      }

      global.CyberShield.Accessibility.announce(`Exported ${sessionsToExport.length} training session logs as CSV.`);
    },

    // ----------------------------------------------------
    // Metrics & Readiness Computation Helpers
    // ----------------------------------------------------
    computeReadinessScore: function(derived) {
      if (!derived) return 0;
      const acc = derived.overallAccuracyPct !== null ? derived.overallAccuracyPct : 0;
      const rounds = derived.totalRounds || 0;
      const lessons = derived.completedLessonsCount || 0;

      if ((derived.totalAnswered || 0) === 0 && lessons === 0) return 0;

      let score = 0;
      if ((derived.totalAnswered || 0) > 0) {
        // 70% weighted accuracy + 15% practice volume + 15% lesson mastery
        const accuracyWeight = acc * 0.70;
        const volumeWeight = Math.min(100, rounds * 10) * 0.15;
        const lessonWeight = Math.min(100, Math.round((lessons / 7) * 100)) * 0.15;
        score = Math.round(accuracyWeight + volumeWeight + lessonWeight);
      } else {
        // User has only completed lessons so far: reward foundation knowledge
        score = Math.min(100, Math.round((lessons / 7) * 40));
      }

      return Math.max(0, Math.min(100, score));
    },

    getReadinessTier: function(score) {
      if (score >= 88) {
        return {
          title: 'Cyber Sentinel',
          color: '#059669',
          badgeClass: 'badge-success',
          icon: 'shield-check'
        };
      }
      if (score >= 70) {
        return {
          title: 'Shield Guardian',
          color: '#2563EB',
          badgeClass: 'badge-primary',
          icon: 'shield'
        };
      }
      if (score >= 50) {
        return {
          title: 'Awareness Operative',
          color: '#D97706',
          badgeClass: 'badge-caution',
          icon: 'alert-triangle'
        };
      }
      return {
        title: 'Recon Cadet',
        color: '#7657F6',
        badgeClass: 'badge-neutral',
        icon: 'user'
      };
    },

    analyzeCategoryStrengths: function(categoryStats) {
      const entries = Object.entries(categoryStats || {}).filter(([_, data]) => (data.total || 0) > 0);
      if (entries.length === 0) {
        return { strongest: null, weakest: null };
      }

      let strongest = null;
      let weakest = null;

      entries.forEach(([key, data]) => {
        const pct = Math.round((data.correct / data.total) * 100);
        const item = {
          key: key,
          name: CATEGORIES[key]?.name || key,
          pct: pct,
          correct: data.correct,
          incorrect: data.total - data.correct,
          total: data.total
        };

        if (!strongest || item.pct > strongest.pct || (item.pct === strongest.pct && item.total > strongest.total)) {
          strongest = item;
        }

        if (!weakest || item.pct < weakest.pct || (item.pct === weakest.pct && item.incorrect > weakest.incorrect)) {
          weakest = item;
        }
      });

      // If all practiced categories are 100%, weakest is not a vulnerability
      if (weakest && weakest.pct === 100 && weakest.total > 0) {
        weakest = null;
      }

      return { strongest, weakest };
    },

    computeStatsFromSessions: function(sessions, lessonProgress) {
      let totalCorrect = 0;
      let totalIncorrect = 0;
      let totalSkipped = 0;
      const categoryStats = {};

      for (const s of sessions) {
        totalCorrect += (Number(s.correctCount) || 0);
        totalIncorrect += (Number(s.incorrectCount) || 0);
        totalSkipped += (Number(s.skippedCount) || 0);

        if (s.categoryBreakdown && typeof s.categoryBreakdown === 'object') {
          for (const [cat, data] of Object.entries(s.categoryBreakdown)) {
            if (!categoryStats[cat]) {
              categoryStats[cat] = { correct: 0, total: 0 };
            }
            categoryStats[cat].correct += (Number(data.correct) || 0);
            categoryStats[cat].total += (Number(data.total) || 0);
          }
        } else if (s.category && s.category !== 'all') {
          // Fallback attribution for sessions without breakdown
          if (!categoryStats[s.category]) {
            categoryStats[s.category] = { correct: 0, total: 0 };
          }
          categoryStats[s.category].correct += (Number(s.correctCount) || 0);
          categoryStats[s.category].total += (Number(s.correctCount) || 0) + (Number(s.incorrectCount) || 0);
        }
      }

      const totalAnswered = totalCorrect + totalIncorrect;
      const overallAccuracyPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;
      const completedLessonsCount = Object.keys(lessonProgress || {}).length || 3;

      return {
        totalRounds: sessions.length,
        totalAnswered,
        totalCorrect,
        totalIncorrect,
        totalSkipped,
        overallAccuracyPct,
        categoryStats,
        completedLessonsCount
      };
    }
  };

  global.CyberShield.ProgressModule = ProgressModule;
})(window);
