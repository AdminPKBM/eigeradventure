// URL CSV langsung dari GitHub raw agar lebih cepat
const CSV_URL = 'https://raw.githubusercontent.com/AdminPKBM/eigeradventure/main/products.csv';

// Variabel global untuk menyimpan semua produk dan status pagination
let allProductData = [];
let loadedCount = 0;
const loadPerPage = 8; // jumlah produk per batch

// Ambil file CSV saat pertama kali halaman diload
fetch(CSV_URL)
  .then(res => res.text())
  .then(csv => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        allProductData = results.data;
        // tampilkan rekomendasi dan koleksi awal
        tampilkanProduk(allProductData.slice(0, 3), 'rekomendasi');  
        tampilkanProduk(allProductData.slice(3, 6), 'koleksi');       
      }
    });
  })
  .catch(err => console.error('Error memuat CSV:', err));

// Event listener untuk tombol Lihat Semua Produk
document.querySelector('a[href="#products"]').addEventListener('click', e => {
  e.preventDefault();
  loadedCount = 0; // reset counter
  const container = document.getElementById('all-products');
  container.innerHTML = '';
  tampilkanProdukBertahap('all-products'); // tampilkan batch pertama
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' }); 
});

// Tambahkan event listener untuk tombol "Muat Lebih Banyak"
document.addEventListener('DOMContentLoaded', () => {
  const btnLoadMore = document.createElement('button');
  btnLoadMore.id = 'load-more-btn';
  btnLoadMore.innerText = 'Muat Lebih Banyak';
  btnLoadMore.className = 'btn btn-outline-primary mt-3';
  btnLoadMore.addEventListener('click', () => tampilkanProdukBertahap('all-products'));
  document.getElementById('products').appendChild(btnLoadMore);
});

function tampilkanProdukBertahap(idElement) {
  const container = document.getElementById(idElement);
  const nextData = allProductData.slice(loadedCount, loadedCount + loadPerPage);
  nextData.forEach(p => {
    container.innerHTML += `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card product-card h-100">
          <img src="${p['Image URL']}"
               alt="Produk Eiger ${p['Merchant Product Name']} untuk adventure"
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

  loadedCount += nextData.length;

  // Sembunyikan tombol "Muat Lebih Banyak" bila sudah selesai
  if (loadedCount >= allProductData.length) {
    document.getElementById('load-more-btn').style.display = 'none';
  }
}

// Fungsi untuk menampilkan produk awal
function tampilkanProduk(data, idElement) {
  const container = document.getElementById(idElement);
  container.innerHTML = '';
  data.forEach(p => {
    container.innerHTML += `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card product-card h-100">
          <img src="${p['Image URL']}"
               alt="Produk Eiger ${p['Merchant Product Name']} untuk adventure"
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
