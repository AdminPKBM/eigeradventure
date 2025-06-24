const CSV_URL = 'https://raw.githubusercontent.com/AdminPKBM/eigeradventure/main/products.csv';
let allProductData = [];

// Fetch CSV dan tampilkan konten
fetch(CSV_URL)
  .then(res => res.text())
  .then(csv => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        allProductData = results.data;
        tampilkanProduk(allProductData.slice(0, 3), 'rekomendasi');    // 3 produk rekomendasi
        buatKategoriMenu();                                           // buat menu kategori
        tampilkanProduk(allProductData.slice(0, 8), 'koleksi');       // 8 produk awal di koleksi
        tampilkanProduk(allProductData, 'all-products');              // semua produk
      }
    })
  })
  .catch(err => console.error('Error memuat CSV:', err));

// Buat daftar kategori
function buatKategoriMenu() {
  const categoryList = document.getElementById('category-list');
  categoryList.innerHTML = '';
  const kategoriUnik = [...new Set(allProductData.map(p => p['Category Name']).filter(Boolean))];

  kategoriUnik.forEach(kat => {
    const btn = document.createElement('button');
    btn.innerText = kat;
    btn.className = 'btn btn-outline-secondary btn-sm';
    btn.addEventListener('click', () => filterByCategory(kat));
    categoryList.appendChild(btn);
  });
}

// Filter produk berdasarkan kategori
function filterByCategory(kategori) {
  const koleksiData = allProductData.filter(p => p['Category Name'] === kategori);
  tampilkanProduk(koleksiData, 'koleksi');
}

// Tampilkan produk ke dalam container sesuai ID
function tampilkanProduk(data, idElement) {
  const container = document.getElementById(idElement);
  container.innerHTML = '';
  if (data.length === 0) {
    container.innerHTML = '<div class="text-center text-muted w-100">Produk tidak ditemukan.</div>';
    return;
  }

  data.forEach(p => {
    container.innerHTML += `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card product-card h-100">
          <img src="${p['Image URL']}"
               alt="${p['Merchant Product Name']} untuk adventure"
               class="card-img-top" loading="lazy" width="200" height="200">
          <div class="card-body d-flex flex-column">
            <h3 class="card-title fs-6 fw-bold">${p['Merchant Product Name']}</h3>
            <p class="card-text text-muted small flex-grow-1">${p.Description || 'Produk Eiger Adventure terbaik untuk kebutuhan hiking, camping dan petualangan Anda.'}</p>
            <p class="card-text"><strong>Harga:</strong> ${p.Price}</p>
            <a href="${decodeURIComponent(p['Product URL Web (encoded)'])}"
               target="_blank" class="btn btn-sm btn-outline-primary mt-2">Lihat Produk</a>
          </div>
        </div>
      </div>
    `;
  });
}
