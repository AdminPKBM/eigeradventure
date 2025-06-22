<body>
  <section id="product-container" class="container"></section>
  <script>
    async function loadJSON() {
      const r = await fetch('products.json');
      return r.json();
    }
    function render(products){
      const c = document.getElementById('product-container');
      products.forEach(p => {
        const a = document.createElement('a');
        a.href = 'https://atid.me/004vll0019tc';
        a.target = '_blank';
        a.className = 'card';
        a.innerHTML = `
          <img src="${p.img}" alt="${p.title}">
          <div class="card-body">
            <h2 class="card-title">${p.title}</h2>
            <p class="card-desc">${p.desc}</p>
            <div class="btn">Lihat Produk</div>
          </div>`;
        c.appendChild(a);
      });
    }
    loadJSON().then(render);
  </script>
</body>
