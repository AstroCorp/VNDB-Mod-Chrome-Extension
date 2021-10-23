class MainController
{
    run() {
        document.body.addEventListener('mouseover', this.handleMouseover, false);
    }
    
    handleMouseover(ev) {
        // Para mejorar la posición respecto al mouse
        const variation = 20;
        const extraHeight = 169;
        const extraWidth = 230;

        // Guardamos el elemento y la posición del mouse
        const targetElement = ev.target;
        const mousePositionX = ev.pageX + variation;
        const mousePositionY = ev.pageY;

        // Comprobamos que el enlace de la preview es válido
        const isVisualNovelLink = targetElement.nodeName === 'A' && targetElement.href.includes('vndb.org/v');

        // Dimensiones de la web, para ajustar la posición de la preview
        const { width: baseWidth, height: baseHeight } = document.querySelector("#maincontent").getBoundingClientRect();

        const websiteHeight = baseHeight + extraHeight;
        const websiteWidth = baseWidth + extraWidth;

        // Eliminamos la preview existente
        if (document.querySelector('#img-preview')) {
            document.querySelector('#img-preview').remove();
        }
    
        // Si hacemos hover en los enlaces mostramos la preview
        if (isVisualNovelLink) {
            clearTimeout(window.timeoutPreview);
    
            window.timeoutPreview = setTimeout(() => {
                // Accedemos a la ficha
                fetch(targetElement.href, { cache: 'force-cache' })
                    .then(response => response.text())
                    .then(data => {
                        // Obtenemos la preview de la ficha
                        const dom = new DOMParser().parseFromString(data, 'text/html');
                        const img = dom.documentElement.querySelector('.imghover--visible > img');

                        // Si no conseguimos la preview no seguimos
                        if (!img) {
                            return;
                        }

                        // Eliminamos el tittle para que no moleste al ver la preview
                        targetElement.removeAttribute('title');

                        // Generamos la preview
                        const imgPreview = document.createElement('DIV');
                        imgPreview.id = 'img-preview';
                        imgPreview.style.zIndex = 99999;
                        imgPreview.style.position = 'absolute';
                        imgPreview.style.cursor = 'not-allowed';
    
                        document.body.append(imgPreview);
    
                        imgPreview.style.marginLeft = mousePositionX + 'px';
                        imgPreview.style.marginTop = mousePositionY + 'px';
    
                        imgPreview.innerHTML = img.outerHTML;

                        // Si la preview no tiene espacio ajustamos su posición
                        const { width: imgWidth, height: imgHeight } = imgPreview.getBoundingClientRect();

                        const finalImgX = imgWidth + mousePositionX;
                        const finalImgY = imgHeight + mousePositionY;

                        if (websiteWidth && websiteWidth < finalImgX) {
                            imgPreview.style.marginLeft = (websiteWidth - imgWidth - variation) + 'px';
                        }

                        if (websiteHeight && websiteHeight < finalImgY) {
                            imgPreview.style.marginTop = (websiteHeight - imgHeight - variation) + 'px';
                        }
                    });
            }, 100);
        }
    }
}
