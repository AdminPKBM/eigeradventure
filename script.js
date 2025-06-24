fetch('products.csv')
  .then(response => response.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const rekomDiv = document.getElementById('rekomendasi');
        const koleksiDiv = document.getElementById('koleksi');

        results.data.slice(0, 3).forEach(product => {
          rekomDiv.innerHTML += generateCard(product);
        });

        results.data.slice(3, 6).forEach(product => {
          koleksiDiv.innerHTML += generateCard(product);
        });
      }
    });
  });

function generateCard(product) {
  return `
    <div class="col-sm-6 col-md-4">
      <div class="card product-card h-100 shadow-sm">
        <img src="${product['Image URL']}" class="card-img-top" alt="${product['Merchant Product Name']}">
        <div class="card-body">
          <h5 class="card-title">${product['Merchant Product Name']}</h5>
          <p class="card-text">${product['Description'] || ''}</p>
          <p class="card-text"><strong>Harga:</strong> ${product['Price']} | <strong>Diskon:</strong> ${product['Discounted Price']}</p>
          <a href="${decodeURIComponent(product['Product URL Web (encoded)'])}" target="_blank" class="btn btn-sm btn-outline-primary">Lihat Produk</a>
        </div>
      </div>
    </div>`;
}
