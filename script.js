// --------------------------------------------
//              GET DOM ELEMENTS
// --------------------------------------------

let dom_booksDiv = document.querySelector('#books-div');
// Library Info Pane
let dom_amountBooks = document.querySelector('#amount-books');
let dom_amountBooksFinished = document.querySelector('#amount-books-finished');
let dom_pagesRead = document.querySelector('#amount-pages-read');

// Add Book Button
const dom_addBookBtn = document.querySelector("#add-book-div");

// Form
const dom_formDialog = document.querySelector("#form-dialog");
const dom_form = document.querySelector("#form");
const dom_formTitleInput = document.querySelector("#form-title");
const dom_formAuthorInput = document.querySelector("#form-author");
const dom_formPagesInput = document.querySelector("#form-pages");
const dom_formReadInput = document.querySelector("#form-read");
const dom_formSubmitBtn = document.querySelector("#form-submit-btn");
const dom_formCancelBtn = document.querySelector("#form-cancel-btn");

// Helper Functions

// copied
function helper_findIndexInParent(node) {
    let parent = node.parentNode;
    if (parent) {
        let children = parent.childNodes;
        for (let i = 0; i < children.length; i++) {
            if (children[i] === node) {
                return i;
            }
        }
    }
    return -1; // Not found
}

// --------------------------------------------
//                  GLOBALS
// --------------------------------------------

// Editing

let g_editMode = false;
let g_currEditEvent = null;

// --------------------------------------------
//                BOOK OBJECT
// --------------------------------------------

// BOOK

class Book {
  
    constructor(title, author, pages, read = false) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
  
    getInfo = () => {
        return `title: ${this.title}, author: ${this.author}, pages: ${this.pages}, read: ${this.read}`;
    }
  
}

// --------------------------------------------
//                LIBRARY OBJECT
// --------------------------------------------

// Assumes books can have the same info (can have books with the same title and such)

class Library {

    booksArr = [];
    totalBooks = 0;
    totalRead = 0;
    totalPagesRead = 0;
  
    constructor() {}
  
    getTotalBooks = () => {
        return this.totalBooks;
    }

    getTotalRead = () => {
        return this.totalRead;
    }

    getTotalPagesRead = () => {
        return this.totalPagesRead;
    }

    #setDomLibraryInfo() {
        dom_amountBooks.textContent = this.getTotalBooks().toString(10);
        dom_amountBooksFinished.textContent = this.getTotalRead().toString(10);
        dom_pagesRead.textContent = this.getTotalPagesRead().toString(10);
    }

    resetAllInfo = () => {
        this.totalBooks = 0;
        this.totalRead = 0;
        this.totalPagesRead = 0;
        this.#setDomLibraryInfo();
    }

    printBooks = () => {
        console.log(this.booksArr);
    }

    addBook = (book) => {
        this.booksArr.push(book);
        this.totalBooks++;
        if (book.read) {
            this.totalRead++;
            this.totalPagesRead += Number(book.pages);
        }
        this.#setDomLibraryInfo();
    }

    toggleRead = (index) => {
        if (index >= this.booksArr.length || index < 0) return;
        let book = this.booksArr[index];
        let mult;
        book.read ? mult = -1 : mult = 1;
        this.totalRead += mult;
        this.totalPagesRead += mult*Number(book.pages);
        this.booksArr[index].read = !this.booksArr[index].read;
        this.#setDomLibraryInfo();
    }

    getBookAt = (index) => {
        if (index >= this.booksArr.length || index < 0) return;
        return this.booksArr[index];
    }

    removeBookAt = (index) => {
        if (index >= this.booksArr.length || index < 0) return;
        this.totalBooks--;
        let book = this.booksArr[index];
        if (book.read) {
            this.totalRead--;
            this.totalPagesRead -= book.pages;
        }
        this.booksArr.splice(index, 1);
        this.#setDomLibraryInfo();
    }

    getBooksArr = () => {
        return this.booksArr;
    }
  
}


// GLOBAL
let library = new Library();

// --------------------------------------------
//                   DEMO
// --------------------------------------------

let demo_book1 = new Book("The Catcher In The Rye", "J.D Salinger", 234, true);
let demo_book2 = new Book("Norwegian Wood", "Haruki Murakami", 386, false);

library.addBook(demo_book1);
library.addBook(demo_book2);

library.printBooks();


// --------------------------------------------
//           BOOK'S EVENT LISTENERS
// --------------------------------------------

function helper_getIndexBookFromEvent(event) {
    let book = event.target.closest('.book-div');
    return helper_findIndexInParent(book);
}

function toggleSwitched(event) {
    let index = helper_getIndexBookFromEvent(event);
    library.toggleRead(index);
}

function eraseBook(event) {
    let book = event.target.closest('.book-div');
    let index = helper_getIndexBookFromEvent(event);
    console.log("books before: ");
    library.printBooks();

    library.removeBookAt(index);
    book.parentNode.removeChild(book);

    console.log("books left: ");
    library.printBooks();
}

function editBook(event) {
    console.log("editing");
    dom_formDialog.showModal();
    let indexArr = helper_getIndexBookFromEvent(event);
    let bookObj = library.getBookAt(indexArr);
    dom_formTitleInput.value = bookObj.title;
    dom_formAuthorInput.value = bookObj.author;
    dom_formPagesInput.value = bookObj.pages;
    dom_formReadInput.checked = bookObj.read;
    g_editMode = true;
    g_currEditEvent = event;
}


// --------------------------------------------
//              BOOK DOM CREATION
// --------------------------------------------

// ---- HELPERS
// (Look below for the main one: createBookNode(book))

function createBookInfoDiv_aux(type, text) {
    let bookInfo = document.createElement('h3');
    bookInfo.className = "book-"+type;
    bookInfo.textContent = text;
    return bookInfo;
}

function createBookInfoDiv(book) {
    let bookInfoDiv = document.createElement('div');
    bookInfoDiv.className = 'book-info-div';
    // Book Title
    bookInfoDiv.appendChild(createBookInfoDiv_aux("title", book.title));
    // Book Author
    bookInfoDiv.appendChild(createBookInfoDiv_aux("author", "By: " + book.author));
    // Book Pages
    bookInfoDiv.appendChild(createBookInfoDiv_aux("pages", "Number of pages: " + book.pages));
    // Return
    return bookInfoDiv;
}

function createBookButtons_aux(name) {
    let bookButton = document.createElement('img');
    bookButton.className = 'book-button-' + name;
    bookButton.classList.add('book-button');
    bookButton.setAttribute('alt', name);
    bookButton.setAttribute('src', "./assets/" + name + ".svg");
    return bookButton;
}

function createBookButtons(book) {
    let bookButtonsDiv = document.createElement('div');
    bookButtonsDiv.className = 'book-buttons-div';
    // Book Button Erase
    let eraseNode = createBookButtons_aux("erase");
    eraseNode.addEventListener("click", (event) => eraseBook(event) );
    bookButtonsDiv.appendChild(eraseNode);
    // Book Button Edit
    let editNode = createBookButtons_aux("edit");
    editNode.addEventListener("click", (event) => editBook(event) );
    bookButtonsDiv.appendChild(editNode);
    // Return
    return bookButtonsDiv;
}

function createBookReadToggleDiv(book) {
    let bookReadToggleDiv = document.createElement('div');
    bookReadToggleDiv.className = 'book-read-toggle-div';
    // Toggle Label
    let label = document.createElement('label');
    label.className = 'switch';
    // Toggle Input
    let input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    if (book.read) {
        input.setAttribute('checked', 'false');
    }
    input.addEventListener("click", (event) => toggleSwitched(event) );
    // Toggle Span
    let span = document.createElement('span');
    span.className = 'slider round';
    // Appending
    label.appendChild(input);
    label.appendChild(span);
    bookReadToggleDiv.appendChild(label);
    // Return
    return bookReadToggleDiv;
}

// ---- MAIN
// Best only called from addBookToLibrary (because will make sure to update library info)

function createBookNode(book) {
    console.log("Creating Book: " + book);
    // Book Div
    let bookDiv = document.createElement('div');
    bookDiv.className = 'book-div';
    // Append: Book Info Div
    bookDiv.appendChild(createBookInfoDiv(book));
    // Append: Book Buttons Div
    bookDiv.appendChild(createBookButtons(book));
    // Append: Book Read Toggle Div
    bookDiv.appendChild(createBookReadToggleDiv(book));
    // Return
    return bookDiv;
}

// --------------------------------------------
//             ADD BOOK TO DOM
// --------------------------------------------

function addBookToDom(book) {
    let bookNode = createBookNode(book);
    dom_booksDiv.appendChild(bookNode);
}

function addBookToLibrary(book) {
    addBookToDom(book);
    library.addBook(book);
}

// --------------------------------------------
//            FORM'S EVENT LISTENERS
// --------------------------------------------

dom_addBookBtn.addEventListener("click", () => {
    dom_formDialog.showModal();
    g_editMode = false;
});

dom_formCancelBtn.addEventListener('click', (event) => {
    console.log("cancel");
    dom_formTitleInput.removeAttribute("required");
    dom_formAuthorInput.removeAttribute("required");
    dom_formDialog.close();
    g_editMode = false;
});

dom_form.addEventListener('submit', (event) => {
    if (event.submitter == dom_formSubmitBtn) {
        // Get Values
        let title = dom_formTitleInput.value;
        let author = dom_formAuthorInput.value;
        let pages = dom_formPagesInput.value;
        let read = dom_formReadInput.checked;
        console.log(`title: ${title}, author: ${author}, pages: ${pages}, read: ${read}`);
        let book = new Book(title, author, pages, read);

        if (g_editMode) {
            // EDIT EXISTING BOOK
            eraseBook(g_currEditEvent);
        } 

        // ADD NEW BOOK
        addBookToLibrary(book);
        
        console.log("submitted");

    } else {
        console.log("cancelled");
    }

});

// --------------------------------------------
//             RE-RENDER ALL BOOKS
// --------------------------------------------

function deleteFromDomAllBooks() {
    while (dom_booksDiv.firstChild) {
        dom_booksDiv.removeChild(dom_booksDiv.firstChild);
    }
}

function reRenderAllBooks() {
    deleteFromDomAllBooks();
    let booksArr = library.getBooksArr();
    for (let index in booksArr) {
        addBookToDom(booksArr[index]);
    }
}

// --------------------------------------------
//                    INIT
// --------------------------------------------

reRenderAllBooks();




