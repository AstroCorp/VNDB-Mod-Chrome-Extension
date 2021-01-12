class MainController
{
    run()
    {
        document.body.addEventListener('mouseover', this.handleMouseover, false);
    }
    
    handleMouseover(ev) {
        // Guardamos el elemento y la posición del mouse
        const targetElement = ev.target;
        const mousePosition = {
            x: ev.pageX + 20,
            y: ev.pageY,
        };
        const isVisualNovelLink = targetElement.nodeName === 'A' && targetElement.href.includes('vndb.org/v');

        // Buscamos la preview flotante, si no la creamos
        let imgPreview = document.querySelector('#img-preview');
    
        // Si hacemos hover en los enlaces mostramos la preview
        if (isVisualNovelLink) {
            clearTimeout(window.timeoutPreview);
    
            window.timeoutPreview = setTimeout(() => {
                // Accedemos a la ficha
                fetch(targetElement.href, { cache: 'force-cache' })
                    .then(response => response.text())
                    .then(data => {
                        if (!imgPreview) {
                            imgPreview = document.createElement('DIV');
                            imgPreview.id = 'img-preview';
                            imgPreview.style.zIndex = 99999;
                            imgPreview.style.position = 'absolute';
                            imgPreview.style.cursor = 'not-allowed';
    
                            document.body.append(imgPreview);
                        }
    
                        imgPreview.style.marginLeft = mousePosition.x + 'px';
                        imgPreview.style.marginTop = mousePosition.y + 'px';
    
                        // Obtenemos la preview de la ficha
                        const dom = new DOMParser().parseFromString(data, 'text/html');
                        const img = dom.documentElement.querySelector('.imghover--visible > img');
    
                        imgPreview.innerHTML = img ? img.outerHTML : '';
                    });
            }, 100);
        }

        if(!isVisualNovelLink && imgPreview) {
            imgPreview.innerHTML = '';
        }
    }
}
