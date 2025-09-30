/**
 * Visitor Statistics Tracker
 * Frontend-only implementation using localStorage
 * No backend required
 */

class VisitorStats {
    constructor() {
        this.storageKey = 'islamicWillVisitorStats';
        this.sessionKey = 'islamicWillSession';
        this.init();
    }

    init() {
        this.trackVisit();
        this.trackPageView();
        this.setupPageTracking();
        this.displayStats();
    }

    // Get current stats from localStorage
    getStats() {
        const stats = localStorage.getItem(this.storageKey);
        return stats ? JSON.parse(stats) : this.getDefaultStats();
    }

    // Default stats structure
    getDefaultStats() {
        return {
            totalVisits: 0,
            uniqueVisitors: 0,
            pageViews: 0,
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            pages: {
                home: 0,
                'create-will': 0,
                'inheritance-calculator': 0,
                'inheritance-schedule': 0,
                'user-manual': 0
            },
            dailyStats: {},
            browserInfo: this.getBrowserInfo(),
            deviceInfo: this.getDeviceInfo()
        };
    }

    // Save stats to localStorage
    saveStats(stats) {
        localStorage.setItem(this.storageKey, JSON.stringify(stats));
    }

    // Check if this is a new session
    isNewSession() {
        const sessionData = sessionStorage.getItem(this.sessionKey);
        if (!sessionData) {
            sessionStorage.setItem(this.sessionKey, JSON.stringify({
                startTime: new Date().toISOString(),
                pageViews: 0
            }));
            return true;
        }
        return false;
    }

    // Track a visit (session-based)
    trackVisit() {
        const stats = this.getStats();
        const today = new Date().toISOString().split('T')[0];
        
        // Initialize daily stats for today if not exists
        if (!stats.dailyStats[today]) {
            stats.dailyStats[today] = {
                visits: 0,
                pageViews: 0,
                uniqueVisitors: 0
            };
        }

        // If new session, count as new visit
        if (this.isNewSession()) {
            stats.totalVisits++;
            stats.dailyStats[today].visits++;
            
            // Check if unique visitor (simplified: based on first visit date)
            const lastVisitDate = new Date(stats.lastVisit).toDateString();
            const todayDate = new Date().toDateString();
            
            if (lastVisitDate !== todayDate) {
                stats.uniqueVisitors++;
                stats.dailyStats[today].uniqueVisitors++;
            }
        }

        stats.lastVisit = new Date().toISOString();
        this.saveStats(stats);
    }

    // Track page views
    trackPageView(pageName = 'home') {
        const stats = this.getStats();
        const today = new Date().toISOString().split('T')[0];
        
        // Initialize daily stats if needed
        if (!stats.dailyStats[today]) {
            stats.dailyStats[today] = { visits: 0, pageViews: 0, uniqueVisitors: 0 };
        }

        // Increment counters
        stats.pageViews++;
        stats.dailyStats[today].pageViews++;
        
        if (stats.pages[pageName] !== undefined) {
            stats.pages[pageName]++;
        }

        // Update session page views
        const sessionData = JSON.parse(sessionStorage.getItem(this.sessionKey) || '{}');
        sessionData.pageViews = (sessionData.pageViews || 0) + 1;
        sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));

        this.saveStats(stats);
    }

    // Setup page tracking for navigation
    setupPageTracking() {
        // Override the showPage function to track page views
        const originalShowPage = window.showPage;
        if (originalShowPage) {
            window.showPage = (pageId) => {
                this.trackPageView(pageId);
                return originalShowPage(pageId);
            };
        }
    }

    // Get browser information
    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';
        
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        else if (userAgent.includes('Opera')) browser = 'Opera';
        
        return {
            name: browser,
            userAgent: userAgent,
            language: navigator.language,
            platform: navigator.platform
        };
    }

    // Get device information
    getDeviceInfo() {
        const userAgent = navigator.userAgent;
        let deviceType = 'Desktop';
        
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            deviceType = 'Mobile';
        } else if (/iPad|Android(?=.*\bMobile\b)/.test(userAgent)) {
            deviceType = 'Tablet';
        }
        
        return {
            type: deviceType,
            screen: {
                width: screen.width,
                height: screen.height
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    // Get statistics for display
    getDisplayStats() {
        const stats = this.getStats();
        const today = new Date().toISOString().split('T')[0];
        const todayStats = stats.dailyStats[today] || { visits: 0, pageViews: 0, uniqueVisitors: 0 };
        
        return {
            total: {
                visits: stats.totalVisits,
                pageViews: stats.pageViews,
                uniqueVisitors: stats.uniqueVisitors
            },
            today: todayStats,
            pages: stats.pages,
            mostVisitedPage: this.getMostVisitedPage(stats.pages),
            sessionInfo: this.getSessionInfo(),
            browserInfo: stats.browserInfo,
            deviceInfo: stats.deviceInfo,
            firstVisit: stats.firstVisit,
            lastVisit: stats.lastVisit
        };
    }

    // Get most visited page
    getMostVisitedPage(pages) {
        let maxPage = 'home';
        let maxViews = 0;
        
        for (const [page, views] of Object.entries(pages)) {
            if (views > maxViews) {
                maxViews = views;
                maxPage = page;
            }
        }
        
        return { page: maxPage, views: maxViews };
    }

    // Get current session info
    getSessionInfo() {
        const sessionData = JSON.parse(sessionStorage.getItem(this.sessionKey) || '{}');
        return {
            startTime: sessionData.startTime,
            pageViews: sessionData.pageViews || 0,
            duration: sessionData.startTime ? 
                Math.round((new Date() - new Date(sessionData.startTime)) / 1000 / 60) : 0
        };
    }

    // Display stats (for admin/development purposes)
    displayStats() {
        if (window.location.search.includes('showStats=true')) {
            const stats = this.getDisplayStats();
            console.log('📊 Visitor Statistics:', stats);
            this.createStatsDisplay(stats);
        }
    }

    // Create visual stats display
    createStatsDisplay(stats) {
        const statsContainer = document.createElement('div');
        statsContainer.id = 'visitor-stats-display';
        statsContainer.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(44, 95, 45, 0.95);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;

        statsContainer.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 5px;">
                📊 Visitor Statistics
                <button onclick="this.parentElement.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer;">×</button>
            </div>
            <div><strong>Total Visits:</strong> ${stats.total.visits}</div>
            <div><strong>Page Views:</strong> ${stats.total.pageViews}</div>
            <div><strong>Unique Visitors:</strong> ${stats.total.uniqueVisitors}</div>
            <div style="margin-top: 8px;"><strong>Today:</strong></div>
            <div style="margin-left: 10px;">Visits: ${stats.today.visits}</div>
            <div style="margin-left: 10px;">Page Views: ${stats.today.pageViews}</div>
            <div style="margin-top: 8px;"><strong>Most Visited:</strong> ${stats.mostVisitedPage.page} (${stats.mostVisitedPage.views})</div>
            <div style="margin-top: 8px;"><strong>Session:</strong> ${stats.sessionInfo.pageViews} pages, ${stats.sessionInfo.duration} min</div>
            <div style="margin-top: 8px;"><strong>Device:</strong> ${stats.deviceInfo.type}</div>
            <div><strong>Browser:</strong> ${stats.browserInfo.name}</div>
        `;

        document.body.appendChild(statsContainer);
    }

    // Export stats (for backup/analysis)
    exportStats() {
        const stats = this.getStats();
        const dataStr = JSON.stringify(stats, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `visitor-stats-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    // Reset stats (for testing)
    resetStats() {
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.sessionKey);
        console.log('📊 Visitor statistics reset');
    }

    // Get weekly summary
    getWeeklySummary() {
        const stats = this.getStats();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        let weeklyVisits = 0;
        let weeklyPageViews = 0;
        
        Object.entries(stats.dailyStats).forEach(([date, data]) => {
            if (new Date(date) >= weekAgo) {
                weeklyVisits += data.visits;
                weeklyPageViews += data.pageViews;
            }
        });
        
        return {
            visits: weeklyVisits,
            pageViews: weeklyPageViews,
            avgDaily: Math.round(weeklyVisits / 7)
        };
    }
}

// Initialize visitor tracking when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.visitorStats = new VisitorStats();
    
    // Add stats access to console for development
    window.getVisitorStats = () => window.visitorStats.getDisplayStats();
    window.exportVisitorStats = () => window.visitorStats.exportStats();
    window.resetVisitorStats = () => window.visitorStats.resetStats();
    
    console.log('📊 Visitor tracking initialized. Use ?showStats=true to view stats panel.');
});