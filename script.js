document.addEventListener('DOMContentLoaded', init);

const CSV_URL = 'https://raw.githubusercontent.com/AdminPKBM/eigeradventure/main/products.csv';
let allProductData = [];

function init() {
  // Tampilkan spinner awal
  showLoading('rekomendasi');
  showLoading('koleksi');
  showLoading('all-products');

  fetch(CSV_URL)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.text();
    })
    .then(csv => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: results => {
          allProductData = results.data;
          hideLoading('rekomendasi');
          hideLoading('koleksi');
          hideLoading('all-products');

          tampilkanProduk(allProductData.slice(0, 3), 'rekomendasi');  
          buatKategoriMenu();                                          
          tampilkanProduk(allProductData.slice(0, 8), 'koleksi');     
          tampilkanProduk(allProductData, 'all-products');            
        }
      })
    })
    .catch(err => {
      showError('rekomendasi', err.message);
      showError('koleksi', err.message);
      showError('all-products', err.message);
      console.error('Error memuat CSV:', err);
    });
}

// Tampilkan spinner
function showLoading(id) {
  const container = document.getElementById(id);
  if (container) {
    container.innerHTML = '<div class="loading-spinner text-center w-100"><div class="spinner-border text-primary"></div></div>';
  }
}

// Sembunyikan spinner
function hideLoading(id) {
  const container = document.getElementById(id);
  if (container) container.innerHTML = '';
}

// Tampilkan pesan error
function showError(id, msg) {
  const container = document.getElementById(id);
  if (container) {
    container.innerHTML = `<div class="text-center text-danger w-100">Gagal memuat data: ${msg}</div>`;
  }
}

// Buat daftar kategori
function buatKategoriMenu() {
  const categoryList = document.getElementById('category-list');
  if (!categoryList) return;
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

// Filter produk
function filterByCategory(kategori) {
  const koleksiData = allProductData.filter(p => p['Category Name'] === kategori);
  tampilkanProduk(koleksiData, 'koleksi');
}

// Render produk
function tampilkanProduk(data, idElement) {
  const container = document.getElementById(idElement);
  if (!container) return;
  if (data.length === 0) {
    container.innerHTML = '<div class="text-center text-muted w-100">Produk tidak ditemukan.</div>';
    return;
  }

  const markup = data.map(p => `
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
  `).join('');

  container.innerHTML = markup;
}
