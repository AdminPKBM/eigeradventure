// Memuat PapaParse dari CDN
const scriptPapa = document.createElement('script');
scriptPapa.src = "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js";
document.head.appendChild(scriptPapa);

scriptPapa.onload = function() {
  // Setelah PapaParse diload, ambil CSV
  fetch('products.csv')
    .then(response => response.text())
    .then(csvText => {
      Papa.parse(csvText, {
        header: true,         // Ambil baris pertama sebagai header
        skipEmptyLines: true, // Lewati baris kosong
        complete: results => {
          const container = document.getElementById('products');
          container.innerHTML = '';
          
          results.data.forEach(product => {
            // Pastikan data penting ada
            if (!product['Merchant Product Name']) return;

            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            productDiv.innerHTML = `
              <h2>${product['Merchant Product Name']}</h2>
              <img src="${product['Image URL']}" alt="${product['Merchant Product Name']}">
              <p>${product.Description || ''}</p>
              <p><strong>Harga:</strong> ${product.Price}</p>
              <p><strong>Diskon:</strong> ${product['Discounted Price']}</p>
              <a href="${decodeURIComponent(product['Product URL Web (encoded)'])}" target="_blank">Lihat Produk</a>
            `;

            container.appendChild(productDiv);
          });
        },
        error: err => {
          console.error('Error membaca CSV:', err);
        }
      });
    })
    .catch(err => console.error('Error fetch CSV:', err));
};
