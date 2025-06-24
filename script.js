fetch('products.csv')
  .then(res => res.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const data = results.data;

        // Tampil 3 produk pertama sebagai Rekomendasi
        const rekomDiv = document.getElementById('rekomendasi');
        rekomDiv.innerHTML = '';
        data.slice(0, 3).forEach(p => rekomDiv.innerHTML += createProductCard(p));

        // Tampil 3 produk berikutnya sebagai Koleksi Terbaru
        const koleksiDiv = document.getElementById('koleksi');
        koleksiDiv.innerHTML = '';
        data.slice(3, 6).forEach(p => koleksiDiv.innerHTML += createProductCard(p));
        
        // Tampil semua produk di bagian all-products
        const allDiv = document.getElementById('all-products');
        allDiv.innerHTML = '';
        data.forEach(p => allDiv.innerHTML += createProductCard(p));
      }
    });
  });

function createProductCard(p) {
  return `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card product-card h-100">
        <img src="${p['Image URL']}" alt="${p['Merchant Product Name']}">
        <div class="card-body">
          <h5 class="card-title">${p['Merchant Product Name']}</h5>
          <p class="card-text">${p.Description || ''}</p>
          <p class="card-text"><strong>Harga:</strong> ${p.Price}</p>
          <a href="${decodeURIComponent(p['Product URL Web (encoded)'])}" target="_blank" class="btn btn-sm btn-outline-primary">Lihat Produk</a>
        </div>
      </div>
    </div>
  `;
}
