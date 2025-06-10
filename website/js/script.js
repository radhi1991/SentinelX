document.addEventListener('DOMContentLoaded', () => {
    console.log("API Sentinel dashboard script loaded.");

    // Example: Change main paragraph text after a delay
    setTimeout(() => {
        const mainParagraph = document.querySelector('main p');
        if (mainParagraph) {
            mainParagraph.textContent = 'Dashboard content will appear here shortly.';
        }
    }, 2000);
});
