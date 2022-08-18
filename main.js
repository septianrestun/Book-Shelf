const books = [];
const RENDER_EVENT = "render-books";
const STORAGE_KEY = "BOOKS_APPS";

// memeriksa storage

function isStorageExist() {
    if(typeof(Storage) === undefined){
        alert("Browser Kamu Tidak Mendukung Web Storage")
        return false;
    }
    return true;
}

// menampilkan data
document.addEventListener(RENDER_EVENT, function(){
    const belumBaca = document.getElementById("incompleteBookshelfList");
    belumBaca.innerHTML = "";

    const sudahBaca = document.getElementById("completeBookshelfList");
    sudahBaca.innerHTML = "";

    for(const bookItem of books){
        const bookElement = makeBook(bookItem);
        if(!bookItem.isComplete){
            belumBaca.append(bookElement);
        } else {
            sudahBaca.append(bookElement);
        }
    }
});


// mengubah inner Text Button Simpan
function changeSpan (){
    const checkBaca = document.getElementById("inputBookIsComplete");
    const changeWord = document.getElementById("mySpan");
    checkBaca.addEventListener("change", function(){
        if(checkBaca.checked){
            changeWord.innerText = "Sudah selesai dibaca"
        } else {
            changeWord.innerText = "Belum selesai dibaca"
        }
    });
 }

function loadDatafromStorage(){
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if(data !== null){
        for(const item of data){
            books.push(item);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));

}

// simpan data
function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        
    }
}

// pindah data
function moveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        
    }
}

// hapus data

function deleteData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        
    }
}

// reset form
function resetData() {
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
  
    document.getElementById("searchBookTitle").value = "";
  }

// addBooks
function addBooks(){
    const title = document.getElementById("inputBookTitle");
    const author = document.getElementById("inputBookAuthor");
    const year = document.getElementById("inputBookYear");
    const isCompleted = document.getElementById("inputBookIsComplete");
    
    let statusBook;

    if(isCompleted.checked){
        statusBook = true;
    } else {
        statusBook = false;
    }

    books.push({
        id: +new Date(),
        title: title.value,
        author: author.value,
        year: Number(year.value),
        isComplete: statusBook,
    });

    resetData();

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}



// membuat element list buku

function makeBook(bookObject){

    const title = document.createElement("h2");
    title.classList.add("item-title");
    title.innerHTML = `${bookObject.title}`;

    const author = document.createElement("p");
    author.classList.add("item-author");
    author.innerHTML = `Author : ${bookObject.author}`;

    const year = document.createElement("p");
    year.classList.add("item-year");
    year.innerHTML = `Tahun: ${bookObject.year}`;

    const descContainer = document.createElement("div");
    descContainer.classList.add("deskripsi-buku");
    descContainer.append(title, author, year);

    const container = document.createElement("div");
    container.classList.add("item");
    container.append(descContainer);
    container.setAttribute("id", `book-${bookObject.id}`);


    if(bookObject.isComplete){
        const returnBtn = document.createElement("button");
        returnBtn.classList.add("data-back");
        returnBtn.innerText = "Belum Baca";

        returnBtn.addEventListener("click", function(){
            returnBookFromFinish(bookObject.id)
        })

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("data-delete");
        deleteBtn.innerText = "Hapus";

        deleteBtn.addEventListener("click", function(){
            deleteBook(bookObject.id);
        });

        descContainer.append(returnBtn, deleteBtn);
        container.append(descContainer);
    } else {
        const finishBtn = document.createElement("button");
        finishBtn.classList.add("data-read");
        finishBtn.innerText = "Selesai Baca";

        finishBtn.addEventListener("click", function(){
            finishBook(bookObject.id);
        });


        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("data-delete");
        deleteBtn.innerText = "Hapus";

        deleteBtn.addEventListener("click", function(){
            deleteBook(bookObject.id);
        });

        descContainer.append(finishBtn, deleteBtn);
        container.append(descContainer);
    }

    return container;
}


function finishBook(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
}

function returnBookFromFinish(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
}

function deleteBook(bookId) {
    
    const dataDelete = confirm("Apakah anda yakin ingin menghapus data?")
    if(dataDelete){
        const bookTarget = findBookIndex(bookId);

        if(bookTarget === -1) return;
    
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        deleteData();
    }

}


function findBook(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for(const i in books){
        if(books[i].id === bookId){
            return i;
        }
    }
    return -1;
}


document.addEventListener("DOMContentLoaded" , function(){
    if(isStorageExist()){
        loadDatafromStorage();
    }

    const simpanForm = document.getElementById("inputBook");
    simpanForm.addEventListener("submit", function(event){
        event.preventDefault();
        addBooks();
    });


    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", function(event){
        event.preventDefault();
        searchBooks();
    });

});

document.addEventListener("DOMContentLoaded", function(){
    changeSpan();
})


// mencari data

function searchBooks(){
    const searchInput = document.getElementById("searchBookTitle").value;
    const bookItems = document.getElementsByClassName("item");

    for(book of bookItems){
        const findTitle = searchInput.toLowerCase();

        if(book.innerText.toLowerCase().includes(findTitle)){
            book.parentElement.style.display = "block";
        } else {
            book.parentElement.style.display = "none";
            alert("Data Tidak Ditemukan");
        }
    }
    resetData();
}