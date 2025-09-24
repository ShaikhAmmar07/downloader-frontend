document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('url-form');
    const urlInput = document.getElementById('url-input');
    const loader = document.getElementById('loader');
    const resultsDiv = document.getElementById('results');

    // !!! IMPORTANT !!!
    // PASTE YOUR RENDER URL IN THE LINE BELOW
    const API_ENDPOINT = 'https://downloader-backend-oet0.onrender.com/download-info';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value.trim();

        if (!url) {
            alert('Please enter a URL.');
            return;
        }

        resultsDiv.classList.add('hidden');
        resultsDiv.innerHTML = '';
        loader.classList.remove('hidden');

        try {
            const response = await fetch(`${API_ENDPOINT}?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error('Server responded with an error. It might be waking up, try again in 30 seconds.');
            }
            const formats = await response.json();
            displayResults(formats);
        } catch (error) {
            console.error('Error fetching video data:', error);
            alert('Could not fetch video data. ' + error.message);
        } finally {
            loader.classList.add('hidden');
        }
    });

    function displayResults(formats) {
        const uniqueFormats = [];
        const seenQualities = new Set();

        formats.reverse().forEach(format => {
            if (!seenQualities.has(format.quality)) {
                uniqueFormats.push(format);
                seenQualities.add(format.quality);
            }
        });

        if (uniqueFormats.length === 0) {
            resultsDiv.innerHTML = '<h3>No downloadable formats found.</h3>';
            resultsDiv.classList.remove('hidden');
            return;
        }

        let html = `<h3>Download Options</h3>`;
        uniqueFormats.forEach(item => {
            html += `
                <div class="result-item">
                    <span>${item.quality} - <small>${item.type} (.${item.ext})</small></span>
                    <a href="${item.url}" class="download-btn" download>Download</a>
                </div>
            `;
        });
        
        resultsDiv.innerHTML = html;
        resultsDiv.classList.remove('hidden');
    }
});
