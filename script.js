// Ambil file CSV dan tampilkan
fetch('products.csv')
  .then(res => res.text())
  .then(csv => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const data = results.data;
        tampilkanProduk(data.slice(0, 3), 'rekomendasi');  // 3 produk rekomendasi
        tampilkanProduk(data.slice(3, 6), 'koleksi');       // 3 koleksi terbaru
        tampilkanProduk(data, 'all-products');             // semua produk
      }
    })
  });

function tampilkanProduk(data, idElement) {
  const container = document.getElementById(idElement);
  container.innerHTML = '';
  data.forEach(p => {
    container.innerHTML += `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card product-card h-100">
          <img src="${p['Image URL']}" alt="Produk Eiger ${p['Merchant Product Name']} untuk adventure" class="card-img-top" loading="lazy">
          <div class="card-body">
            <h3 class="card-title fs-6 fw-bold">${p['Merchant Product Name']}</h3>
            <p class="card-text text-muted small">${p.Description || 'Produk Eiger Adventure terbaik untuk kebutuhan hiking, camping dan petualangan Anda.'}</p>
            <p class="card-text"><strong>Harga:</strong> ${p.Price}</p>
            <a href="${decodeURIComponent(p['Product URL Web (encoded)'])}"
               target="_blank" class="btn btn-sm btn-outline-primary mt-2">Lihat Produk</a>
          </div>
        </div>
      </div>
    `;
  });
}
