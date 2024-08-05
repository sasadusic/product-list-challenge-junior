const addBtns = document.querySelectorAll('.add-btn')
const quantitu = document.querySelector('.quantity')

bucket = []

addBtns.forEach(addBtn => {
    addBtn.onclick = () => {
        // alert(addBtn.dataset.cake)
        let curProd = addBtn.dataset.cake
        const valueExists = bucket.some(item => item.prod === curProd)
        if(valueExists){
            // alert('already added')
            const foundItem = bucket.find(item => item.prod === curProd);
            foundItem.quantity++;
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
            numOfCurItems.innerText = '0'
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
                    renderItems()
                }
                else{
                    bucket = bucket.filter(item => item.prod!== minusBtn.dataset.cake)
                    minusBtn.parentNode.removeChild(numOfCurItems)
                    minusBtn.parentNode.removeChild(minusBtn)
                    addBtn.classList.remove('active-add-btn')
                    addBtn.innerHTML = `<img src="assets/images/icon-add-to-cart.svg" alt="" class="add-icon"><p class="phar add-phar">Add to Cart</p>`
                    renderItems()
                }
            }
            addBtn.parentNode.appendChild(minusBtn)
            

            renderItems()
        }
    }
})

const renderItems = () => {
    const bucketCont = document.querySelector('.card-items')
    bucketCont.innerHTML = ''
    if(bucket.length === 0) {
        bucketCont.innerHTML = `<img src="assets/images/illustration-empty-cart.svg" alt="" class="empty-items-img">
        <p class="phar muted">Your added items will appear here</p>`
        quantitu.innerText = '0'
    } 
    
    else {
        fetch('./data.json').then(res => res.json()
    ).then(data=> {
        console.log(data)
    })
    bucket.forEach(item => {
        const cont = document.createElement('div')
        cont.classList.add('bucket-item')
        cont.innerHTML = `<h3>${item.prod}</h3><p>${item.quantity}</p>`
        bucketCont.appendChild(cont)
    })
    let quantityNum = 0
    bucket.forEach(item => {
        quantityNum += item.quantity
    })
    quantitu.innerText = quantityNum
}
}