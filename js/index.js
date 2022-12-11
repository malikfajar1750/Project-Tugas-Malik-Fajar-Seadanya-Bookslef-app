document.addEventListener('DOMContentLoaded', function() {
    const submitBtn  = document.querySelector('#bookform');
    submitBtn.addEventListener('submit', function(e) {
        e.preventDefault();
        addBook();
    });

    if (apakahAdaStorage()) {
        loadDataDariStorage();
      }
});

var addBook = function() {
    var idBuku = buatID();
    var judulbuku = document.querySelector('#judulBuku').value;
    var penulisbuku = document.querySelector('#namapenulis').value;
    var namatahun = document.querySelector('#namatahun').value;
    let apakahSelesaiDibaca = document.querySelector('#bookInputIsFinished').checked;

    if(apakahSelesaiDibaca === true) {
        apakahSelesaiDibaca = true;
    }else {
        apakahSelesaiDibaca = false;
    }

    const bookObject = objekBuku(idBuku, judulbuku, penulisbuku, namatahun,apakahSelesaiDibaca);
    arrayBuku.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanBuku();
}

const buatID = function() {
    return +new Date();
}

const objekBuku = function(idBuku, judulbuku, penulisbuku, namatahun, apakahSelesaiDibaca) {
    return {
        idBuku,
        judulbuku,
        penulisbuku,
        namatahun,
        apakahSelesaiDibaca
    }
}

const arrayBuku = [];
const RENDER_EVENT = 'book-event';
document.addEventListener(RENDER_EVENT, function() {
    console.log(arrayBuku);
});

const buatBuku = function(bookObject) {
    const buatJudulBuku = document.createElement('h2');
    const buatPenulisBuku = document.createElement('p');
    const buatTahunBuku = document.createElement('p');
    const buttonsWrapper = document.createElement('div');
    const container = document.createElement('article');

    buatJudulBuku.innerHTML = bookObject.judulbuku;
    buatPenulisBuku.innerHTML = 'Penulis : ' + bookObject.penulisbuku;
    buatTahunBuku.innerHTML = 'Tahun : ' + bookObject.namatahun;

    buttonsWrapper.classList.add('buttons');
    container.classList.add('book-item');

    if(bookObject.apakahSelesaiDibaca) {
        const unfinishedButton = document.createElement('bookbutton');
        const deleteButton = document.createElement('button');

        unfinishedButton.classList.add('finished');
        unfinishedButton.innerHTML = 'Belum dibaca';
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = 'Hapus buku';

        unfinishedButton.addEventListener('click', function() {
            bukuBelumSelesaiDibaca(bookObject.idBuku);
        });

        deleteButton.addEventListener('click', function() {
            deleteBook(bookObject.idBuku);
        });

        buttonsWrapper.append(unfinishedButton, deleteButton);
    }else {
        const finishedButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        finishedButton.classList.add('finished');
        finishedButton.innerHTML = 'Sudah dibaca';
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = 'Hapus buku';

        finishedButton.addEventListener('click', function() {
            bukuSelesaiDibaca(bookObject.idBuku);
        });

        deleteButton.addEventListener('click', function() {
            deleteBook(bookObject.idBuku);
        });

        buttonsWrapper.append(finishedButton, deleteButton);
    }

    container.append(buatJudulBuku, buatPenulisBuku, buatTahunBuku, buttonsWrapper);
    container.setAttribute('id', bookObject.idBuku);

    return container;
}

document.addEventListener(RENDER_EVENT, function() {
    let belumSelesai = document.querySelector('#bookUnfinishedReadingList');
    let telahSelesai = document.querySelector('#bookFinishedReadingList');

    belumSelesai.innerHTML = '';
    telahSelesai.innerHTML = '';
    
    for(let book of arrayBuku) {
        let makeBook = buatBuku(book);

        if(!book.apakahSelesaiDibaca) {
            belumSelesai.append(makeBook);
        }else {
            telahSelesai.append(makeBook);
        }
    }
});

const searchBook = function(bukuID) {
    for(let book of arrayBuku) {
        if(book.idBuku === bukuID) {
            return book;
        }
    }
}

const searchBookIndex = function(bukuID) {
    for(let i in arrayBuku) {
        if(arrayBuku[i].idBuku === bukuID) {
            return i;
        }
    }
    return -1;
}

const bukuSelesaiDibaca = function(bukuID) {
    const bookTarget = searchBook(bukuID);

    if(bookTarget == null) return;

    bookTarget.apakahSelesaiDibaca = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanBuku();
}

const bukuBelumSelesaiDibaca = function(bukuID) {
    const bookTarget = searchBook(bukuID);

    if(bookTarget == null) return;

    bookTarget.apakahSelesaiDibaca = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanBuku();
}

const deleteBook = function(bukuID) {
    const bookTarget = searchBookIndex(bukuID);

    if(bookTarget == -1) return;

    arrayBuku.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanBuku();
}

function simpanBuku() {
    if (apakahAdaStorage()) {
      const parsed = JSON.stringify(arrayBuku);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
}
  
  const SAVED_EVENT = 'saved-book';
  const STORAGE_KEY = 'BOOKSHELF_APPS';
   
  function apakahAdaStorage() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}
  
  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
  
  function loadDataDariStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const buku of data) {
        arrayBuku.push(buku);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

