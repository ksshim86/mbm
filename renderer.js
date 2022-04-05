document.getElementById('goMultipleBrowser').addEventListener('click', () => {
    goMultipleBrowser()
})

function goMultipleBrowser() {
    const $browserCountDiv = $('#browserCountDiv')
    $browserCountDiv.addClass('visually-hidden')

    const colCount = document.getElementById('colCount').value
    const rowCount = document.getElementById('rowCount').value

    const container = document.createElement('div')
    container.className = 'container-fluid h-100 d-flex flex-column'
    container.id = 'browserDiv'

    for (let i = 0; i < rowCount; i++) {
        const row = document.createElement('div')
        row.className = 'row flex-grow-1'

        for (let j = 0; j < colCount; j++) {
            const col = creatElementCol(i, j)
            row.appendChild(col)
        }

        container.appendChild(row)
    }
    
    document.body.appendChild(container)
}

function creatElementCol(i, j) {
    const col = document.createElement('div')
    col.className = 'col p-0 border border-secondary position-relative'
    col.id = `col-${i}-${j}`

    const formDiv = document.createElement('div')
    formDiv.className = 'h-100 d-flex justify-content-center align-items-center'

    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'form-control'
    input.style.width = '80%'
    input.placeholder = 'https://example.com'
    input.id = `urlInput${i}-${j}`

    const a = document.createElement('a')
    a.className = 'btn btn-primary float-end'
    a.id = `urlBtn${i}-${j}`
    a.innerText = '입력'
    a.addEventListener('click', e => {
        urlClicked(i, j)
    })

    formDiv.appendChild(input)
    formDiv.appendChild(a)
    
    col.appendChild(formDiv)

    return col
}

function urlClicked(i, j) {
    const col = document.getElementById(`col-${i}-${j}`)
    const url = document.getElementById(`urlInput${i}-${j}`).value

    const webview = 
    `
    <div class="row h-100">
        <webview class="h-100" id="webview${i}-${j}" src="${url}" allowpopups webPreferences="nativeWindowOpen" partition="partition${i}-${j}"></webview>
    </div>
    `

    col.innerHTML = webview

    const btnDiv = document.createElement('div')
    btnDiv.id = `btnDiv-${i}-${j}`
    btnDiv.className = 'position-absolute bottom-0 end-0 m-1 visually-hidden'

    const zoomIn = document.createElement('button')
    zoomIn.type = 'button'
    zoomIn.className = 'btn btn-primary rounded-circle mx-1'
    zoomIn.style = 'opacity: 0.6; width:40px;'
    zoomIn.innerText ='+'
    zoomIn.setAttribute('title', '페이지 확대')
    zoomIn.addEventListener('click', e => {
        const webview = document.getElementById(`webview${i}-${j}`)
        const zoomLevel = Number(webview.getZoomLevel())

        webview.setZoomLevel(zoomLevel + 1)
    })

    const zoomOut = document.createElement('button')
    zoomOut.type = 'button'
    zoomOut.className = 'btn btn-primary rounded-circle mx-1'
    zoomOut.style = 'opacity: 0.6; width:40px;'
    zoomOut.innerText ='-'
    zoomOut.setAttribute('title', '페이지 축소')
    zoomOut.addEventListener('click', e => {
        const webview = document.getElementById(`webview${i}-${j}`)
        const zoomLevel = Number(webview.getZoomLevel())

        webview.setZoomLevel(zoomLevel - 1)
    })

    const goBack = document.createElement('button')
    goBack.type = 'button'
    goBack.className = 'btn btn-primary rounded-circle mx-1'
    goBack.style = 'opacity: 0.6; width:40px;'
    goBack.innerText ='<'
    goBack.setAttribute('title', '페이지 뒤로가기')
    goBack.addEventListener('click', e => {
        const webview = document.getElementById(`webview${i}-${j}`)
        webview.goBack()
    })

    const del = document.createElement('button')
    del.type = 'button'
    del.className = 'btn btn-primary rounded-circle mx-1'
    del.style = 'opacity: 0.6; width:40px;'
    del.innerText ='X'
    del.setAttribute('title', '이 영역 삭제')
    del.addEventListener('click', e => {
        document.getElementById(`col-${i}-${j}`).remove()
    })

    const reUrl = document.createElement('button')
    reUrl.type = 'button'
    reUrl.className = 'btn btn-primary rounded-circle mx-1'
    reUrl.style = 'opacity: 0.6; width:40px;'
    reUrl.innerText ='R'
    reUrl.setAttribute('title', 'url 다시입력')
    reUrl.addEventListener('click', e => {
        reUrlCreateElement(i, j)
    })

    btnDiv.appendChild(reUrl)
    btnDiv.appendChild(goBack)
    btnDiv.appendChild(zoomIn)
    btnDiv.appendChild(zoomOut)
    btnDiv.appendChild(del)
    col.appendChild(btnDiv)

    col.addEventListener('mouseenter', e => {
        $(`#btnTopDiv-${i}-${j}`).removeClass('visually-hidden')
        $(`#btnDiv-${i}-${j}`).removeClass('visually-hidden')
    })
    col.addEventListener('mouseleave', e => {
        $(`#btnTopDiv-${i}-${j}`).addClass('visually-hidden')
        $(`#btnDiv-${i}-${j}`).addClass('visually-hidden')
    })
}

function reUrlCreateElement(i, j) {
    const col = document.getElementById(`col-${i}-${j}`)
    col.innerHTML = ''

    const formDiv = document.createElement('div')
    formDiv.className = 'h-100 d-flex justify-content-center align-items-center'

    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'form-control'
    input.style.width = '80%'
    input.placeholder = 'https://example.com'
    input.id = `urlInput${i}-${j}`

    const a = document.createElement('a')
    a.className = 'btn btn-primary float-end'
    a.id = `urlBtn${i}-${j}`
    a.innerText = '입력'
    a.addEventListener('click', e => {
        urlClicked(i, j)
    })

    formDiv.appendChild(input)
    formDiv.appendChild(a)
    
    col.appendChild(formDiv)
}
