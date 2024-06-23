(function () {
    document.addEventListener('DOMContentLoaded', () => {
        // Function to get query parameters from the URL
        function getQueryParam(name, defaultValue) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.has(name) ? urlParams.get(name) : defaultValue;
        }

        // Retrieve initial values from query parameters
        const debug = getQueryParam('debug', 'true') === 'true';
        const intersectionThreshold = parseFloat(getQueryParam('intersectionThreshold', '0.5'));
        let zIndex = parseInt(getQueryParam('zIndex', '1'), 10);

        // Function to create an iframe with specified styles
        function createIframe(width, height, position, top, left, bottom, right, z) {
            const iframe = document.createElement('iframe');
            iframe.style.width = width;
            iframe.style.height = height;
            iframe.style.border = 'none';
            iframe.style.position = position;
            if (top !== undefined) iframe.style.top = top;
            if (left !== undefined) iframe.style.left = left;
            if (bottom !== undefined) iframe.style.bottom = bottom;
            if (right !== undefined) iframe.style.right = right;
            iframe.style.zIndex = z;
            return iframe;
        }

        // Set the srcdoc for iframes
        const srcdocContent = `
            <html>
            <head>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background-image: url('./pixel_ruler.png');
                        background-repeat: repeat;
                    }
                </style>
            </head>
            <body></body>
            </html>
        `;

        // Function to create a control container
        function createControlContainer() {
            const controlContainer = document.createElement('div');
            Object.assign(controlContainer.style, {
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '10000',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                padding: '10px',
                borderRadius: '5px'
            });

            const slider = document.createElement('input');
            Object.assign(slider, {
                type: 'range',
                min: '1',
                max: '100',
                value: zIndex
            });
            slider.style.marginRight = '10px';

            const label = document.createElement('span');
            label.textContent = zIndex;
            Object.assign(label.style, {
                minWidth: '30px',
                textAlign: 'right'
            });

            // Update zIndex on slider input
            slider.addEventListener('input', (e) => {
                zIndex = parseInt(e.target.value);
                iframe1.style.zIndex = zIndex;
                label.textContent = zIndex;
            });

            controlContainer.appendChild(slider);
            controlContainer.appendChild(label);

            return controlContainer;
        }

        // Create the main iframe (iframe1)
        const iframe1 = createIframe('100%', '80vh', 'absolute', '0', '0', undefined, undefined, zIndex);
        iframe1.srcdoc = srcdocContent;

        // Create the sub iframe (iframe2)
        const iframe2 = createIframe('320px', '180px', 'fixed', undefined, undefined, '20px', '20px', '9999');
        iframe2.style.display = 'none'; // Initially hidden
        iframe2.srcdoc = srcdocContent;

        // Append elements to the body
        document.body.appendChild(iframe1);
        document.body.appendChild(iframe2);

        // Add control container only in debug mode
        if (debug) {
            const controlContainer = createControlContainer();
            document.body.appendChild(controlContainer);
        }

        // Setup Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Toggle iframe visibility based on intersection ratio
                if (entry.intersectionRatio < intersectionThreshold) {
                    iframe1.style.opacity = '0';
                    iframe2.style.display = 'block';
                } else {
                    iframe1.style.opacity = '1';
                    iframe2.style.display = 'none';
                }
            });
        }, { threshold: intersectionThreshold });

        // Start observing iframe1
        observer.observe(iframe1);
    });
})();
