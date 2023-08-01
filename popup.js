// 创建好的数据库
var db = null;
// 打开文件方法
function openFile(e) {
    let bookName = '1';
    if (e.target.files.length > 0) {
        bookName = e.target.files[0].name
    }
    var reader = new FileReader();
    reader.onload = function (book) {
        console.log(book);
        putBookInDb(book.target.result, bookName);

    };
    reader.readAsArrayBuffer(e.target.files[0]);
}
// 储存书本方法
function putBookInDb(data, name) {
    console.log("Putting elephants in IndexedDB");

    // Open a transaction to the database
    var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
    var transaction = db.transaction(["elephants"], readWriteMode);

    // Put the blob into the dabase
    var put = transaction.objectStore("elephants").put({ 'bookName': name, 'bookData': data });
    window.open('readPage.html?' + name);

};
// 读取书本列表
function getBookList() {
    var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
    var transaction = db.transaction(["elephants"], readWriteMode);
    transaction.objectStore("elephants").getAll().onsuccess = function (event) {
        console.log(event.target.result);
        // render book list.
        var html = "";
        event.target.result.forEach(e => {
            if (e.title) {
                html = html + "<li data-bookname='" + e.bookName + "'><div class='bookItem'><div><strong>" + e.title +
                    "</strong><span class='author'>" + e.creator +
                    "</span></div></div></li>";
            }
        });
        document.getElementById("bookList").innerHTML = html;
        let liGroup = document.getElementsByTagName("li");
        for (let index = 0; index < liGroup.length; index++) {
            liGroup.item(index).addEventListener('click', function (e) {
                window.open('readPage.html?' + this.dataset.bookname);
            });
        }
    };
}
// 页面初始化方法
(function () {
    var theOpenBtn = document.getElementById("theOpenBtn");
    var fileReader = document.getElementById("fileReader");

    theOpenBtn.addEventListener('click', function (e) {
        document.getElementById("fileReader").click();
    });
    fileReader.addEventListener('change', function (e) {
        openFile(e);
    });

    // IndexedDB
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
        dbVersion = 1;

    // Create/open database
    var request = indexedDB.open("elephantFiles", dbVersion),
        createObjectStore = function (dataBase) {
            // Create an objectStore
            console.log("Creating objectStore")
            dataBase.createObjectStore("elephants", { keyPath: 'bookName' });
        };


    request.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
    };

    request.onsuccess = function (event) {
        console.log("Success creating/accessing IndexedDB database");
        db = request.result;
        // recall the method of getting books.
        getBookList();
        db.onerror = function (event) {
            console.log("Error creating/accessing IndexedDB database");
        };
    }

    // For future use. Currently only in latest Firefox versions
    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
    };
})();