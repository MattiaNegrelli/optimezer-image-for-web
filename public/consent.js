(function () {
    function loadAnalytics() {
        // Avoid duplicate loading
        if (window.dataLayer) return;

        // Load GA Script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-5534L5HCNG';
        document.head.appendChild(script);

        // Initialize GA
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-5534L5HCNG');
    }

    function initBanner() {
        const consent = localStorage.getItem('cookieConsent');

        // If already consented (true), load analytics and exit
        if (consent === 'true') {
            loadAnalytics();
            return;
        }

        // If rejected (false), do nothing and exit (banner shouldn't show)
        if (consent === 'false') {
            return;
        }

        // Styles for the banner
        const style = document.createElement('style');
        style.innerHTML = `
            .cookie-banner {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 600px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.6);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.2rem;
                z-index: 10000;
                animation: slideUp 0.5s ease-out;
                color: #333;
                font-family: 'Outfit', sans-serif;
            }

            @media (min-width: 768px) {
                .cookie-banner {
                    flex-row: row;
                    align-items: center;
                    justify-content: space-between;
                    bottom: 30px;
                }
            }

            .cookie-content p {
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.5;
                color: #444;
            }

            .cookie-content a {
                color: #4361ee;
                text-decoration: none;
                font-weight: 500;
            }

            .cookie-content a:hover {
                text-decoration: underline;
            }

            .cookie-actions {
                display: flex;
                gap: 0.75rem;
            }

            .cookie-btn {
                padding: 0.6rem 1.2rem;
                border: none;
                border-radius: 8px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            }

            .btn-accept {
                background: #4361ee;
                color: white;
                box-shadow: 0 4px 12px rgba(67, 97, 238, 0.25);
            }

            .btn-accept:hover {
                background: #3651d4;
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(67, 97, 238, 0.35);
            }

            .btn-reject {
                background: transparent;
                border: 1px solid #ddd;
                color: #666;
            }

            .btn-reject:hover {
                background: #f5f5f5;
                border-color: #ccc;
                color: #333;
            }

            @keyframes slideUp {
                from { transform: translate(-50%, 100px); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Banner HTML structure
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>
                    Utilizziamo cookie per migliorare la tua esperienza. 
                    Puoi accettare o rifiutare il tracciamento anonimo (Google Analytics).
                    <a href="/privacy">Leggi di più</a>.
                </p>
            </div>
            <div class="cookie-actions">
                <button id="reject-cookies" class="cookie-btn btn-reject">Rifiuta</button>
                <button id="accept-cookies" class="cookie-btn btn-accept">Accetta</button>
            </div>
        `;

        document.body.appendChild(banner);

        function closeBanner() {
            banner.style.opacity = '0';
            banner.style.transform = 'translate(-50%, 20px)';
            banner.style.transition = 'all 0.3s ease';
            setTimeout(() => banner.remove(), 300);
        }

        // ACCEPT
        document.getElementById('accept-cookies').addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'true');
            loadAnalytics();
            closeBanner();
        });

        // REJECT
        document.getElementById('reject-cookies').addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'false');
            closeBanner();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBanner);
    } else {
        initBanner();
    }
})();
