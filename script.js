// --------------------------------------------
//              GET DOM ELEMENTS
// --------------------------------------------

let dom_booksDiv = document.querySelector('#books-div');

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
//              BOOK DOM CREATION
// --------------------------------------------

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
}

function populateBooks() {
    for (let index in booksArr) {
        let bookNode = createBookNode(booksArr[index]);
        dom_booksDiv.appendChild(bookNode);
    }
}

function reRenderAllBooks() {
    deleteFromDomAllBooks();
    populateBooks();
}


// --------------------------------------------
//                    INIT
// --------------------------------------------

reRenderAllBooks();