const addBtns = document.querySelectorAll('.add-btn')
const quantitu = document.querySelector('.quantity')

bucket = []

addBtns.forEach((addBtn, index) => {
    addBtn.onclick = () => {
        // alert(addBtn.dataset.cake)
        let curProd = addBtn.dataset.cake
        const valueExists = bucket.some(item => item.prod === curProd)

        const itemImage = addBtn.parentNode.parentNode.parentNode.querySelector('.item-image')
        
        if(valueExists){
            // alert('already added')
            const foundItem = bucket.find(item => item.prod === curProd);
            foundItem.quantity++;
            let incrementNum = document.querySelector(`.num-of-items-${index}`)
            incrementNum.innerText = foundItem.quantity
            renderItems()
        }
        else{

            bucket.push({prod: curProd, quantity: 1})
            // Increment button
            addBtn.classList.add('active-add-btn')
            addBtn.innerHTML = ''
            addBtn.innerHTML = `<img src="assets/images/icon-increment-quantity.svg" alt= "increment">`
            // Number of items added
            const numOfCurItems = document.createElement('div')
            numOfCurItems.classList.add('num-of-items')
            numOfCurItems.classList.add(`num-of-items-${index}`)
            numOfCurItems.innerText = '1'
            addBtn.parentNode.appendChild(numOfCurItems)
            // Decrement button
            const minusBtn = document.createElement('button')
            minusBtn.classList.add('btn')
            minusBtn.classList.add('minus-btn')
            minusBtn.innerHTML = `<img src="assets/images/icon-decrement-quantity.svg" alt= "increment">`
            minusBtn.dataset.cake = addBtn.dataset.cake
            minusBtn.onclick = () => {
                const foundItem = bucket.find(item => item.prod === minusBtn.dataset.cake);
                if(foundItem.quantity > 1){
                    foundItem.quantity--;
                    let decrementNum = document.querySelector(`.num-of-items-${index}`)
                    decrementNum.innerText = foundItem.quantity

                    renderItems()
                }
                else{
                    bucket = bucket.filter(item => item.prod!== minusBtn.dataset.cake)
                    minusBtn.parentNode.removeChild(numOfCurItems)
                    minusBtn.parentNode.removeChild(minusBtn)
                    addBtn.classList.remove('active-add-btn')
                    addBtn.innerHTML = `<img src="assets/images/icon-add-to-cart.svg" alt="" class="add-icon"><p class="phar add-phar">Add to Cart</p>`
                    itemImage.classList.remove('active-item-image')
                    renderItems()
                }
            }
            addBtn.parentNode.appendChild(minusBtn)

            // Add border to card Image
            if(!itemImage.classList.contains('active-item-image')){
                itemImage.classList.add('active-item-image')
            }
            

            renderItems()
        }
    }
})

const renderItems = () => {
    const bucketCont = document.querySelector('.card-items');
    bucketCont.innerHTML = '';
    const quantityElem = document.querySelector('.quantity'); // Pretpostavljam da imate element za prikaz kvantiteta

    if (bucket.length === 0) {
        bucketCont.innerHTML = `<img src="assets/images/illustration-empty-cart.svg" alt="" class="empty-items-img">
        <p class="phar muted">Your added items will appear here</p>`;
        quantityElem.innerText = '0';
    } else {
        fetch('./data.json')
            .then(res => res.json())
            .then(data => {
                console.log(data);

                // Added Items
                
                bucket.forEach(item => {

                    const curCake = data.find(cake => cake.category === item.prod);
                    // console.log(curCake)

                    const cont = document.createElement('div');
                    cont.classList.add('bucket-item');
                    cont.classList.add('flex');
                    cont.classList.add('between');
                    cont.innerHTML = `
                    <div class='bucket-item-body'>
                    <p class='phar dark bucket-header'>${curCake.category}</p>
                    <div class='flex gap-4'>
                    <p class='phar red'>${item.quantity}x</p>
                    <p class='phar muted'>@ $${curCake.price}</p>
                    <p class='phar muted-2'>$${item.quantity * curCake.price}</p>
                    </div> 
                    </div>
                    `;
                    const deleteItemBtn = document.createElement('button')
                    deleteItemBtn.classList.add('delete-item-btn')
                    deleteItemBtn.innerHTML = `<img src="assets/images/icon-remove-item.svg" alt="">`
                    deleteItemBtn.dataset.cake = item.prod
                    deleteItemBtn.onclick = () => {
                        bucket = bucket.filter(item => item.prod!== deleteItemBtn.dataset.cake)
                        const addBtn = document.querySelector(`[data-cake='${item.prod}']`)
                        addBtn.classList.remove('active-add-btn')
                        addBtn.innerHTML = `<img src="assets/images/icon-add-to-cart.svg" alt="" class="add-icon"><p class="phar add-phar">Add to Cart</p>`

                        const minusBtn = addBtn.parentNode.querySelector('.minus-btn'); // Pronađite minusBtn unutar roditelja

                        if (minusBtn) {
                            addBtn.parentNode.removeChild(minusBtn); // Uklonite minusBtn ako postoji
                        }
                        const numOfItems = addBtn.parentNode.querySelector('.num-of-items'); // Pronađite minusBtn unutar roditelja

                        if (numOfItems) {
                            addBtn.parentNode.removeChild(numOfItems); // Uklonite minusBtn ako postoji
                        }

                        renderItems()
                    }
                    cont.appendChild(deleteItemBtn);
                    bucketCont.appendChild(cont);
                });

                let quantityNum = 0;
                bucket.forEach(item => {
                    quantityNum += item.quantity;
                });
                quantityElem.innerText = quantityNum;

                const confirmCont = document.createElement('div');
                confirmCont.classList.add('confirm-cont');
                let total = bucket.reduce((acc, item) => {
                    const product = data.find(cake => cake.category === item.prod);
                    return acc + (product.price * item.quantity);
                }, 0).toFixed(2);

                confirmCont.innerHTML = `
                <div class='order-total-cont flex between'>
                <p class='phar muted-2 order-total'>Order Total</p>
                <p class='order-total-num'>$${total}</p>
                </div>
                <p class='phar muted carbon flex'><img class='carbon-img' src='assets/images/icon-carbon-neutral.svg' alt='carbon'> This is a <span class='dark carbon-span'>carbon-neutral </span> delivery</p>
        
                <button onclick="openModal()" class="btn confirm-btn">Confirm Order</button>`;
                bucketCont.appendChild(confirmCont);

                // Modal
                const modalBody = document.querySelector('.modal-body')
                modalBody.innerHTML = ''
                bucket.forEach(item => {
                    const itemCont = document.createElement('div')
                    itemCont.classList.add('modal-cont')
                    const dataItem = data.filter(dItem => dItem.category === item.prod)
                    itemCont.innerHTML = `
                    <div class='flex between'>
                    <div class='flex gap-2'>
                    <img src='${dataItem[0].image.thumbnail}' alt='' class='modal-item-img'>
                    <div>
                    <p class='phar dark modal-item-name'>${dataItem[0].category}</p>
                    <div class='flex gap-4'>
                    <p class='phar muted red modal-item-quantity'>x ${item.quantity}</p>
                    <p class='phar muted modal-item-price'>@ $${dataItem[0].price}</p>
                    </div>
                    </div>
                    </div>
                    <div class='flex column gap-2'>
                    <p class='phar dark modal-item-price'>$${dataItem[0].price * item.quantity}</p>
                        </div>
                    </div>
                    `;
                    modalBody.appendChild(itemCont);
                });

            });
    }
}
const modal = document.querySelector('.modal')
const modalClose = document.querySelector('.modal-close')
const openModal = (e) => {
    modal.showModal()
}
// Close Modal
// modalClose.onclick = () => {
//     modal.close()
// }

if(modal){

    modal.onclick = (e) => {

        const dialogDimensions = modal.getBoundingClientRect()
        if(
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) { modal.close()}
    }
}

// Start new order

const startNewOrder = document.querySelector('#start-new-order')
startNewOrder.onclick = () => {
    bucket = []
    renderItems()
    modal.close()
    addBtns.forEach(btn => {
        if(btn.classList.contains('active-add-btn')){
            btn.classList.remove('active-add-btn')
            btn.innerHTML = `<img src="assets/images/icon-add-to-cart.svg" alt="" class="add-icon"><p class="phar add-phar">Add to Cart</p>`
            btn.parentNode.removeChild(btn.parentNode.querySelector('.minus-btn'))
            btn.parentNode.removeChild(btn.parentNode.querySelector('.num-of-items'))
           
            const itemImage = btn.parentNode.parentNode.parentNode.querySelector('.item-image')
            
            if(itemImage.classList.contains('active-item-image')){
                itemImage.classList.remove('active-item-image')
            }
        }
    })
}