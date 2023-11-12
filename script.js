// --------------------------------------------
//              GET DOM ELEMENTS
// --------------------------------------------

let dom_booksDiv = document.querySelector('#books-div');
// Library Info Pane
let dom_amountBooks = document.querySelector('#amount-books');
let dom_amountBooksFinished = document.querySelector('#amount-books-finished');
let dom_pagesRead = document.querySelector('#amount-pages-read');

// --------------------------------------------
//                 BOOKS INIT
// --------------------------------------------

// Info

let g_amountBooks = 0;
let g_amountBooksFinished = 0;
let g_pagesRead = 12;

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
//              EDIT LIBRARY INFO
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
//           TOGGLE'S EVENT LISTENER
// --------------------------------------------

function toggleSwitched(event, pages) {
    console.log("Toggled");
    let mult;
    event.target.checked ? mult =1 : mult = -1;
    addToAmountBooksFinished(mult);
    addToPagesRead(mult*pages);
}

// --------------------------------------------
//              BOOK DOM CREATION
// --------------------------------------------

// ---- HELPER

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

function createBookButtons() {
    let bookButtonsDiv = document.createElement('div');
    bookButtonsDiv.className = 'book-buttons-div';
    // Book Button Erase
    bookButtonsDiv.appendChild(createBookButtons_aux("erase"));
    // Book Button Edit
    bookButtonsDiv.appendChild(createBookButtons_aux("edit"));
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
    input.addEventListener("click", (event) => toggleSwitched(event, book.pages) );
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

function createBookNode(book) {
    console.log("Creating Book: " + book);
    // Book Div
    let bookDiv = document.createElement('div');
    bookDiv.className = 'book-div';
    // Append: Book Info Div
    bookDiv.appendChild(createBookInfoDiv(book));
    // Append: Book Buttons Div
    bookDiv.appendChild(createBookButtons());
    // Append: Book Read Toggle Div
    bookDiv.appendChild(createBookReadToggleDiv(book));
    // Return
    return bookDiv;
}



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
        let bookNode = createBookNode(booksArr[index]);
        dom_booksDiv.appendChild(bookNode);
        // Edit Library Info
        addToAmountBooks();
        if (booksArr[index].read) {
            addToAmountBooksFinished();
            addToPagesRead(booksArr[index].pages);
        }

    }
}


// --------------------------------------------
//                    INIT
// --------------------------------------------

reRenderAllBooks();




