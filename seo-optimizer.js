/**
 * SEO Optimization Script for Islamic Will Calculator
 * Implements advanced SEO strategies for global ranking
 */

class SEOOptimizer {
    constructor() {
        this.keywords = [
            'islamic will', 'muslim will', 'islamic inheritance calculator', 'muslim inheritance calculator',
            'shariah inheritance', 'islamic heritage distribution', 'faraid calculator', 'asabah inheritance',
            'quran inheritance', 'islamic law inheritance', 'muslim estate planning', 'islamic will template',
            'shariah compliant will', 'islamic succession law', 'muslim family law', 'inheritance according to islam',
            'islamic will online', 'free islamic calculator', 'muslim heritage calculator', 'islamic estate division'
        ];
        
        this.init();
    }

    init() {
        this.addDynamicKeywords();
        this.setupSearchAnalytics();
        this.enhancePageStructure();
        this.addRichSnippets();
        this.setupSiteMap();
        // this.addBreadcrumbs(); // Commented out to remove breadcrumb navigation
        this.optimizeImages();
        this.addSchemaMarkup();
    }

    // Add dynamic keywords based on user interactions
    addDynamicKeywords() {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            const currentKeywords = metaKeywords.getAttribute('content');
            const additionalKeywords = [
                'islamic inheritance law 2025',
                'muslim will creator online',
                'shariah inheritance distribution calculator',
                'free islamic estate planning tool',
                'quran inheritance shares calculator',
                'islamic family law inheritance rights',
                'muslim heritage division according to sunnah',
                'islamic succession planning software',
                'shariah compliant inheritance calculator',
                'islamic will maker for global muslims'
            ].join(', ');
            
            metaKeywords.setAttribute('content', currentKeywords + ', ' + additionalKeywords);
        }
    }

    // Setup search analytics and tracking
    setupSearchAnalytics() {
        // Track search-related events
        const originalShowPage = window.showPage;
        if (originalShowPage) {
            window.showPage = (pageId) => {
                // Track page views for SEO
                this.trackSEOEvent('page_view', {
                    page: pageId,
                    timestamp: new Date().toISOString(),
                    keywords_matched: this.getMatchedKeywords(pageId)
                });
                
                return originalShowPage(pageId);
            };
        }

        // Track calculator usage for SEO insights
        const originalCalculation = window.performInheritanceCalculation;
        if (originalCalculation) {
            window.performInheritanceCalculation = function() {
                window.seoOptimizer.trackSEOEvent('calculator_used', {
                    feature: 'islamic_inheritance_calculator',
                    timestamp: new Date().toISOString()
                });
                
                return originalCalculation();
            };
        }
    }

    // Enhance page structure for better SEO
    enhancePageStructure() {
        // Add semantic HTML5 tags
        this.addSemantictags();
        
        // Optimize headings hierarchy
        this.optimizeHeadings();
        
        // Add internal linking
        this.addInternalLinks();
        
        // Optimize content structure
        this.structureContent();
    }

    addSemantictags() {
        // Wrap main content in semantic tags
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            if (!page.querySelector('main')) {
                const main = document.createElement('main');
                main.setAttribute('role', 'main');
                main.setAttribute('aria-label', 'Main content');
                
                const content = page.innerHTML;
                page.innerHTML = '';
                main.innerHTML = content;
                page.appendChild(main);
            }
        });

        // Add article tags for content sections
        const contentSections = document.querySelectorAll('.features-section, .how-it-works');
        contentSections.forEach(section => {
            section.setAttribute('role', 'article');
            section.setAttribute('itemscope', '');
            section.setAttribute('itemtype', 'https://schema.org/Article');
        });
    }

    optimizeHeadings() {
        // Ensure proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            // Skip footer elements to maintain consistent branding
            if (heading.closest('footer')) {
                heading.setAttribute('itemprop', 'headline');
                return;
            }
            
            // Add keyword-rich content to headings (excluding footer)
            if (heading.textContent.includes('Islamic Will') && !heading.textContent.includes('Calculator')) {
                heading.textContent = heading.textContent.replace('Islamic Will', 'Islamic Will & Inheritance Calculator');
            }
            
            // Add structured data to headings
            heading.setAttribute('itemprop', 'headline');
        });
    }

    addInternalLinks() {
        // Add contextual internal links
        const content = document.querySelector('#home .container');
        if (content) {
            const internalLinksHTML = `
                <section class="internal-links-section" style="margin: 40px 0; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 15px;">
                    <h3>Explore Our Islamic Inheritance Tools</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 20px;">
                        <div class="internal-link-card">
                            <h4><a href="#" onclick="showPage('inheritance-calculator')" style="color: #ffd700; text-decoration: none;">🧮 Islamic Inheritance Calculator</a></h4>
                            <p>Calculate precise Shariah-compliant inheritance distribution for all types of heirs according to Quran and Sunnah.</p>
                        </div>
                        <div class="internal-link-card">
                            <h4><a href="#" onclick="showPage('create-will')" style="color: #ffd700; text-decoration: none;">📜 Create Islamic Will</a></h4>
                            <p>Generate your Islamic will with proper Shariah guidelines and legal documentation.</p>
                        </div>
                        <div class="internal-link-card">
                            <h4><a href="#" onclick="showPage('inheritance-schedule')" style="color: #ffd700; text-decoration: none;">📋 Inheritance Schedule</a></h4>
                            <p>View detailed inheritance rules and schedules according to Islamic jurisprudence.</p>
                        </div>
                        <div class="internal-link-card">
                            <h4><a href="#" onclick="showPage('user-manual')" style="color: #ffd700; text-decoration: none;">📚 Islamic Inheritance Guide</a></h4>
                            <p>Complete guide to Islamic inheritance law, Fara'id, Asabah, and Shariah principles.</p>
                        </div>
                    </div>
                </section>
            `;
            
            content.insertAdjacentHTML('beforeend', internalLinksHTML);
        }
    }

    structureContent() {
        // Add FAQ section for better SEO
        const faqHTML = `
            <section class="faq-section" style="margin: 40px 0; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 15px;" 
                     itemscope itemtype="https://schema.org/FAQPage">
                <h2>Frequently Asked Questions About Islamic Inheritance</h2>
                
                <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <h3 itemprop="name">How accurate is this Islamic inheritance calculator?</h3>
                    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <p itemprop="text">Our Islamic inheritance calculator is based on authentic Quranic verses and Prophetic traditions (Hadith). It implements the complete Fara'id system and Asabah rules as established by Islamic scholars, ensuring 100% Shariah compliance.</p>
                    </div>
                </div>
                
                <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <h3 itemprop="name">Is this Muslim will creator legally valid worldwide?</h3>
                    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <p itemprop="text">This tool creates Shariah-compliant Islamic wills that serve as excellent starting points. However, we recommend consulting local Islamic scholars and legal experts to ensure compliance with your country's laws while maintaining Shariah authenticity.</p>
                    </div>
                </div>
                
                <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <h3 itemprop="name">What's the difference between Fara'id and Asabah in Islamic inheritance?</h3>
                    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <p itemprop="text">Fara'id refers to the fixed shares mentioned in the Quran for specific heirs (like 1/2 for spouse, 1/3 for mother, etc.). Asabah refers to male agnate relatives who inherit the remainder after Fara'id shares are distributed, following the principle "the residue goes to the nearest male agnate."</p>
                    </div>
                </div>
                
                <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <h3 itemprop="name">Can women inherit property in Islamic law?</h3>
                    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <p itemprop="text">Absolutely! Islam was among the first systems to grant women inheritance rights. Women inherit as daughters, wives, mothers, sisters, and in other relationships. The Quran specifically mentions shares for women, establishing their permanent inheritance rights 1400 years ago.</p>
                    </div>
                </div>
            </section>
        `;
        
        const homeContainer = document.querySelector('#home .container');
        if (homeContainer) {
            homeContainer.insertAdjacentHTML('beforeend', faqHTML);
        }
    }

    // Add rich snippets and structured data
    addRichSnippets() {
        // Add breadcrumb structured data
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://islamic-will-calculator.com/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Islamic Inheritance Calculator",
                    "item": "https://islamic-will-calculator.com/#inheritance-calculator"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Create Islamic Will",
                    "item": "https://islamic-will-calculator.com/#create-will"
                }
            ]
        };

        this.addStructuredData(breadcrumbSchema);
    }

    addStructuredData(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    // Setup sitemap generation
    setupSiteMap() {
        const sitemap = {
            pages: [
                { url: '/', priority: 1.0, changefreq: 'daily' },
                { url: '/#inheritance-calculator', priority: 0.9, changefreq: 'weekly' },
                { url: '/#create-will', priority: 0.9, changefreq: 'weekly' },
                { url: '/#inheritance-schedule', priority: 0.8, changefreq: 'monthly' },
                { url: '/#user-manual', priority: 0.8, changefreq: 'monthly' },
                { url: '/analytics.html', priority: 0.3, changefreq: 'monthly' }
            ],
            keywords: this.keywords,
            lastmod: new Date().toISOString()
        };

        // Store sitemap data for generation
        localStorage.setItem('seoSitemap', JSON.stringify(sitemap));
    }

    // Add breadcrumbs to UI - COMMENTED OUT
    /*
    addBreadcrumbs() {
        const breadcrumbHTML = `
            <nav class="breadcrumbs" style="margin: 20px 0; padding: 10px 0;" aria-label="Breadcrumb">
                <ol style="list-style: none; display: flex; gap: 10px; margin: 0; padding: 0; font-size: 0.9rem;">
                    <li><a href="#" onclick="showPage('home')" style="color: #ffd700; text-decoration: none;">🏠 Home</a></li>
                    <li style="color: #ccc;"> › </li>
                    <li id="current-page-breadcrumb" style="color: white;">Islamic Inheritance Calculator</li>
                </ol>
            </nav>
        `;

        // Add breadcrumbs to each page
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            if (!page.querySelector('.breadcrumbs')) {
                const container = page.querySelector('.container');
                if (container) {
                    container.insertAdjacentHTML('afterbegin', breadcrumbHTML);
                }
            }
        });
    }
    */

    // Optimize images for SEO
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.alt) {
                // Add appropriate alt text based on context
                if (img.closest('.feature-card')) {
                    img.alt = 'Islamic inheritance calculator feature icon';
                } else {
                    img.alt = 'Islamic will and inheritance calculator illustration';
                }
            }
            
            // Add structured data to images
            img.setAttribute('itemprop', 'image');
        });
    }

    // Track SEO-related events
    trackSEOEvent(eventName, data) {
        const seoEvents = JSON.parse(localStorage.getItem('seoEvents') || '[]');
        seoEvents.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
        
        // Keep only last 100 events
        if (seoEvents.length > 100) {
            seoEvents.splice(0, seoEvents.length - 100);
        }
        
        localStorage.setItem('seoEvents', JSON.stringify(seoEvents));
    }

    // Get matched keywords for a page
    getMatchedKeywords(pageId) {
        const pageKeywords = {
            'home': ['islamic will', 'muslim will', 'islamic inheritance calculator', 'shariah inheritance'],
            'inheritance-calculator': ['islamic inheritance calculator', 'muslim inheritance calculator', 'faraid calculator', 'asabah inheritance'],
            'create-will': ['islamic will template', 'muslim will creator', 'shariah compliant will', 'islamic estate planning'],
            'inheritance-schedule': ['islamic inheritance law', 'muslim succession law', 'shariah inheritance rules'],
            'user-manual': ['islamic inheritance guide', 'muslim family law', 'quran inheritance', 'islamic law inheritance']
        };
        
        return pageKeywords[pageId] || [];
    }

    // Generate robots.txt content
    generateRobotsTxt() {
        return `User-agent: *
Allow: /
Allow: /analytics.html
Sitemap: https://islamic-will-calculator.com/sitemap.xml

# High priority pages
Allow: /#inheritance-calculator
Allow: /#create-will
Allow: /#inheritance-schedule
Allow: /#user-manual

# Analytics (low priority)
Allow: /analytics.html

# Important crawling directives
Crawl-delay: 1`;
    }

    // Generate sitemap.xml content
    generateSitemapXML() {
        const sitemap = JSON.parse(localStorage.getItem('seoSitemap') || '{}');
        const baseUrl = 'https://islamic-will-calculator.com';
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

        sitemap.pages?.forEach(page => {
            xml += `
    <url>
        <loc>${baseUrl}${page.url}</loc>
        <lastmod>${sitemap.lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
        });

        xml += '\n</urlset>';
        return xml;
    }

    // Add schema markup for calculator
    addSchemaMarkup() {
        const calculatorSchema = {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Islamic Inheritance Calculator",
            "description": "Free online Islamic inheritance calculator that computes Shariah-compliant distribution according to Quran and Sunnah",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": {
                "@type": "Offer",
                "price": "0"
            },
            "featureList": [
                "Fara'id calculations",
                "Asabah inheritance rules",
                "29 types of heirs support",
                "PDF export functionality",
                "Shariah compliance verification"
            ]
        };

        this.addStructuredData(calculatorSchema);
    }

    // Export SEO data for analysis
    exportSEOData() {
        const seoData = {
            keywords: this.keywords,
            events: JSON.parse(localStorage.getItem('seoEvents') || '[]'),
            sitemap: JSON.parse(localStorage.getItem('seoSitemap') || '{}'),
            performance: this.getSEOPerformance(),
            recommendations: this.getSEORecommendations()
        };

        const dataStr = JSON.stringify(seoData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `seo-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    // Get SEO performance metrics
    getSEOPerformance() {
        return {
            pageLoadTime: performance.timing ? (performance.timing.loadEventEnd - performance.timing.navigationStart) : 0,
            totalKeywords: this.keywords.length,
            pagesOptimized: document.querySelectorAll('.page').length,
            structuredDataElements: document.querySelectorAll('script[type="application/ld+json"]').length,
            headingOptimization: document.querySelectorAll('h1, h2, h3').length,
            internalLinks: document.querySelectorAll('a[onclick*="showPage"]').length
        };
    }

    // Get SEO recommendations
    getSEORecommendations() {
        const recommendations = [];
        
        // Check meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc || metaDesc.content.length < 150) {
            recommendations.push('Meta description should be 150-160 characters for optimal SEO');
        }

        // Check title length
        const title = document.title;
        if (title.length > 60) {
            recommendations.push('Title tag should be under 60 characters for better display in search results');
        }

        // Check heading structure
        const h1Count = document.querySelectorAll('h1').length;
        if (h1Count !== 1) {
            recommendations.push('Each page should have exactly one H1 tag');
        }

        // Check image alt texts
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])').length;
        if (imagesWithoutAlt > 0) {
            recommendations.push(`${imagesWithoutAlt} images missing alt text`);
        }

        return recommendations;
    }
}

// Initialize SEO optimization when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.seoOptimizer = new SEOOptimizer();
    
    // Make SEO tools available in console
    window.exportSEOData = () => window.seoOptimizer.exportSEOData();
    window.generateSitemap = () => window.seoOptimizer.generateSitemapXML();
    window.generateRobots = () => window.seoOptimizer.generateRobotsTxt();
    
    console.log('🔍 SEO Optimizer initialized. Use exportSEOData() to download SEO analytics.');
});