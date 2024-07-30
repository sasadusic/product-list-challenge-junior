const addBtns = document.querySelectorAll('.add-btn')

bucket = [1, 2]

addBtns.forEach(addBtn => {
    addBtn.onclick = () => {
        alert(addBtn.dataset.cake)
        const cont = document.createElement('div')
        renderItems()
    }
})

const renderItems = () => {
    const bucketCont = document.querySelector('.card-items')
    bucketCont.innerHTML = ''
    if(bucket.length === 0) {
        bucketCont.innerHTML = '<h2>Bucket is empty</h2>'
    } 
    
    else {
        fetch('./data.json').then(res => res.json()
    ).then(data=> {
        console.log(data)
    })
    bucket.forEach(item => {
        const cont = document.createElement('div')
        cont.classList.add('bucket-item')
        cont.innerHTML = `<h3>${item}</h3>`
        bucketCont.appendChild(cont)
    })
}
}