window.onload = () => {
  
  let tasks = [];
  
  const content = document.querySelector('.content');
  const modal = document.querySelector('.modal-title');
  const inputTitle = document.querySelector('.input-title');
  const inputDescription = document.querySelector('.input-description');
  
  function loadData() {
    // bersihkan isi dari element "content"
    content.innerHTML = '';
    // ambil data dari localstorage
    const data = localStorage.getItem('notes-app');
    /*
      jika ada data di localstorage, maka ganti isi dari variabel
      "tasks" menjadi data yang sudah diparsing menjadi JSON dari variabel
      "data". tapi jika tidak ada, maka ganti isi variabel "tasks" menjadi 
      sebuah array kosong
    */
    tasks = (data) ? JSON.parse(data) : [];
    /*
      looping variabel "tasks", lalu beri nama callbacknya 
      sebagai "task", lalu jalankan fungsi updateUI()
    */
    tasks.forEach((task, index) => updateUI(task, index));
  }
  
  loadData();
  
  window.addEventListener('click', e => {
    // jika element yang ditekan memiliki class "btn-modal"
    if (e.target.classList.contains('btn-modal')) {
      // ambil isi dari atribut "data-type" dari element yang ditekan
      const type = e.target.dataset.type.trim().toLowerCase();
      // set judul modal dengan isi dari variabel "type"
      modal.textContent = `modal ${type} data`;
      /*
        jika judul modal ada tulisan "add", maka jalankan fungsi
        clearValue() guna untuk membersihkan value input
      */
      if (modal.textContent.includes('add')) clearValue();
    }
  });
  
  function clearValue() {
    // bwrsihkan semua value input
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => form.reset());
  }
  
  // ketika tombol submit ditekan, jalankan fungsi addData()
  const btnSubmit = document.querySelector('.btn-submit');
  btnSubmit.addEventListener('click', addData);
  
  function addData() {
    /*
      cek judul modal terlebih dahulu, jika judul modal
      ada tulisan "add", maka jalankan perintah kode dibawahnya
    */
    if (modal.textContent.includes('add')) {
      // value input
      const data = getInputValues();
      // lakukan validasi terlebih dahulu ke setiap input
      if (validate(data) == true) {
        // push objek dari variabel "data" kedalam variabel "tasks"
        tasks.unshift(data);
        // simpan kedalam localstorage
        saveToLocalStorage();
        // jalankan fungsi loadData()
        loadData();
        // tampilkan pesan bahwa "data berhasil ditambahkan"
        alerts('success', 'Data has been added!');
        // bersihkan value input 
        clearValue();
      }
    }
  }
  
  function getInputValues() {
    return {
      title: inputTitle.value.trim(),
      description: inputDescription.value.trim()
    };
  }
  
  function validate({ title, description }) {
    // jika semua input masih kosong
    if (!title && !description) return alerts('error', 'field`s was empty!');
    // jika masih ada input yang masih kosong
    if (!title || !description) return alerts('error', 'field was empty!');
    // jika panjang karakter di input "title" terlalu pendek
    if (title.length < 3) return alerts('error', 'title must be more then 3 character!');
    // jika panjang karakter di input "description" terlalu pendek
    if (description.length < 8) return alerts('error', 'description must be more then 8 character!');
    // jika panjang karakter di input "title" terlalu panjang
    if (title.length > 100) return alerts('error', 'title must be less then 100 character!');
    // jika panjang karakter di input "description" terlalu panjang
    if (description.length > 200) return alerts('error', 'description must be less then 200 character!');
    // jika berhasil melewati semua validasi, maka kembalikan nilai berupa boolean "true"
    return true;
  }
  
  function alerts(icon, text) {
    // plugin dari "sweetalert2"
    swal.fire ({
      icon: icon,
      title: 'Alert',
      text: text
    });
  } 
  
  function saveToLocalStorage() {
    /*
      simpan isi array dari variabel "tasks" kedalam localstorage.
      nantinya isi variabel "tasks" akan diparsing menjadi sebuah 
      string JSON dengan menjalankan fungsi JSON.stringify()
    */
    localStorage.setItem('notes-app', JSON.stringify(tasks));
  }
  
  function updateUI(param, index) {
    // render element dengan menjalankan fungsi renderElement()
    const result = renderElement(param, index);
    // tampilkan element yang sudah dirender ke halaman
    content.insertAdjacentHTML('beforeend', result);
  }
  
  function renderElement({ title, description }, index) {
    return `
    <div class="col-md-6">
      <div class="bg-white p-4 rounded-0 shadow my-2">
        <h3 class="fw-normal">${title}</h3>
        <p class="mb-3 fw-light">${description}</p>
        <button 
          class="btn btn-success rounded-0 btn-edit btn-modal me-1"
          data-id="${index}"
          data-type="edit"
          data-bs-toggle="modal"
          data-bs-target="#modalBox">
          Edit
        </button>
        <button 
          class="btn btn-danger rounded-0 btn-delete"
          data-id="${index}">
          Delete
        </button>
      </div>
    </div>
    `;
  }
  
  // edit atau ubah data
  window.addEventListener('click', e => {
    // jika element yang ditekan memiliki class "btn-edit"
    if (e.target.classList.contains('btn-edit')) {
      // dapatkan isi dari atribut "data-id" pada element yang ditekan
      const id = e.target.dataset.id;
      // jalankan fungsi setValue()
      setValue(tasks[id]);
      // jalankan fungsi editData()
      editData(id);
    }
  });
  
  function setValue(param) {
    // set value tiap input 
    inputTitle.value = param.title;
    inputDescription.value = param.description;
  }
  
  function editData(id) {
    // ketika tombol submit ditekan
    btnSubmit.addEventListener('click', () => {
      /*
        cek judul modal terlebih dahulu, jika judul modal
        ada tulisan "edit", maka jalankan perintah kode dibawahnya
      */
      if (modal.textContent.includes('edit')) {
        // value input
        const data = getInputValues();
        // validasi terlebih dahulu ke setiap input
        if (validate(data)) {
          /*
            ubah isi array di index yang diambil dari isi variabel "id"
            dengan value dari "input title" dan "input description"
          */
          tasks[id] = data;
          // simpan kedalam localstorage 
          saveToLocalStorage();
          // berikan pesan bahwa "data berhasil diubah atau diedit"
          alerts('success', 'Data has been updated!');
          // jalankan fungai loadData()
          loadData();
          /*
            jadikan parameter "id" sebagai "null"
            supaya tidak menduplikat data lainnya
          */
          id = null;
        }
      }
    });
  }
  
  // hapus data
  window.addEventListener('click', e => {
    // jika elememt yang ditekan memiliki class "btn-delete"
    if (e.target.classList.contains('btn-delete')) {
      // dapatkan isi dari atribut "data-id" dari element yang diteka
      const id = e.target.dataset.id;
      // plugin dari "sweetalert2"
      swal.fire ({
        icon: 'info',
        text: 'do you want to delete this data?',
        showCancelButton: true
      })
      .then(response => {
        /*
          jika menekan tombol "ok" atau "yes", maka jalankan fungsi
          deleteData() dengan mengirimkan id ke fungsi tersebut
        */
        if (response.isConfirmed) deleteData(id);
      });
    }
  });
  
  function deleteData(id) {
    // hapus array dengan index "id"
    tasks.splice(id, 1);
    // simpan pwrubahannya kedalam localstorage
    saveToLocalStorage();
    // beri pesan bahwa "data berhasil dihapus"
    alerts('success', 'Data has been deleted!');
    // jalankan fungsi loadData()
    loadData();
  }
  
  // pencarian data
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('keyup', function() {
    // valuw input pencarian
    const value = this.value.trim().toLowerCase();
    /*
      konversikan yang tadinya berupa "Nodelist" menjadi sebuah
      "array". supaya bisa dilooping 
    */
    const result = Array.from(content.children);
    result.forEach(data => {
      // ambil value dari callback "data" dan ubah semuanya menjadi huruf kecil
      const str = data.textContent.toLowerCase();
      /*
        jika ada data yang serupa dengan isi input pencarian maka tampilkan
        data twrsebut. tapi jika tidak serupa dengan isi input pencarian,
        maka sembunyikan data twrsebut. jadinya nanti data yang tampil hanyalah
        yang serupa dengan isi input pencarian.
      */
      data.style.display = (str.indexOf(value) != -1) ? '' : 'none';
    });
  });
  
  // hapus semua data
  const btnAll = document.querySelector('.btn-all');
  btnAll.addEventListener('click', () => {
    // plugin dari "sweetalert2"
    swal.fire ({
      icon: 'info',
      text: 'do you want to delete all data?',
      showCancelButton: true
    })
    .then(response => {
      // jika tombol yang ditekan bertuliskan "ok" atau "yes"
      if (response.isConfirmed) {
        // ubah isi variabel "tasks" menjadi array kosong
        tasks = [];
        // simpan perubahannya kedalam localstorage
        saveToLocalStorage();
        // beri pesan bahwa "semua data berhasil dihapus"
        alerts('success', 'All data has been deleted!');
        // jalankan fungsi loadData()
        loadData();
      }
    });
  });
  
}