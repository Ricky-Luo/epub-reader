// 初始渲染方法
var book = ePub();
var rendition;
let bookName = ''; //The name of opened book.
var db = null; // The object of indexedDB.
var imgFile = null;
(function () {
    // Get the book name.
    let index = window.location.href.indexOf('?');
    bookName = decodeURI(window.location.href.slice(index + 1, window.location.href.length));


    // Retrieve the file that was just stored
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
        dbVersion = 1;
    // open database
    var request = indexedDB.open("elephantFiles", dbVersion);
    request.onerror = function (event) {
    };

    // the recall method of open success.
    request.onsuccess = function (event) {
        db = request.result;
        db.onerror = function (event) {
            console.log("Error creating/accessing IndexedDB database");
        };
        var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
        var transaction = db.transaction(["elephants"], readWriteMode);
        transaction.objectStore("elephants").get(bookName).onsuccess = function (event) {
            imgFile = event.target.result;
            if (imgFile) {
                console.log(imgFile);
                openBook(imgFile.bookData);
                document.getElementById("navContainerParent").style.display = "block";
            }
        };
    }
    // 绑定获取导航方法
    book.loaded.navigation.then(function (toc) {
        dealNavigation(toc)
    });
    // 动态调整书本高度
    document.getElementById("viewContainer").style.height = document.body.offsetHeight * 0.9 + 'px';
    document.getElementById("viewContainer").style.marginTop = (document.body.offsetHeight * 0.025) + 'px';
    // bond click event to all click-element
    document.getElementById("toggleNav").
        addEventListener('click', function (e) {
            toggleNav(e);
        });
    document.body.addEventListener('resize', function (e) {
        console.log('1231231');
        document.getElementById("viewContainer").style.marginLeft = ((document.body.offsetWidth - 800) / 2) + 'px';
    })
})();

// 打开书籍动作
function openBook(e) {
    var bookData = e;
    var bookTitle = document.getElementById("bookTitle");
    var author = document.getElementById("author");

    book.open(bookData).then(res => {
        bookTitle.textContent = book.package.metadata.title;
        author.textContent = book.package.metadata.creator;
        var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
        var transaction = db.transaction(["elephants"], readWriteMode);
        var put = transaction.objectStore("elephants").put({ 'bookName': bookName, 'bookData': bookData, 'title': book.package.metadata.title, 'creator': book.package.metadata.creator });
    });

    rendition = book.renderTo("viewer", {
        flow: "scrolled-doc",
    });


    displayWithCss();

    // rendition.on("keyup", keyListener);
    // rendition.on("relocated", function (location) {
    // });

    // next.addEventListener("click", function (e) {
    //   rendition.next();
    //   e.preventDefault();
    // }, false);

    // prev.addEventListener("click", function (e) {
    //   rendition.prev();
    //   e.preventDefault();
    // }, false);



    document.addEventListener("keyup", keyListener, false);
}

var keyListener = function (e) {

    // Left Key
    if ((e.keyCode || e.which) == 37) {
        rendition.prev();
    }

    // Right Key
    if ((e.keyCode || e.which) == 39) {
        rendition.next();
    }

};

// 处理目录方法
function dealNavigation(data) {
    let toc = data.toc;
    let tree = [
        // {
        //   "label": "Osinski LLC", "id": "ba98b91f-bad9-4e31-85dc-fdedb745811c", method: 'goThePage', "checked": true, "disabled": true
        // }
    ];
    traverseTree({
        href: '',
        label: '',
        subitems: toc
    }, tree);
    uiTree.draw(document.getElementById('navContainer'), toc);
    // bond click event to li-element by batch.
    var liGroup = document.getElementsByTagName('li');
    for (let index = 0; index < liGroup.length; index++) {
        liGroup.item(index).addEventListener('click', function (e) {
            console.log(this.dataset);
            let id = this.dataset.id;
            let label = this.dataset.label;
            let href = this.dataset.href;
            goThePage(id, label, href);
        });
    }
}

// 遍历单个节点
function traverseNode(node) {
}

// 递归遍历树
function traverseTree(node) {
    if (!node) {
        return;
    }

    traverseNode(node);
    if (node.subitems && node.subitems.length > 0) {
        var i = 0;
        for (i = 0; i < node.subitems.length; i++) {
            this.traverseTree(node.subitems[i]);
        }
    }
}

function goThePage(id, label, href) {
    this.event.stopImmediatePropagation();
    var currentChapter = document.getElementById("currentChapter");
    currentChapter.textContent = label;
    imgFile
    displayWithCss(href);
}

function saveReadingInfo(file, href, scrollPercent) {
    // Open a transaction to the database
    var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
    var transaction = db.transaction(["elephants"], readWriteMode);

    // Put the blob into the dabase
    var put = transaction.objectStore("elephants").put({ 'bookName': name, 'bookData': data });
}
// 切换显示/隐藏导航目录
function toggleNav() {
    let nav = document.getElementById("navContainerParent");
    let marginLeft = nav.style.marginLeft;
    if (marginLeft === "" || marginLeft === '0px' || marginLeft === 'auto') {
        // nav.style.display = "block";
        nav.style.marginLeft = "-395px";

        setTimeout(() => {
            // At this point, get the whole body's width first,then use the width reduce the viewContainer's width and the menu panel's width.
            // console.log();
            if (parseFloat(document.body.offsetWidth - 395 - 800) < 425) {
                document.getElementById("viewContainer").style.marginLeft = '425px';
            }
        }, 200);
    } else {
        nav.style.marginLeft = "0px";
        setTimeout(() => {
            if (document.getElementById("viewContainer").style.marginLeft === "425px") {
                document.getElementById("viewContainer").style.marginLeft = '0px';
                // nav.style.display = "none";
            }
        }, 200);

    }
}
// 监视窗口大小变化
// document.body.οnresize = function () {

// }
// Editing the font style after the content has been displayed.
function displayWithCss(href) {
    rendition.display(href).then(() => {
        rendition.themes.override("font-size", '1.1em');
        rendition.themes.override("word-spacing", '0.1em');
        rendition.themes.override("line-height", '1.4em');
        rendition.themes.override("font-weight", '600');
    })
}
// get the current location of reading proccess, before close the window.
window.onclose = function getCurrent(e) {
    rendition.currentLocation().then(
        (e) => {
            console.log(e);
            alert(e);
        }
    )
}