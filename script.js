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

// Info

let g_amountBooks = 0;
let g_amountBooksFinished = 0;
let g_pagesRead = 12;

// Editing

let g_editMode = false;
let g_currEditEvent = null;

// --------------------------------------------
//                 BOOKS INIT
// --------------------------------------------

// BOOK

function Book(title, author, pages, read = false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.getInfo = function () {
    return `title: ${this.title}, author: ${this.author}, pages: ${this.pages}, read: ${this.read}`;
}

let demo_book1 = new Book("The Catcher In The Rye", "J.D Salinger", 234, true);
let demo_book2 = new Book("Norwegian Wood", "Haruki Murakami", 386, false);

// BOOKS ARRAY

let booksArr = [];

booksArr.push(demo_book1);
booksArr.push(demo_book2);

console.log(booksArr);

// --------------------------------------------
//         EDIT LIBRARY INFO FUNCTIONS
// --------------------------------------------

function setToZeroAllInfo() {
    g_amountBooks = 0;
    g_amountBooksFinished = 0;
    g_pagesRead = 0;
    dom_amountBooks.textContent = "0";
    dom_amountBooksFinished.textContent = "0";
    dom_pagesRead.textContent = "0";
}

function addToAmountBooks(amount = 1) {
    g_amountBooks += amount;
    dom_amountBooks.textContent = g_amountBooks.toString(10);
}

function addToAmountBooksFinished(amount = 1) {
    g_amountBooksFinished += amount;
    dom_amountBooksFinished.textContent = g_amountBooksFinished.toString(10);
}


function addToPagesRead(amount) {
    g_pagesRead += amount;
    dom_pagesRead.textContent = g_pagesRead.toString(10);
}

// --------------------------------------------
//           BOOK'S EVENT LISTENERS
// --------------------------------------------

function toggleSwitched(event) {
    let book = event.target.closest('.book-div');
    let indexArr = helper_findIndexInParent(book);
    let mult;
    booksArr[indexArr].read ? mult =-1 : mult = 1;
    addToAmountBooksFinished(mult);
    addToPagesRead(mult*Number(booksArr[indexArr].pages));
    booksArr[indexArr].read = !booksArr[indexArr].read;
}

function eraseBook_updateLibraryInfo(indexArr) {
    addToAmountBooks(-1);
    if (booksArr[indexArr].read) {
        addToAmountBooksFinished(-1);
        addToPagesRead(-Number(booksArr[indexArr].pages));
    }
}

function eraseBook(event) {
    let book = event.target.closest('.book-div');
    let indexArr = helper_findIndexInParent(book);
    console.log("books before: ", booksArr);
    console.log("book old data: ", booksArr[indexArr]);

    eraseBook_updateLibraryInfo(indexArr);

    book.parentNode.removeChild(book);
    booksArr.splice(indexArr, 1);
    console.log("books left: ", booksArr);
}

function editBook(event) {
    console.log("editing");
    dom_formDialog.showModal();
    let book = event.target.closest('.book-div');
    let indexArr = helper_findIndexInParent(book);
    dom_formTitleInput.value = booksArr[indexArr].title;
    dom_formAuthorInput.value = booksArr[indexArr].author;
    dom_formPagesInput.value = booksArr[indexArr].pages;
    dom_formReadInput.checked = booksArr[indexArr].read;
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

function addBook_updateLibraryInfo(book) {
    addToAmountBooks();
    if (book.read) {
        addToAmountBooksFinished();
        addToPagesRead(Number(book.pages));
    }
}

function addBookToDom(book) {
    let bookNode = createBookNode(book);
    dom_booksDiv.appendChild(bookNode);
    addBook_updateLibraryInfo(book);
}

function addBookToLibrary(book) {
    addBookToDom(book);
    booksArr.push(book);
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
    setToZeroAllInfo();
}

function reRenderAllBooks() {
    deleteFromDomAllBooks();
    for (let index in booksArr) {
        addBookToDom(booksArr[index]);
    }
}

// --------------------------------------------
//                    INIT
// --------------------------------------------

reRenderAllBooks();




