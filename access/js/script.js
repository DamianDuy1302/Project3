const products = document.getElementById("products")
const form = document.querySelector(".searchForm");
const searchInput = document.querySelector(".searchInput")
const prebutton = document.querySelector(".pagination__pre");
const nextbutton = document.querySelector(".pagination__next");
const pagination__current = document.querySelector(".pagination__current")
const query = {
    totalPage: 0,
    input: "",
    limit: 4,
    page: 1,
    sort: "",
    order: "",
    category: "",
};

function hiddenPaginationButton() {
    if (query.page <= 1) {
        prebutton.classList.add("hidden");
    }
    else {
        prebutton.classList.remove("hidden");
    }
    if (query.page >= query.totalPage) {
        nextbutton.classList.add("hidden");
    }
    else {
        nextbutton.classList.remove("hidden");
    }
}


//phan trang
function drawPagination() {
    let stringCategory = "";
    if (query.category) {
        stringCategory = `&category=${query.category}`;
    }
    console.log(stringCategory)
    const api = `http://localhost:3000/products?q=${query.input}&_sort=${query.sort}&_order=${query.order}${stringCategory}`;
    fetch(api)
        .then(function (res) {
            return res.json();
        })
        .then((data) => {
            console.log(data)
            const totalPage = Math.ceil(data.length / query.limit);
            query.totalPage = totalPage;
            console.log(query.totalPage)
            hiddenPaginationButton();
        })
}
//ket thuc phan trang
function renderContent() {

    let stringCategory = "";

    if (query.category) {
        stringCategory = `&category=${query.category}`;
    }
    // console.log(title)
    const api = `http://localhost:3000/products?q=${query.input}&_page=${query.page}
    &_limit=${query.limit}&_sort=${query.sort}&_order=${query.order}${stringCategory}`;
    fetch(api)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            const newData = data.map(function (item) {
                return `
                <li class="product">
                    <div class="product__image">
                        <img src= ${item.thumbnail} alt="">
                    </div>
                    <div class="product__content">
                        <div class="product__title">${item.title}</div>
                        <div class="product__price_and_stock">
                            <div class="product__price">${item.price} "$"</div>
                            <div class="product__stock">Còn lại: ${item.stock}</div>
                        </div>
                    </div>
                    <div class="product__discount">
                    ${item.discountPercentage} %
                </div>
                </li>
                `
            })
            console.log(newData);
            return newData;
        })
        .then(function (data) {
            products.innerHTML = "";
            if (data.length == 0) {
                products.innerHTML = `<div class="not-found">Không tìm thấy sản phẩm<div>`;
            }
            else {
                products.innerHTML = data.join("");

            }
            drawPagination();
        })
}

//tim kiem san pham

function SearchingProduct() {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        // console.log(e);
        query.page = 1;
        query.category = ""
        pagination__current.innerHTML = query.page
        const value = e.target.input.value
        query.input = value;
        console.log(query.input)
        renderContent();
    })
}
//ket thuc tim kiem san pham


const product_selection = document.querySelector("#product__selection")
console.log(product_selection)
function sortProduct() {
    product_selection.addEventListener("change", function () {
        console.log(product_selection.value)
        if (product_selection.value === "asc_price") {
            query.sort = "price";
            query.order = "asc";
            renderContent();
        }
        else if (product_selection.value === "desc_price") {
            query.sort = "price";
            query.order = "desc";
            renderContent();
        }
        else if (product_selection.value === "desc_discount") {
            query.sort = "discountPercentage";
            query.order = "desc";
            renderContent();
        }
        else {
            query.sort = "";
            query.order = "";
            renderContent();
        }

    })
}



//bat su kien cho nut pre va next
nextbutton.addEventListener("click", function () {
    console.log(query.page);
    console.log(query.totalPage)
    if (query.page < query.totalPage) {
        query.page = query.page + 1;
        renderContent()
        pagination__current.innerHTML = query.page;
    }
})
prebutton.addEventListener("click", function () {
    if (query.page > 1) {
        query.page = query.page - 1;
        renderContent()
        pagination__current.innerHTML = query.page;
    }
})
const categoriesList = document.querySelector("#categoriesList")
function drawCategories() {
    categoriesList.innerHTML = ""
    const api = "  http://localhost:3000/category";
    fetch(api)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            const arr = data.map(function (item) {
                // console.log(item)
                return `
                    <div class = "category__item" category__button="${item}">${item}</div>
                `

            })
            return arr
        })
        .then(function (data) {
            categoriesList.innerHTML = data.join("")
        })
        .then(function(){
            const categoryButtons = document.querySelectorAll(`[category__button]`);
            console.log(categoryButtons)
            categoryButtons.forEach(function (item) {
                item.addEventListener("click", function () {
                    searchInput.value = ""
                    query.page = 1
                    pagination__current.innerHTML = query.page
                    query.input = ""                   
                    query.category = item.textContent;
                    console.log(query.category)
                    renderContent();
                })
            })
        })



}
function categorySelection() {

}


renderContent()
SearchingProduct()
sortProduct()
drawCategories()
categorySelection()