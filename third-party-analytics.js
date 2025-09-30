/**
 * Third-Party Analytics Integration
 * Optional integrations with free analytics services
 */

class ThirdPartyAnalytics {
    constructor() {
        this.config = {
            // Add your tracking IDs here
            googleAnalytics: null, // e.g., 'G-XXXXXXXXXX'
            simpleAnalytics: null, // e.g., 'your-domain.com'
            fathomAnalytics: null, // e.g., 'XXXXXXXX'
            plausibleAnalytics: null // e.g., 'your-domain.com'
        };
        
        this.init();
    }

    init() {
        // Check configuration and initialize available services
        if (this.config.googleAnalytics) {
            this.initGoogleAnalytics();
        }
        
        if (this.config.simpleAnalytics) {
            this.initSimpleAnalytics();
        }
        
        if (this.config.fathomAnalytics) {
            this.initFathomAnalytics();
        }
        
        if (this.config.plausibleAnalytics) {
            this.initPlausibleAnalytics();
        }
    }

    // Google Analytics 4 (Free)
    initGoogleAnalytics() {
        // Load Google Analytics script
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalytics}`;
        document.head.appendChild(gtagScript);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.config.googleAnalytics, {
            page_title: 'Islamic Will & Inheritance',
            custom_map: {'custom_parameter_1': 'page_section'}
        });

        // Store gtag function globally
        window.gtag = gtag;
        
        console.log('📊 Google Analytics initialized');
    }

    // Simple Analytics (Free plan available)
    initSimpleAnalytics() {
        const saScript = document.createElement('script');
        saScript.async = true;
        saScript.defer = true;
        saScript.src = 'https://scripts.simpleanalyticscdn.com/latest.js';
        document.head.appendChild(saScript);
        
        // Set the hostname
        window.sa_event = window.sa_event || function() {
            var a = [].slice.call(arguments);
            window.sa_event.q ? window.sa_event.q.push(a) : window.sa_event.q = [a];
        };
        
        console.log('📊 Simple Analytics initialized');
    }

    // Fathom Analytics (Free plan available)
    initFathomAnalytics() {
        const fathomScript = document.createElement('script');
        fathomScript.src = 'https://cdn.usefathom.com/script.js';
        fathomScript.setAttribute('data-site', this.config.fathomAnalytics);
        fathomScript.defer = true;
        document.head.appendChild(fathomScript);
        
        console.log('📊 Fathom Analytics initialized');
    }

    // Plausible Analytics (Free plan available)
    initPlausibleAnalytics() {
        const plausibleScript = document.createElement('script');
        plausibleScript.defer = true;
        plausibleScript.setAttribute('data-domain', this.config.plausibleAnalytics);
        plausibleScript.src = 'https://plausible.io/js/script.js';
        document.head.appendChild(plausibleScript);
        
        console.log('📊 Plausible Analytics initialized');
    }

    // Track custom events (works with multiple services)
    trackEvent(eventName, properties = {}) {
        // Google Analytics
        if (this.config.googleAnalytics && window.gtag) {
            gtag('event', eventName, {
                event_category: properties.category || 'interaction',
                event_label: properties.label || '',
                value: properties.value || 0,
                ...properties
            });
        }

        // Simple Analytics
        if (this.config.simpleAnalytics && window.sa_event) {
            sa_event(eventName, properties);
        }

        // Fathom Analytics
        if (this.config.fathomAnalytics && window.fathom) {
            fathom.trackGoal(eventName, properties.value || 0);
        }

        // Also track in local analytics
        if (window.visitorStats) {
            console.log(`📊 Event tracked: ${eventName}`, properties);
        }
    }

    // Track page views (for SPAs)
    trackPageView(pageName, pageTitle) {
        // Google Analytics
        if (this.config.googleAnalytics && window.gtag) {
            gtag('config', this.config.googleAnalytics, {
                page_title: pageTitle || pageName,
                page_location: window.location.href,
                page_path: `/${pageName}`
            });
        }

        // Simple Analytics
        if (this.config.simpleAnalytics && window.sa_event) {
            sa_event('pageview', { page: pageName });
        }

        console.log(`📊 Page view tracked: ${pageName}`);
    }
}

// Configuration helper
class AnalyticsConfig {
    static showSetupInstructions() {
        console.log(`
📊 ANALYTICS SETUP INSTRUCTIONS

1. LOCAL ANALYTICS (Already Active):
   - Automatically tracks visitor statistics
   - Stores data in browser localStorage
   - View dashboard: analytics.html

2. GOOGLE ANALYTICS 4 (Free):
   - Sign up at: https://analytics.google.com/
   - Create property and get tracking ID (G-XXXXXXXXXX)
   - Add tracking ID to thirdPartyAnalytics.config.googleAnalytics

3. SIMPLE ANALYTICS (Free plan available):
   - Sign up at: https://simpleanalytics.com/
   - Add your domain to thirdPartyAnalytics.config.simpleAnalytics

4. FATHOM ANALYTICS (Free plan available):
   - Sign up at: https://usefathom.com/
   - Get site ID and add to thirdPartyAnalytics.config.fathomAnalytics

5. PLAUSIBLE ANALYTICS (Free plan available):
   - Sign up at: https://plausible.io/
   - Add your domain to thirdPartyAnalytics.config.plausibleAnalytics

To enable any service, edit the config object in this file and reload the page.
        `);
    }

    static enableGoogleAnalytics(trackingId) {
        console.log(`To enable Google Analytics, add this to your HTML head:
        
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${trackingId}');
</script>

Or set thirdPartyAnalytics.config.googleAnalytics = '${trackingId}' in this file.`);
    }
}

// Initialize third-party analytics when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure all other scripts are loaded
    setTimeout(() => {
        try {
            window.thirdPartyAnalytics = new ThirdPartyAnalytics();
            
            // Enhanced page tracking for Islamic Will features
            const originalShowPage = window.showPage;
            if (originalShowPage && typeof originalShowPage === 'function') {
                window.showPage = function(pageId) {
                    // Track page change
                    try {
                        if (window.thirdPartyAnalytics && window.thirdPartyAnalytics.trackPageView) {
                            window.thirdPartyAnalytics.trackPageView(pageId, `Islamic Will - ${pageId}`);
                        }
                    } catch (error) {
                        console.warn('Analytics tracking error:', error);
                    }
                    
                    // Track specific Islamic features
                    const islamicFeatures = {
                        'inheritance-calculator': 'Islamic Inheritance Calculator Used',
                        'create-will': 'Islamic Will Creation Started',
                        'inheritance-schedule': 'Inheritance Schedule Viewed'
                    };
                    
                    if (islamicFeatures[pageId] && window.thirdPartyAnalytics) {
                        try {
                            window.thirdPartyAnalytics.trackEvent('islamic_feature_used', {
                                category: 'Islamic Features',
                                label: pageId,
                                feature: islamicFeatures[pageId]
                            });
                        } catch (error) {
                            console.warn('Analytics event tracking error:', error);
                        }
                    }
                    
                    return originalShowPage(pageId);
                };
            }
        } catch (error) {
            console.warn('Analytics initialization error:', error);
        }
    }, 500);
    
    // Track calculator usage with delay
    setTimeout(() => {
        try {
            const originalPerformCalculation = window.performInheritanceCalculation;
            if (originalPerformCalculation && typeof originalPerformCalculation === 'function') {
                window.performInheritanceCalculation = function() {
                    // Track calculator usage
                    try {
                        if (window.thirdPartyAnalytics) {
                            window.thirdPartyAnalytics.trackEvent('calculator_used', {
                                category: 'Islamic Calculator',
                                label: 'inheritance_calculation'
                            });
                        }
                    } catch (error) {
                        console.warn('Analytics calculator tracking error:', error);
                    }
                    
                    return originalPerformCalculation();
                };
            }
            
            // Track PDF exports
            const originalExportPDF = window.exportToPDF;
            if (originalExportPDF && typeof originalExportPDF === 'function') {
                window.exportToPDF = function() {
                    // Track PDF export
                    try {
                        if (window.thirdPartyAnalytics) {
                            window.thirdPartyAnalytics.trackEvent('pdf_export', {
                                category: 'Export',
                                label: 'inheritance_calculation_pdf'
                            });
                        }
                    } catch (error) {
                        console.warn('Analytics PDF tracking error:', error);
                    }
                    
                    return originalExportPDF();
                };
            }
        } catch (error) {
            console.warn('Analytics function wrapping error:', error);
        }
    }, 1000);
    
    // Make analytics config available in console
    window.analyticsConfig = AnalyticsConfig;
    
    // Show setup instructions in console
    setTimeout(() => {
        try {
            AnalyticsConfig.showSetupInstructions();
        } catch (error) {
            console.warn('Analytics setup instructions error:', error);
        }
    }, 2000);
});