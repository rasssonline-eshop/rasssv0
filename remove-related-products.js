// Script to remove related products section
// Run this in the browser console on the product page

// Remove related products section
const relatedSection = document.querySelector('.mt-10');
if (relatedSection && relatedSection.querySelector('h2')?.textContent === 'Related Products') {
    relatedSection.remove();
    console.log('Related products section removed');
}

// Or add this CSS to hide it
const style = document.createElement('style');
style.textContent = `
  .mt-10:has(h2:contains("Related Products")) {
    display: none !important;
  }
`;
document.head.appendChild(style);
